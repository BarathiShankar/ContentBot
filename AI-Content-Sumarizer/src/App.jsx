import { useState } from "react";
import { summarizeText } from "../Backend/openai"; // FIXED PATH
import { db } from "../Backend/firebase"; // FIXED PATH
import { collection, addDoc } from "firebase/firestore";

function Summarizer() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    try {
      const result = await summarizeText(input);
      setSummary(result);

      await addDoc(collection(db, "summaries"), {
        input,
        summary: result,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error summarizing:", error);
    }
  };

  return (
    <div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSummarize}>Summarize</button>
      <p>{summary}</p>
    </div>
  );
}

export default Summarizer;
