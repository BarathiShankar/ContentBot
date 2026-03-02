import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
let count = 0;

// Summarize function
export async function summarizeText(inputText) {
  if (count > 5) {
    return "⚠️ Free quota exceeded. Please log in.";
  }

  const prompt = `
Summarize the following text in bullet points only.
Do not include any introductory phrases like "Here’s a summary".
\n\n${inputText}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    count++;
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "⚠️ Invalid Gemini API key.";
    }
    return "⚠️ Failed to generate summary.";
  }
}

// Refinement function
export async function refineSummary(summary, mode) {
  let prompt = "";

  if (mode === "expand") {
    prompt = `Make it more Enlarged,but answer in bulletins only
    :\n\n${summary}`;
  } else if (mode === "simplify") {
    prompt = `Simplify the following as bulletins:\n\n${summary}`;
  } else if (mode === "detail") {
    prompt = `Write like an essay,make it more descriptive:\n\n${summary}`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini refinement error:", error);
    return "⚠️ Failed to refine summary.";
  }
}
