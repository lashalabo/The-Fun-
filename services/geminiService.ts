
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled. Make sure to set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "A creative and catchy title for the event."
            },
            description: {
                type: Type.STRING,
                description: "A brief, exciting description of the event (2-3 sentences)."
            },
            category: {
                type: Type.STRING,
                description: "A relevant category from this list: Party, Picnic, Sports, Club, Gaming, Study"
            }
        },
        required: ["title", "description", "category"]
    }
};

export const generateEventIdeas = async (prompt: string): Promise<any[]> => {
  if (!API_KEY) {
    return Promise.resolve([
      { title: 'Mock AI Event: Beach Bonfire', description: 'A classic beach bonfire with s\'mores and music. (This is mock data as API key is missing)', category: 'Party' },
      { title: 'Mock AI Event: Park Yoga', description: 'A relaxing morning yoga session in the park. (This is mock data as API key is missing)', category: 'Sports' },
    ]);
  }
  
  try {
    const fullPrompt = `Based on the following vibe, generate 3 creative event ideas. Vibe: "${prompt}"`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating event ideas with Gemini:", error);
    // Return a fallback or an empty array in case of an error
    return [];
  }
};
