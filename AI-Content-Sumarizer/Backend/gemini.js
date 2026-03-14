import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  getFirestore, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const db = getFirestore();
const auth = getAuth();
export const summarizeText = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using a more stable model for accuracy
    const prompt = `Please provide a concise, accurate, and clear summary of the following text in bullet points (without any .md notations or markdown formatting):\n\n${text}\n\nEnsure the summary captures the main ideas and key details precisely.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // Save summary in Firestore under current user
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, "users", user.uid, "summaries"), {
        input: text,
        output: summary,
        mode: "summarize",
        createdAt: new Date()
      });
    }

    return summary;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw error;
  }
};
export const refineSummary = async (cursum,mode) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const q = query(
      collection(db, "users", user.uid, "summaries"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    const lastSummaryDoc = querySnapshot.docs[0];

    if (!lastSummaryDoc) throw new Error("No summary found in DB");

    const summary = lastSummaryDoc.data().output;

    // Define clear instructions for each mode
const modes = {
  expand: "Add more technical detail, context, and background information while keeping it as a clear list. Do not repeat the same information.",
  simplify: "Strip away all jargon. Rewrite this for a 5th grader using only the most essential keywords and 3-4 brief points.",
  essay: "Convert these bullet points into a formal, professional three-paragraph essay with an introduction, body, and conclusion."
};

// Use a clean, structured prompt
const prompt = `
  TASK: ${modes[mode]}
  
  ORIGINAL SUMMARY:
  ${cursum}
  
  CONSTRAINTS: 
  - Output ONLY the result. 
  - No "Here is your essay" intro.
  - No Markdown formatting or symbols like # or *.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const refined = response.text();

    // Save refined output in Firestore
    await addDoc(collection(db, "users", user.uid, "summaries"), {
      input: summary,
      output: refined,
      mode,
      createdAt: new Date()
    });

    return refined;
  } catch (error) {
    console.error("Error refining summary:", error);
    throw error;
  }
};
