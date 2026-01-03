
import { GoogleGenAI, Type } from "@google/genai";
import { IdeaAnalysis, ContractModule } from "./types";

export const analyzeIdea = async (problem: string, users: string): Promise<IdeaAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this Web3 idea for feasibility on the Base Mainnet blockchain. 
    Focus specifically on Base-native advantages like Coinbase Smart Wallets, Account Abstraction, and Paymasters.
    Problem: ${problem}
    Target Users: ${users}`,
    config: {
      systemInstruction: "You are an expert Base Ecosystem Solution Architect. Prioritize L2 gas optimizations and account abstraction for non-crypto users.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feasibilityScore: {
            type: Type.INTEGER,
            description: "A score from 0-100 of how buildable this is on Base Mainnet.",
          },
          categories: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Industry categories.",
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
            description: "Suggested Base-native tools (e.g., Paymaster, Smart Wallet).",
          },
        },
        required: ["feasibilityScore", "categories", "suggestedFunctions", "scopeReduction", "suggestedStack"],
      },
    },
  });

  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr);
};

export const generateContractSource = async (
  analysis: IdeaAnalysis,
  modules: ContractModule[],
  customizations: Record<string, string>
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Generate a production-ready, highly secure Solidity smart contract for Base Mainnet.
  
  Context:
  - Problem: ${analysis.scopeReduction}
  - Modules Selected: ${modules.map(m => m.name).join(', ')}
  - Custom Logic: ${JSON.stringify(customizations)}
  
  Requirements:
  1. Use Solidity 0.8.20.
  2. Implement OpenZeppelin standards.
  3. Include Base-specific optimizations (low storage writes, efficient events).
  4. Ensure compatibility with Coinbase Smart Wallet.
  5. The contract should be named 'ProtoMVP'.
  
  Return ONLY the Solidity code block.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a senior smart contract engineer specialized in Base and L2 optimizations.",
    }
  });

  return response.text || '// Error generating contract source';
};
