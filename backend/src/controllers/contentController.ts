import { Request, Response } from "express";
import { ContentModel, TagModel, IContent } from "../db";
import { contentSchema } from "../validators/contentvalidation";
import { getPreviewHTML } from "../utils/scraper";
import { createEmbeddingForContent } from "../utils/embeddings";
import { z } from "zod";
import { Types } from 'mongoose';

// Create Content
export const createContent = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { title, type, link, tags } = contentSchema.parse(req.body);
    const creatorId = (req as any).userId;

    // Fetch preview HTML safely
    const previewhtml = await getPreviewHTML(link).catch(err => {
      console.error("Preview fetch failed:", err);
      return "";
    });

    // Create initial content
    let content: IContent = new ContentModel({
      title,
      type,
      link,
      creatorId,
      previewhtml,
      tags: []
    });

    // Handle tags: upsert & attach to content
    if (tags && tags.length > 0) {
      const tagOps = tags.map(tagTitle => ({
        updateOne: {
          filter: { title: tagTitle },
          update: { $setOnInsert: { title: tagTitle }, $addToSet: { contentId: content._id } },
          upsert: true
        }
      }));

      await TagModel.bulkWrite(tagOps);
      const savedTags = await TagModel.find({ title: { $in: tags } });
      content.tags = savedTags.map(t => t._id);
    }

    // Generate embedding for semantic search
    content.embedding = await createEmbeddingForContent(content);

    // Save content with tags + embedding
    await content.save();

    res.status(201).json({
      message: "Content added successfully",
      contentId: content._id,
      previewhtml
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid content data", errors: error.issues });
    }
    console.error("Create Content Error:", error);
    res.status(500).json({ message: "Failed to create content" });
  }
};

// Get All Content for a User
export const getContent = async (req: Request, res: Response) => {
  try {
    const creatorId = (req as any).userId;

    const contents = await ContentModel.find({ creatorId })
      .populate([
        { path: 'creatorId', select: 'name email -_id' },
        { path: 'tags', select: 'title -_id' }
      ]);

    if (!contents || contents.length === 0) {
      return res.status(404).json({ message: "No content found for this user." });
    }

    res.status(200).json({ contents });

  } catch (error) {
    console.error("Get Content Error:", error);
    res.status(500).json({ message: "Failed to fetch content." });
  }
};

// Delete Content by ID
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const creatorId = (req as any).userId;

    const deleted = await ContentModel.findOneAndDelete({ _id: id, creatorId });

    if (!deleted) {
      return res.status(404).json({ message: "Content not found or not authorized." });
    }

    res.status(200).json({ success: true, message: "Content deleted successfully." });

  } catch (error) {
    console.error("Delete Content Error:", error);
    res.status(500).json({ message: "Failed to delete content." });
  }
};

import { atlasVectorSearch } from '../utils/searchservice';

export const searchContentController = async (req: Request, res: Response) => {
  // 1. Extract query and limit from request query parameters
  const query = req.query.query as string;
  const limitStr = req.query.limit as string;

  console.log(query);
  // 2. Validate the input
  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      error: 'A non-empty "query" string parameter is required.',
    });
  }

  // 3. Parse limit with a default and max value
  let limit = 10; // Default number of results
  if (limitStr) {
    const parsedLimit = parseInt(limitStr, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      limit = Math.min(parsedLimit, 50);
    }
  }

  try {
    // 4. Call the search service to get results
    console.log(`Performing search for query: "${query}" with limit: ${limit}`);
    
    const results = await atlasVectorSearch(query, limit);

    return res.status(200).json({
      message: 'Search completed successfully.',
      data: results,
    });

  } catch (error) {
    console.error('Error in searchContentController:', error);
    return res.status(500).json({
      error: 'An internal server error occurred while processing your search.',
    });
  }
};