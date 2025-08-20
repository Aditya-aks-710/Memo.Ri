
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import { IContent, TagModel } from "../db"; 

const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing API key: set process.env.GOOGLE_API_KEY or process.env.GEMINI_API_KEY"
  );
}

const ai = new GoogleGenAI({ apiKey });

export async function createEmbeddingForContent(
  content: IContent
): Promise<number[]> {
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
    const response: any = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: metadataText,
    });

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

    const numericValues = valuesCandidate.map((v: any) => Number(v)).filter((v: any) => !Number.isNaN(v));
    return numericValues;
  } catch (err) {
    console.error("Gemini Embedding Error:", err);
    return [];
  }
}

