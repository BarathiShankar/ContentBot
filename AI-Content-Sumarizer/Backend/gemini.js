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

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Initialize Firestore + Auth
const db = getFirestore();
const auth = getAuth();

/**
 * Summarize text and store result in Firestore
 */
export const summarizeText = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Please provide a concise and clear summary of the following text as without .md notations bullet points:\n\n${text}`;
    
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

/**
 * Refine summary (expand, simplify, essay) using previous summary from Firestore
 */
export const refineSummary = async (mode) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Fetch the last summary from Firestore
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

     const q = query(
      collection(db, "users", user.uid, "summaries"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    if (!lastSummaryDoc.exists()) throw new Error("No summary found in DB");

    const summary = lastSummaryDoc.data().output;

    // Build prompt based on mode
    let prompt = "";
    if (mode === "expand") {
      prompt = `Expand this summary with more details and context,in same bulletin points format:\n\n${summary}`;
    } else if (mode === "simplify") {
      prompt = `Simplify this summary into more concise bullet points,by extracting keywords:\n\n${summary}`;
    } else if (mode === "essay") {
      prompt = `Convert this summary into a detailed essay format:\n\n${summary}`;
    }

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
