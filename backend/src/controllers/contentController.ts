import { Request, Response } from "express";
import { ContentModel, TagModel } from "../db";
import { contentSchema } from "../validators/contentvalidation";
import { getPreviewHTML } from "../utils/scraper";
import { z } from "zod";

// Create Content
export const createContent = async (req: any, res: Response) => {
    try {
        const { title, type, link, tags } = contentSchema.parse(req.body);
        const creatorId = req.userId;

        const previewhtml = await getPreviewHTML(link).catch(err => {
            console.error("Preview fetch failed:", err);
            return "";
        });

        const content = await ContentModel.create({
            title, type, link, creatorId, previewhtml, tags: []
        });

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
            await content.save();
        }

        res.status(201).json({ message: "Content added successfully", contentId: content._id, previewhtml });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid content data", errors: error.issues });
        }
        console.error("Create Content Error:", error);
        res.status(500).json({ message: "Failed to create content" });
    }
};

// Get All Content for a User
export const getContent = async (req: any, res: Response) => {
    try {
        const creatorId = req.userId;
        const contents = await ContentModel.find({ creatorId }).populate([
            { path: 'creatorId', select: 'name email -_id' },
            { path: 'tags', select: 'title -_id' }
        ]);

        if (!contents) {
            return res.status(404).json({ message: "No content found for this user." });
        }
        res.status(200).json({ contents });
    } catch (error) {
        console.error("Get Content Error:", error);
        res.status(500).json({ message: "Failed to fetch content." });
    }
};

// Delete Content by ID
export const deleteContent = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        await ContentModel.findOneAndDelete({ _id: id, creatorId: req.userId });
        res.status(200).json({ success: true, message: "Content deleted successfully." });
    } catch (error) {
        console.error("Delete Content Error:", error);
        res.status(500).json({ message: "Failed to delete content." });
    }
};