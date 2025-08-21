import { Request, Response } from "express";
import { ContentModel, TagModel, IContent } from "../db";
import { contentSchema } from "../validators/contentvalidation";
import { getPreviewHTML } from "../utils/scrapperAPI";
import { createEmbeddingForContent } from "../utils/embeddings";
import { atlasVectorSearch } from "../utils/searchservice";
import { z } from "zod";
import { Types } from "mongoose";

/**
 * Create Content
 */
export const createContent = async (req: Request, res: Response) => {
  try {
    // Validate request body and narrow types
    const parsed = contentSchema.parse(req.body) as {
      title: string;
      type: "image" | "video" | "pdf" | "article" | "audio";
      link: string;
      tags?: string[];
    };
    const { title, type, link, tags = [] } = parsed;

    // Read user id from request (cast because Request is not augmented here)
    const creatorIdStr = (req as any).userId as string | undefined;
    if (!creatorIdStr) {
      return res.status(401).json({ message: "Unauthorized: missing userId" });
    }
    const creatorId = new Types.ObjectId(creatorIdStr);

    // Fetch preview HTML safely (fail softly)
    const previewhtml =
      (await getPreviewHTML(link).catch((err) => {
        console.error("Preview fetch failed:", err);
        return "";
      })) || "";

    // Create initial content document
    const contentDoc = new ContentModel({
      title,
      type,
      link,
      creatorId,
      previewhtml,
      tags: [],
    });

    // Upsert tags and attach their ObjectIds to contentDoc.tags
    if (tags && tags.length > 0) {
      const tagOps = tags.map((tagTitle) => ({
        updateOne: {
          filter: { title: tagTitle },
          update: {
            $setOnInsert: { title: tagTitle },
            // ensure contentId is added to the tag's contentId array on update
            $addToSet: { contentId: contentDoc._id },
          },
          upsert: true,
        },
      }));

      // Perform bulk upsert
      await TagModel.bulkWrite(tagOps);

      // Fetch the saved tags and attach their ids
      const savedTags = await TagModel.find({ title: { $in: tags } }).exec();
      contentDoc.tags = savedTags.map((t) => t._id);
    }

    // Create embedding (if your function expects a full object, pass necessary fields)
    // cast to any to avoid type mismatch between Mongoose doc & your embedding function types
    contentDoc.embedding = await createEmbeddingForContent(contentDoc as any);

    // Save final document
    await contentDoc.save();

    return res.status(201).json({
      message: "Content added successfully",
      contentId: contentDoc._id,
      previewhtml,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Invalid content data", errors: error.issues });
    }
    console.error("Create Content Error:", error);
    return res.status(500).json({ message: "Failed to create content" });
  }
};

/**
 * Get All Content for the current user
 */
export const getContent = async (req: Request, res: Response) => {
  try {
    const creatorIdStr = (req as any).userId as string | undefined;
    if (!creatorIdStr) {
      return res.status(401).json({ message: "Unauthorized: missing userId" });
    }
    const creatorId = new Types.ObjectId(creatorIdStr);

    const contents = await ContentModel.find({ creatorId })
      .populate([
        { path: "creatorId", select: "name email -_id" },
        { path: "tags", select: "title -_id" },
      ])
      .exec();

    if (!contents || contents.length === 0) {
      return res
        .status(404)
        .json({ message: "No content found for this user." });
    }

    return res.status(200).json({ contents });
  } catch (error) {
    console.error("Get Content Error:", error);
    return res.status(500).json({ message: "Failed to fetch content." });
  }
};

/**
 * Delete Content by ID (only creator can delete)
 */
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Content id is required." });
    }

    const creatorIdStr = (req as any).userId as string | undefined;
    if (!creatorIdStr) {
      return res.status(401).json({ message: "Unauthorized: missing userId" });
    }
    const creatorId = new Types.ObjectId(creatorIdStr);

    const deleted = await ContentModel.findOneAndDelete({
      _id: id,
      creatorId,
    }).exec();

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Content not found or not authorized." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Content deleted successfully." });
  } catch (error) {
    console.error("Delete Content Error:", error);
    return res.status(500).json({ message: "Failed to delete content." });
  }
};

/**
 * Search content via your vector search service
 */
export const searchContentController = async (req: Request, res: Response) => {
  const query = (req.query.query as string) || "";
  const limitStr = req.query.limit as string | undefined;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      error: 'A non-empty "query" string parameter is required.',
    });
  }

  // parse limit safely
  let limit = 10;
  if (limitStr) {
    const parsedLimit = parseInt(limitStr, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = Math.min(parsedLimit, 50);
    }
  }

  try {
    console.log(`Performing search for query: "${query}" with limit: ${limit}`);
    const results = await atlasVectorSearch(query, limit);
    return res.status(200).json({
      message: "Search completed successfully.",
      data: results,
    });
  } catch (error) {
    console.error("Error in searchContentController:", error);
    return res.status(500).json({
      error: "An internal server error occurred while processing your search.",
    });
  }
};
