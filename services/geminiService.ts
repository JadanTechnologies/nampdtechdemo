
import { GoogleGenAI } from "@google/genai";

// Function to convert a file to a base64 string
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            resolve('');
        }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const performOcrOnNin = async (file: File, ai: GoogleGenAI | null): Promise<{ fullName: string; nin: string } | null> => {
  if (!ai) {
    console.error("Cannot perform OCR: Gemini client is not available.");
    // Simulate a delay and return mock data for development
    await new Promise(res => setTimeout(res, 1500));
    return { fullName: "Mock Name From OCR", nin: "98765432100" };
  }

  try {
    const imagePart = await fileToGenerativePart(file);
    const prompt = `
      Analyze the image of this Nigerian National Identity Number (NIN) slip.
      Extract the full name (usually labeled as 'Full Name' or 'Surname' and 'First Name') and the NIN (labeled 'National Identification Number').
      Provide the response as a valid JSON object with two keys: "fullName" and "nin".
      
      Example response:
      {
        "fullName": "JOHN DOE",
        "nin": "12345678901"
      }

      If you cannot find the information, return a JSON object with null values.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, { text: prompt }] },
    });
    
    const text = response.text;
    if (!text) {
        throw new Error("No text response from Gemini API.");
    }

    // Clean the response text to ensure it's valid JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonString);

    return {
      fullName: parsedData.fullName || '',
      nin: parsedData.nin || '',
    };
  } catch (error) {
    console.error('Error performing OCR with Gemini API:', error);
    // Fallback to mock data on API error
    return { fullName: "OCR Failed Mock Name", nin: "10020030044" };
  }
};
