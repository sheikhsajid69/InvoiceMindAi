import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Executive summary of the financial situation." },
    invoiceDetails: {
      type: Type.OBJECT,
      properties: {
        number: { type: Type.STRING },
        dueDate: { type: Type.STRING },
        amount: { type: Type.STRING },
        status: { type: Type.STRING },
      },
      required: ["number", "dueDate", "amount", "status"]
    },
    findings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Bullet points of key facts discovered."
    },
    financialStats: {
      type: Type.OBJECT,
      properties: {
        expected: { type: Type.NUMBER },
        overdue: { type: Type.NUMBER },
        currency: { type: Type.STRING }
      },
      required: ["expected", "overdue", "currency"]
    },
    riskProfile: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
        description: { type: Type.STRING },
        factor: { type: Type.NUMBER, description: "A number between 0 and 100 representing risk intensity." }
      },
      required: ["level", "description", "factor"]
    },
    recommendedActions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["REMINDER", "ESCALATION", "SETTLEMENT"] },
          title: { type: Type.STRING },
          draftContent: { type: Type.STRING }
        },
        required: ["type", "title", "draftContent"]
      }
    }
  },
  required: ["summary", "invoiceDetails", "findings", "financialStats", "riskProfile", "recommendedActions"]
};

export const analyzeDocuments = async (files: File[]): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const model = "gemini-2.5-flash";
  
  // Prepare parts
  const fileParts = await Promise.all(files.map(fileToGenerativePart));
  
  // Prompt
  const textPrompt = {
    text: "Analyze these files (invoices, chats, or records). Extract the financial status, risk, and next steps."
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        role: "user",
        parts: [...fileParts, textPrompt]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual extraction
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
