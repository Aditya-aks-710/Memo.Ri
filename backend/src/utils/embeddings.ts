// genai-embed.ts
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { IContent, TagModel } from "../db"; // use the shared IContent from your db types

/**
 * Initialize the Google GenAI client.
 * Looks for GEMINI_API_KEY or GOOGLE_API_KEY (some guides use GEMINI_API_KEY env name).
 */
const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing API key: set process.env.GOOGLE_API_KEY or process.env.GEMINI_API_KEY"
  );
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Create an embedding for a content object using Gemini embedding model.
 * Accepts `tags` as either string[] or ObjectId[] (coerces to strings).
 * Returns an array of numbers (empty array on error).
 */
export async function createEmbeddingForContent(
  content: IContent
): Promise<number[]> {
  // Coerce tags to strings (works for string[] and mongoose ObjectId[])
//   const tagsText = (content.tags ?? [])
//     .map((t: any) => (typeof t === "string" ? t : (t?.toString ? t.toString() : String(t))))
//     .filter((s: string) => !!s)
//     .join(", ");


    let tagsText = "";
    if (content.tags && content.tags.length > 0) {
    const tagDocs = await TagModel.find({ _id: { $in: content.tags } });
    tagsText = tagDocs.map(t => t.title).join(", ");
    }

  const metadataText = [
    `Title: ${content.title ?? ""}`,
    `Type: ${content.type ?? ""}`,
    `Tags: ${tagsText}`,
  ].join("\n");

  try {
    // call embedContent on the SDK's models surface
    const response: any = await ai.models.embedContent({
      model: "gemini-embedding-001",
      // SDK accepts either a single string or an array of strings.
      // We'll pass a single string and read the first embedding back.
      contents: metadataText,
    });

    // Response shape per SDK/docs: response.embeddings is an array of embedding objects
    // each embedding object typically has a `.values` array of numbers.
    const embeddingsArray = response?.embeddings ?? response?.data ?? null;
    if (!embeddingsArray || !Array.isArray(embeddingsArray) || embeddingsArray.length === 0) {
      console.warn("Unexpected embedding response shape:", JSON.stringify(response));
      return [];
    }

    const firstEmbeddingObj = embeddingsArray[0];
    const valuesCandidate =
      Array.isArray(firstEmbeddingObj?.values)
        ? firstEmbeddingObj.values
        : Array.isArray(firstEmbeddingObj)
        ? firstEmbeddingObj
        : null;

    if (!valuesCandidate) {
      console.warn("Could not find numeric embedding values in response:", firstEmbeddingObj);
      return [];
    }

    // Ensure values are numbers; convert if necessary (defensive)
    const numericValues = valuesCandidate.map((v: any) => Number(v)).filter((v: any) => !Number.isNaN(v));
    return numericValues;
  } catch (err) {
    console.error("Gemini Embedding Error:", err);
    return [];
  }
}

/* Example usage (uncomment to test)
(async () => {
  // If you import IContent from your db, you can pass a Mongoose document here
  const emb = await createEmbeddingForContent({
    title: "Hello world",
    type: "article",
    tags: ["example", "test"],
  } as unknown as IContent);
  console.log("Embedding length:", emb.length);
})();
*/
