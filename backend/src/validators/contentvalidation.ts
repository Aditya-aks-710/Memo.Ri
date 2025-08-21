import { z } from "zod";
import { contentTypes } from "../db";

export const contentSchema = z.object({
  // Title must be a non-empty string.
  title: z.string({
    required_error: "Title is required.",
    invalid_type_error: "Title must be a string.",
  }).min(1, { message: "Title cannot be empty." }),

  type: z.enum(contentTypes, {
    errorMap: () => ({ message: "Please choose a valid content type." }),
  }),

  // Link must be a valid URL string.
  link: z.string().url({ message: "A valid URL is required." }),

  // Tags are optional and must be an array of strings.
  tags: z.array(z.string()).optional(),
});

export type Content = z.infer<typeof contentSchema>;
