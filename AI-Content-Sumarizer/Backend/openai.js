import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // allows direct calls from React
});

export async function summarizeText(inputText) {
  const response = await client.chat.completions.create({
    model: "gpt-4", // or "gpt-3.5-turbo"
    messages: [
      { role: "system", content: "You are a helpful summarizer." },
      { role: "user", content: inputText }
    ],
    max_tokens: 300,
  });

  return response.choices[0].message.content;
}
