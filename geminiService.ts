
import { GoogleGenAI, Type } from "@google/genai";
import { IdeaAnalysis } from "./types";

const API_KEY = process.env.API_KEY;

export const analyzeIdea = async (problem: string, users: string): Promise<IdeaAnalysis> => {
  if (!API_KEY) {
    throw new Error("API Key not configured");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this Web3 idea for feasibility on the Base blockchain.
    Problem: ${problem}
    Target Users: ${users}`,
    config: {
      systemInstruction: "You are an expert Web3 Solution Architect and Smart Contract Auditor. Be concise but critical.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feasibilityScore: {
            type: Type.INTEGER,
            description: "A score from 0-100 of how buildable this is onchain.",
          },
          categories: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Industry categories (e.g., DeFi, NFT, DAO).",
          },
          suggestedFunctions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The 3 most essential smart contract functions.",
          },
          scopeReduction: {
            type: Type.STRING,
            description: "Advice on what to cut for an MVP (max 2 sentences).",
          },
          suggestedStack: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggested Base-native tools or standards.",
          },
        },
        required: ["feasibilityScore", "categories", "suggestedFunctions", "scopeReduction", "suggestedStack"],
      },
    },
  });

  return JSON.parse(response.text);
};
