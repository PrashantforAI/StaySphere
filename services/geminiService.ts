import { GoogleGenAI, Type } from "@google/genai";
import { Message, PropertySearchFilters } from '../types';

// The Gemini API key is obtained from the environment variable `process.env.API_KEY`.
// This is pre-configured and accessible in the execution environment as per project guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

/**
 * Parses a user's natural language query to extract structured property search filters.
 * @param query - The user's message to the AI assistant.
 * @returns A promise that resolves with a PropertySearchFilters object or null if no filters are found.
 */
export const extractSearchFiltersFromQuery = async (query: string): Promise<PropertySearchFilters | null> => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful assistant for a vacation rental website in India called StaySphere.
Your task is to identify and extract property search criteria from the user's message.
The criteria include location, number of guests, and specific amenities.
If the user's message seems like a search query, respond with a JSON object containing the extracted filters.
If the message is just a general greeting or question (e.g., "hello", "how are you?", "what can you do?"), respond with an empty JSON object.

Example: "Find me a villa in Lonavala for 6 people with a swimming pool"
Should result in: { "location": "Lonavala", "guests": 6, "amenities": ["swimming pool"] }

Example: "I need a place in Goa"
Should result in: { "location": "Goa" }

Example: "hello there"
Should result in: {}
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            location: { type: Type.STRING, description: 'The city, state, or area the user wants to search in.' },
            guests: { type: Type.INTEGER, description: 'The number of guests.' },
            amenities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of amenities requested, like "pool", "wifi", "parking".'
            },
        },
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: query,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const text = response.text.trim();
        if (text) {
             const parsedJson = JSON.parse(text);
             // Ensure we don't return an empty object if no filters were found
             if (Object.keys(parsedJson).length > 0) {
                 return parsedJson;
             }
        }
        return null; // Return null for non-search queries or empty results
    } catch (error) {
        console.error("Error extracting filters with Gemini:", error);
        return null;
    }
};

/**
 * Generates a conversational response from the AI assistant.
 * @param messages - The history of messages in the conversation.
 * @returns A promise that resolves with the AI's text response.
 */
export const generateChatResponse = async (messages: Message[]): Promise<string> => {
    const model = 'gemini-2.5-flash';

    // Format the conversation history for the prompt
    const formattedHistory = messages.map(msg => {
        return `${msg.senderType}: ${msg.content}`;
    }).join('\n');

    const prompt = `You are Sphere, a friendly AI assistant for StaySphere, a vacation rental platform in India.
Continue the following conversation. Keep your responses concise and helpful.

Conversation History:
${formattedHistory}

Your (ai) response:
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chat response with Gemini:", error);
        return "I'm having trouble connecting right now. Please try again later.";
    }
};
