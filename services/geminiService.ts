
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API Key");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateConversationSummary = async (messages: Message[]): Promise<string> => {
  if (messages.length === 0) {
    return "No messages in this conversation yet.";
  }

  const prompt = `
    Please summarize the following conversation between a guest and a host regarding a vacation rental booking.
    Extract key details like inquiries about dates, amenities, special requests, and any agreements made.
    The summary should be concise and easy to read.

    Conversation:
    ${messages.map(msg => `${msg.senderType} (${new Date(msg.timestamp.seconds * 1000).toLocaleTimeString()}): ${msg.content}`).join('\n')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return "Could not generate summary due to an error.";
  }
};
