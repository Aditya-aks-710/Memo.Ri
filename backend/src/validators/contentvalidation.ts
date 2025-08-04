import { z } from "zod";
import { contentTypes } from "../db";

export const contentSchema = z.object({
    title: z.string(),
    type: z.enum(contentTypes, "Choose the Content type"),
    link: z.url(),
    tags: z.array(z.string()).optional()
});