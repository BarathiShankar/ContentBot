import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function summarizeText(inputText) {
  const prompt = `
Summarize the following text in bullet points only.
Do not include any introductory phrases like "Here’s a summary".
\n\n${inputText},Just give me the summarry as bulletins.
`;


  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    // ✅ Correct way to extract text
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "Invalid Gemini API key. ";
    }
    return "Failed to generate summary.";
  }
}
