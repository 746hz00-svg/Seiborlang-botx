import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export async function sendMessage(history: ChatMessage[], message: string) {
  if (!apiKey) {
    throw new Error("API key missing. Please configure GEMINI_API_KEY.");
  }

  const model = "gemini-3-flash-preview";
  
  // Format history for the SDK
  const contents = [
    ...history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: "You are BotX, a sophisticated AI assistant with a professional, sharp, and helpful personality. You were created by Seiborlang Project BotX. Your tone is refined, slightly technical, and always helpful. You should occasionally acknowledge your origin if asked about yourself.",
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
}
