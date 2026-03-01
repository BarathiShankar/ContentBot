import axios from "axios";

export async function summarizeText(inputText) {
  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    {
      contents: [{ parts: [{ text: inputText }] }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
      },
    }
  );
  return response.data.candidates[0].content.parts[0].text;
}
