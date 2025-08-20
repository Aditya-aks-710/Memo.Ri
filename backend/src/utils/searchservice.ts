// search-service.ts

import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { IContent } from "../db"; // 👈 You need to provide this type from your project
import { ContentModel } from "../db";

// =================================================================================
// 1. INITIALIZATION
// =================================================================================

/**
 * Initialize the Google GenAI client.
 * Looks for GOOGLE_API_KEY or GEMINI_API_KEY.
 */
const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing API key: set process.env.GOOGLE_API_KEY or process.env.GEMINI_API_KEY"
  );
}

const ai = new GoogleGenAI({ apiKey });

// =================================================================================
// 2. INTERFACES & TYPES
// =================================================================================

// An extended interface to represent content that includes its vector embedding
export interface IContentWithEmbedding extends IContent {
  embedding: number[];
}

// =================================================================================
// 3. CORE HELPER FUNCTIONS
// =================================================================================

/**
 * Creates an embedding for a simple text query using the Gemini model.
 * @param query The user's search query string.
 * @returns An array of numbers (empty array on error).
 */
async function createEmbeddingForQuery(query: string): Promise<number[]> {
  if (!query) return [];

  try {
    const response: any = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: query,
    });

    // Correct shape: response.embeddings[0].values
    const embeddingsArray = response?.embeddings ?? response?.data ?? null;
    if (!embeddingsArray || !Array.isArray(embeddingsArray) || embeddingsArray.length === 0) {
      console.warn("Unexpected embedding response shape for query:", JSON.stringify(response));
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
      console.warn("Could not find numeric embedding values in query response:", firstEmbeddingObj);
      return [];
    }

    return valuesCandidate.map((v: any) => Number(v)).filter((v: any) => !Number.isNaN(v));
  } catch (err) {
    console.error("Gemini Query Embedding Error:", err);
    return [];
  }
}

/**
 * Calculates the cosine similarity between two vectors.
 * @param vecA The first vector (array of numbers).
 * @param vecB The second vector (array of numbers).
 * @returns A similarity score between -1 and 1.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);

  if (denominator === 0) {
    return 0; // Avoid division by zero
  }

  return dotProduct / denominator;
}


// =================================================================================
// 4. EXPORTED SEARCH FUNCTIONS
// =================================================================================

/**
 * Performs a simple, brute-force vector search over an in-memory array.
 * ✅ Good for small datasets, prototyping, or testing.
 * ❌ Not recommended for production with large amounts of data due to performance.
 * @param query The user's search query.
 * @param allContent An array of content objects, each with a pre-calculated `embedding` field.
 * @param limit The number of top results to return.
 * @returns A sorted list of content with their similarity scores.
 */
export async function simpleVectorSearch(
  query: string,
  allContent: IContentWithEmbedding[],
  limit: number = 5
) {
  const queryEmbedding = await createEmbeddingForQuery(query);

  if (queryEmbedding.length === 0) {
    console.error("Could not create embedding for the search query.");
    return [];
  }

  const scoredContent = allContent.map(content => ({
    ...content,
    score: cosineSimilarity(queryEmbedding, content.embedding),
  }));

  scoredContent.sort((a, b) => b.score - a.score);

  return scoredContent.slice(0, limit);
}


/**
 * Performs a highly efficient vector search using a MongoDB Atlas Vector Search index.
 * ✅ Recommended for production. Fast, scalable, and powerful.
 * ❌ Requires setting up MongoDB Atlas and a Vector Search index first.
 * @param query The user's search query.
 * @param limit The number of results to return.
 * @returns A list of matching documents from the database with their similarity scores.
 */
export async function atlasVectorSearch(query: string, limit: number = 5) {
  const queryEmbedding = await createEmbeddingForQuery(query);
  if (queryEmbedding.length === 0) return [];

  const results = await ContentModel.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 150,
        limit,
      },
    },
    { $addFields: { score: { $meta: "vectorSearchScore" } } },

    // lookup tags by converting string ids -> ObjectId and project only title (no _id)
    {
      $lookup: {
        from: "tags",
        let: { tagIds: { $map: { input: "$tags", as: "id", in: { $toObjectId: "$$id" } } } },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$tagIds"] } } },
          { $project: { _id: 0, title: 1 } }   // only title
        ],
        as: "tagDocs"
      }
    },

    // replace tags with the array of objects that contain only { title }
    { $addFields: { tags: "$tagDocs" } },

    { $match: { score: { $gte: 0.8 } } },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        title: 1,
        type: 1,
        link: 1,
        previewhtml: 1,
        tags: 1,
        score: 1,
      },
    },
  ]);

  return results;
}
