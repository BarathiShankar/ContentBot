import { GoogleGenerativeAI } from "@google/generative-ai";

// create the Gemini client using the key from the Vite environment
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export async function summarizeText(inputText) {
  const prompt = `Summarize the following text clearly and concisely:\n\n${inputText}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    // the SDK returns a wrapper with `.response` containing the actual
    // `GenerateContentResponse`; `.response.output` holds the text.
    return result.response?.output || "";
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "⚠️ Invalid Gemini API key. Please check .env and reload.";
    }
    return "⚠️ Failed to generate summary. See console for details.";
  }
}