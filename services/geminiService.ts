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
The criteria include location, check-in/check-out dates, number of guests (adults, kids, infants), amenities, price range, and rules like pet-friendliness or dietary options.
If the user's message seems like a search query, respond with a JSON object containing the extracted filters.
If the message is just a general greeting or question (e.g., "hello", "how are you?"), respond with an empty JSON object.

Example: "Find me a pet-friendly villa in Lonavala for 4 adults under 20000 with a swimming pool"
Should result in: { "location": "Lonavala", "guests": { "adults": 4 }, "isPetFriendly": true, "amenities": ["swimming pool"], "priceMax": 20000 }

Example: "I need a place in Goa for 2 people that allows non-veg food"
Should result in: { "location": "Goa", "guests": { "adults": 2 }, "isNonVegAllowed": true }

Example: "hello there"
Should result in: {}
`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            location: { type: Type.STRING, description: 'The city, state, or area the user wants to search in.' },
            checkIn: { type: Type.STRING, description: 'The check-in date in YYYY-MM-DD format.' },
            checkOut: { type: Type.STRING, description: 'The check-out date in YYYY-MM-DD format.' },
            guests: {
                type: Type.OBJECT,
                description: 'The number of guests, broken down by age.',
                properties: {
                    adults: { type: Type.INTEGER, description: 'Number of adults (age 18+).' },
                    kids: { type: Type.INTEGER, description: 'Number of kids (age 5-12).' },
                    infants: { type: Type.INTEGER, description: 'Number of infants (below 5).' },
                }
            },
            amenities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'A list of amenities requested, like "pool", "wifi", "parking".'
            },
            priceMin: { type: Type.NUMBER, description: "The minimum price per night." },
            priceMax: { type: Type.NUMBER, description: "The maximum price per night." },
            isPetFriendly: { type: Type.BOOLEAN, description: "Whether the user wants a pet-friendly property." },
            isVegAllowed: { type: Type.BOOLEAN, description: "Whether the user requires vegetarian-friendly properties." },
            isNonVegAllowed: { type: Type.BOOLEAN, description: "Whether the user requires properties that allow non-vegetarian food." },
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