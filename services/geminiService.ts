import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Message, Property, PropertySearchFilters, Booking, PropertyStatus, HostInsight, AiImageAnalysis } from '../types';
import { dummyProperties } from "../data/dummyData";
import { ROUTES } from "../constants";

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

    const systemInstruction = `You are Sphere, a friendly and proactive AI assistant for StaySphere, a vacation rental platform in India.
Your goal is to help users find their perfect vacation rental through conversation. You are an expert on all the properties available.
1.  Analyze the conversation history and the user's latest message. Your primary goal is to deeply understand the user's needs.
2.  Be proactive! If the user gives a vague request (e.g., "Find a place in Goa"), ask clarifying questions to understand the *vibe* of their trip. For example: "Are you looking for a vibrant, party-friendly area, or a more quiet and relaxing retreat? Is this for a special occasion?".
3.  From the conversation, infer key search filters: 'location' (city), 'checkIn' (YYYY-MM-DD), 'checkOut' (YYYY-MM-DD), and 'guests' (total number of adults and children). Populate the 'inferredFilters' object with these values if you can determine them.
4.  Based on the gathered criteria, search the provided JSON array of 'AVAILABLE PROPERTIES'. Find properties that are a good match.
5.  IMPORTANT: Analyze the last 2-3 messages. If you have ALREADY suggested properties for the current search criteria, DO NOT suggest them again. Instead, provide a conversational follow-up (e.g., "Do any of these catch your eye? Let me know if you'd like to see more options or refine the search!") and return an empty 'propertyIds' array.
6.  If you find NEW, relevant properties, respond with a helpful message (e.g., "I found a few great options for you!") and include their IDs in the 'propertyIds' array. Suggest a maximum of 3 properties at a time.
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

/**
 * Generates a friendly guest bio from keywords.
 * @param keywords - A string of user-provided keywords (e.g., "quiet, loves reading, foodie").
 * @returns A promise that resolves with the generated bio string.
 */
export const generateGuestBio = async (keywords: string): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    You are a friendly AI assistant helping a guest write their profile bio for a vacation rental platform called StaySphere.
    The tone should be warm, friendly, and respectful, making them sound like an ideal guest.
    Write a short, 2-3 sentence bio based on these keywords: "${keywords}".
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating guest bio with Gemini:", error);
    return "I'm having trouble writing this right now. Please try again in a moment.";
  }
};

/**
 * Simulates an AI generating actionable insights for a host's dashboard.
 * @param properties The host's list of properties.
 * @param bookings The host's list of bookings.
 * @returns A promise that resolves to an array of HostInsight objects.
 */
export const generateHostInsights = async (
    properties: Property[],
    bookings: Booking[]
): Promise<HostInsight[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const insights: HostInsight[] = [];

    // Insight 1: Complete in-progress listings
    const inProgressListing = properties.find(p => p.status === PropertyStatus.IN_PROGRESS);
    if (inProgressListing) {
        insights.push({
            title: "Complete Your Listing!",
            message: `Your property "${inProgressListing.title || 'Untitled Listing'}" is still in progress. Complete it to start getting bookings.`,
            ctaLink: ROUTES.HOST_EDIT_PROPERTY.replace(':propertyId', inProgressListing.propertyId),
            ctaText: "Continue Listing",
        });
    }

    // Insight 2: Suggest reviewing pricing for upcoming holidays (simplified)
    const upcomingHoliday = "Diwali"; // In a real app, this would come from a calendar API
    const hasBookingsOnHoliday = bookings.some(b => {
        // Dummy date check for demonstration
        const checkin = new Date(b.checkIn);
        return checkin.getMonth() === 9 || checkin.getMonth() === 10; // Oct/Nov
    });
    
    if (!hasBookingsOnHoliday) {
         insights.push({
            title: `Optimize for ${upcomingHoliday}!`,
            message: `The ${upcomingHoliday} season is approaching. Review your pricing to attract more guests during this high-demand period.`,
            ctaLink: ROUTES.HOST_CALENDAR,
            ctaText: "Review Calendar",
        });
    }

    // Insight 3: Nudge to add more photos if a listing has few
    const listingWithFewPhotos = properties.find(p => p.images.length < 3);
    if (listingWithFewPhotos) {
         insights.push({
            title: "More Photos, More Bookings",
            message: `Your listing "${listingWithFewPhotos.title}" has fewer than 3 photos. Listings with more high-quality photos get more attention.`,
            ctaLink: ROUTES.HOST_EDIT_PROPERTY.replace(':propertyId', listingWithFewPhotos.propertyId),
            ctaText: "Add Photos",
        });
    }

    return insights.slice(0, 2); // Return a max of 2 insights for a clean UI
};

export interface ListingGuideResponse {
    nextQuestion: string;
    updatedData: Partial<Property>;
    isComplete: boolean;
}

const updatePropertyDataDeclaration: FunctionDeclaration = {
    name: 'updatePropertyData',
    description: 'Updates the property object with details extracted from the user\'s message.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            propertyType: { type: Type.STRING, enum: ['villa', 'apartment', 'cottage', 'unique'] },
            location: {
                type: Type.OBJECT,
                properties: {
                    city: { type: Type.STRING },
                    area: { type: Type.STRING },
                    state: { type: Type.STRING },
                }
            },
            capacity: {
                type: Type.OBJECT,
                properties: {
                    maxGuests: { type: Type.INTEGER },
                    bedrooms: { type: Type.INTEGER },
                    bathrooms: { type: Type.INTEGER },
                }
            },
            pricing: {
                 type: Type.OBJECT,
                 properties: {
                    basePrice: { type: Type.INTEGER },
                 }
            },
        }
    }
};

/**
 * Guides a host through the property listing process conversationally.
 * @param conversationHistory The history of the listing conversation.
 * @param currentPropertyData The current state of the property object.
 */
export const guidePropertyListing = async (
    conversationHistory: Message[],
    currentPropertyData: Partial<Property>,
): Promise<ListingGuideResponse> => {
    const model = 'gemini-2.5-flash';
    
    const formattedHistory = conversationHistory.map(msg => `${msg.senderType}: ${msg.content}`).join('\n');

    const systemInstruction = `You are Sphere, an expert AI assistant helping a host list their property on StaySphere.
