import { GoogleGenAI, Type } from "@google/genai";

// Initialization helper to ensure we always use the latest API key
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNeighborhoodInsights = async (location: string) => {
  const ai = getClient();
  const prompt = `Analyze the "Neighborhood Vibe" for the area: ${location}. Provide a detailed description of the community, nearby markets, common transport modes, and a safety score (1-10). Include specific local nuances if applicable.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            markets: { type: Type.ARRAY, items: { type: Type.STRING } },
            mosques: { type: Type.ARRAY, items: { type: Type.STRING } },
            transport: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyScore: { type: Type.NUMBER }
          },
          required: ["description", "markets", "transport", "safetyScore"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Error (Insights):", error);
    return null;
  }
};

export const searchLocationOnMap = async (query: string) => {
  const ai = getClient();
  const prompt = `Find information about the area: ${query} in Bangladesh. Provide a brief summary of the location.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapsLinks = chunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        uri: chunk.maps.uri,
        title: chunk.maps.title || query
      }));

    return {
      text: response.text || "No information found.",
      links: mapsLinks
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { text: "Error fetching map data.", links: [] };
  }
};

export const generateRentalAgreement = async (data: {
  tenantName: string;
  landlordName: string;
  address: string;
  rent: number;
  duration: string;
}) => {
  const ai = getClient();
  const prompt = `Generate a modern, simple, and legally sound (but friendly) digital rental agreement for:
  Tenant: ${data.tenantName}
  Landlord: ${data.landlordName}
  Property: ${data.address}
  Monthly Rent: ${data.rent} BDT
  Duration: ${data.duration}
  Include clauses for utility bills (gas, water, electricity), notice period, and security deposit. Use a community-first friendly tone.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Failed to generate agreement.";
  } catch (error) {
    console.error("Gemini Error (Agreement):", error);
    return "Failed to generate agreement. Please try again.";
  }
};