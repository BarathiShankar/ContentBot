import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const summarizeText = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Please provide a concise and clear summary of the following text as (not as md file) bulltins (dont write here's the summary and all those stuffs):\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw error;
  }
};

export const refineSummary = async (summary, mode) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    let prompt = "";
    
    if (mode === "expand") {
      prompt = `Please expand on this summary with more details and context :\n\n${summary}`;
    } else if (mode === "simplify") {
      prompt = `Please simplify this summary to make it more concise and easier to understand as bulltins:\n\n${summary}`;
    } else if (mode === "detail") {
      prompt = `Please provide a these deayils as an essay format:\n\n${summary}`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error refining summary:", error);
    throw error;
  }
};