Your goal is to have a natural, friendly conversation to gather all necessary details for the listing.
1.  First, analyze the 'CURRENT PROPERTY DATA' provided to see what information is already filled in.
2.  Your primary job is to keep the conversation going by identifying the *next logical piece of missing information* and asking a single, clear question to get it. You must continue this process until all information is gathered. Do not stop asking questions prematurely.
3.  The order of information to gather is generally: title, propertyType, location (city, area, state), capacity (max guests, bedrooms, bathrooms), amenities, description, and finally pricing (base price).
4.  When the user provides an answer, use the 'updatePropertyData' tool to extract the information and structure it.
5.  After successfully extracting data, determine the next piece of missing info and ask the question for it in your text response.
6.  If the user provides information for multiple sections at once, extract everything you can.
7.  Keep your responses concise, friendly, and encouraging. Use emojis sparingly.
8.  IMPORTANT: Your response MUST ALWAYS include a 'text' part containing the next question. The only time you should not ask a question is when all key fields (title, propertyType, location.city, capacity.maxGuests, description, pricing.basePrice) are filled. When complete, your text response should be a final confirmation message like "Great, that looks like all the basic info! Feel free to add photos and publish when you're ready."`;

    const prompt = `
      CURRENT PROPERTY DATA:
      ${JSON.stringify(currentPropertyData, null, 2)}
      
      ---
      
      CONVERSATION HISTORY:
      ${formattedHistory}

      ---
      Your task: Based on the user's last response, process the information using the 'updatePropertyData' tool. Then, looking at the updated property data, ask the next single question for the most important piece of missing information. Your job is to continue the conversation.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                tools: [{ functionDeclarations: [updatePropertyDataDeclaration] }]
            }
        });
        
        const functionCalls = response.functionCalls;
        let updatedData = {};

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];
            if (call.name === 'updatePropertyData') {
                updatedData = call.args;
            }
        }
        
        // Manually extract text from response parts to avoid the warning
        // triggered by the .text accessor when function calls are present.
        const nextQuestion = response.candidates?.[0]?.content?.parts
            .map(part => part.text)
            .filter(text => !!text) // Filter out undefined/empty strings
            .join(' ') || '';

        const finalData = { ...currentPropertyData, ...updatedData };
        // A more robust check for completion, accounting for nested properties and zero values.
        const isComplete = !!(
            finalData.title &&
            finalData.propertyType &&
            finalData.location?.city &&
            finalData.capacity?.maxGuests != null &&
            finalData.description &&
            finalData.pricing?.basePrice != null
        );

        let finalNextQuestion = nextQuestion;
        if (isComplete && !finalNextQuestion) {
            finalNextQuestion = "Great, that looks like all the basic info! You can now add photos and other details. When you're ready, click 'Publish Listing'.";
        }
        
        return {
            nextQuestion: finalNextQuestion,
            updatedData: updatedData,
            isComplete: isComplete,
        };

    } catch (error) {
        console.error("Error in conversational listing guide:", error);
        return {
            nextQuestion: "I'm sorry, I encountered an error. Could you please repeat that?",
            updatedData: {},
            isComplete: false,
        };
    }
};

/**
 * Analyzes a property image to generate a caption and identify features.
 * @param base64Image The base64 encoded image string.
 * @param mimeType The MIME type of the image.
 */
export const analyzePropertyImage = async (base64Image: string, mimeType: string): Promise<AiImageAnalysis> => {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an expert real estate marketing assistant. Your task is to analyze an image of a vacation rental property.
    - Write a short, appealing caption for the image (max 15 words).
    - Identify the room type (e.g., 'Bedroom', 'Living Room', 'Pool Area', 'Kitchen', 'Exterior').
    - List key features or amenities visible in the photo as an array of strings.
    - Respond ONLY in JSON format according to the provided schema. No markdown.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            suggestedCaption: { type: Type.STRING },
            roomType: { type: Type.STRING },
            detectedFeatures: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ["suggestedCaption", "roomType", "detectedFeatures"]
    };

    const imagePart = { inlineData: { mimeType, data: base64Image } };
    const textPart = { text: "Analyze this property image and return the analysis in JSON format." };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });

        const text = response.text.trim();
        return JSON.parse(text) as AiImageAnalysis;

    } catch (error) {
        console.error("Error analyzing property image with Gemini:", error);
        return {
            suggestedCaption: "A beautiful view of the property.",
            roomType: "Uncertain",
            detectedFeatures: []
        };
    }
};