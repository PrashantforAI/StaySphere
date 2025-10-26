import { GoogleGenAI, Type } from "@google/genai";
import { Message, Property, PropertySearchFilters } from '../types';
import { dummyProperties } from "../data/dummyData";

// The Gemini API key is obtained from the environment variable `process.env.API_KEY`.
// This is pre-configured and accessible in the execution environment as per project guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface VerificationResult {
    isDocumentValid: boolean;
    documentType: string;
    validationSummary: string;
    rejectionReason?: string;
}

/**
 * Uses Gemini to verify a user-uploaded document.
 * @param base64Image - The base64 encoded string of the document image.
 * @param mimeType - The MIME type of the image (e.g., 'image/jpeg').
 * @param documentDescription - A description of the document being verified (e.g., "Government ID").
 * @returns A promise that resolves with the structured verification result.
 */
export const verifyDocumentWithAI = async (
    base64Image: string,
    mimeType: string,
    documentDescription: string
): Promise<VerificationResult> => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an expert document verification AI for an Indian platform called StaySphere.
Your task is to analyze an image of a document and determine if it's a valid, legitimate document of the type described.
Look for signs of authenticity and common features of the described document type. Be critical but fair.
Respond ONLY in JSON format according to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

    const imagePart = {
        inlineData: {
            mimeType,
            data: base64Image,
        },
    };

    const textPart = {
        text: `Please verify this document, which is supposed to be a ${documentDescription}.`,
    };
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            isDocumentValid: {
                type: Type.BOOLEAN,
                description: "Is the document a recognizable and seemingly valid document of the described type?"
            },
            documentType: {
                type: Type.STRING,
                description: "The type of document you identified (e.g., 'Aadhaar Card', 'PAN Card', 'Property Deed', 'Unknown')."
            },
            validationSummary: {
                type: Type.STRING,
                description: "A brief, one-sentence summary of the verification result. Be encouraging on success and clear on failure."
            },
            rejectionReason: {
                type: Type.STRING,
                description: "If the document is not valid, provide a clear, user-friendly reason (e.g., 'The image is too blurry', 'This does not appear to be a valid document type')."
            },
        },
        required: ["isDocumentValid", "documentType", "validationSummary"],
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const text = response.text.trim();
        return JSON.parse(text) as VerificationResult;

    } catch (error) {
        console.error("Error verifying document with Gemini:", error);
        // Return a structured error response
        return {
            isDocumentValid: false,
            documentType: 'Error',
            validationSummary: "Could not verify the document due to an AI service error.",
            rejectionReason: "An unexpected error occurred during verification. Please try again later."
        };
    }
};


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


export interface AiChatResponse {
  text: string;
  propertyIds?: string[];
  inferredFilters?: PropertySearchFilters;
}

/**
 * Generates a conversational response from the AI assistant, potentially including property suggestions.
 * @param messages - The history of messages in the conversation.
 * @returns A promise that resolves with the AI's response object.
 */
export const generateChatResponse = async (messages: Message[]): Promise<AiChatResponse> => {
    const model = 'gemini-2.5-flash';

    // Provide the AI with the full context of available properties.
    const propertyContext = JSON.stringify(dummyProperties, null, 2);

    // Format the conversation history for the prompt
    const formattedHistory = messages.map(msg => {
        return `${msg.senderType}: ${msg.content}`;
    }).join('\n');

    const systemInstruction = `You are Sphere, a friendly AI assistant for StaySphere, a vacation rental platform in India.
Your goal is to help users find their perfect vacation rental through conversation.
1.  Analyze the conversation history and the user's latest message.
2.  From the conversation, infer key search filters: 'location' (city), 'checkIn' (YYYY-MM-DD), 'checkOut' (YYYY-MM-DD), and 'guests' (total number of adults and children). Populate the 'inferredFilters' object with these values if you can determine them.
3.  Based on the gathered criteria, search the provided JSON array of 'AVAILABLE PROPERTIES'. Find properties that are a good match.
4.  IMPORTANT: Analyze the last 2-3 messages. If you have ALREADY suggested properties for the current search criteria, DO NOT suggest them again. Instead, provide a conversational follow-up (e.g., "Do any of these catch your eye?") and return an empty 'propertyIds' array.
5.  If you find NEW, relevant properties, respond with a helpful message (e.g., "I found a few great options for you!") and include their IDs in the 'propertyIds' array. Suggest a maximum of 3 properties at a time.
6.  If you don't have enough information to perform a good search (e.g., the user just says "I want a villa"), ask clarifying questions to get the location and number of guests. Do not suggest properties if you are unsure.
7.  If the user asks a specific question about a property (e.g., "Does the Goa villa have a bathtub?"), use the detailed information in the 'AVAILABLE PROPERTIES' JSON to answer accurately.
8.  You MUST ONLY respond in JSON format according to the provided schema. Do not include any markdown formatting like \`\`\`json.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            text: { type: Type.STRING, description: "Your conversational response to the user. This is always required." },
            propertyIds: {
                type: Type.ARRAY,
                description: "An array of propertyId strings that match the user's search query. Only include this if you found relevant properties AND have not recently suggested them.",
                items: { type: Type.STRING }
            },
            inferredFilters: {
                type: Type.OBJECT,
                description: "The search filters you inferred from the conversation.",
                properties: {
                    checkIn: { type: Type.STRING, description: "Inferred check-in date in YYYY-MM-DD format." },
                    checkOut: { type: Type.STRING, description: "Inferred check-out date in YYYY-MM-DD format." },
                    guests: { 
                        type: Type.OBJECT,
                        properties: {
                            adults: { type: Type.INTEGER, description: "Number of adults." },
                            kids: { type: Type.INTEGER, description: "Number of children." }
                        }
                    }
                }
            }
        },
        required: ["text"]
    };

    const prompt = `
      AVAILABLE PROPERTIES:
      ${propertyContext}
      
      ---

      Conversation History:
      ${formattedHistory}

      Your task is to respond to the last message from the 'guest' based on the conversation history and the list of available properties.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const text = response.text.trim();
        return JSON.parse(text) as AiChatResponse;

    } catch (error) {
        console.error("Error generating chat response with Gemini:", error);
        return {
            text: "I'm having trouble connecting right now. Please try again later.",
        };
    }
};


/**
 * Generates a compelling property description using AI.
 * @param title - The title of the property.
 * @param type - The type of property (e.g., Villa, Apartment).
 * @param location - The city and state of the property.
 * @param amenities - A list of key amenities.
 * @returns A promise that resolves with the generated description string.
 */
export const generatePropertyDescription = async (
  title: string,
  type: string,
  location: string,
  amenities: string[]
): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    Write a captivating and welcoming property description for a vacation rental listing on a platform called StaySphere.
    The description should be around 3-4 sentences long and highlight the key features to attract guests.
    
    Property Details:
    - Title: ${title}
    - Type: ${type}
    - Location: ${location}
    - Key Amenities: ${amenities.join(', ')}

    Generate a description that is both informative and enticing.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating property description with Gemini:", error);
    return "Could not generate a description. Please write one manually.";
  }
};