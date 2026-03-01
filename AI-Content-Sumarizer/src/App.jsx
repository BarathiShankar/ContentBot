import { useState } from "react";
import { summarizeText } from "../Backend/gemini";
import { db } from "../Backend/firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
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
      setSummary("⚠️ Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Smart Content Summarizer (Gemini)</h1>
      <textarea
        placeholder="Enter text to summarize..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSummarize} disabled={loading || !input}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      <div className="output">
        <h2>Summary:</h2>
        <p>{summary}</p>
      </div>
    </div>
  );
}

export default App;
