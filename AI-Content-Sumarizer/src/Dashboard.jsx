import { useState } from "react";
import { refineSummary,summarizeText } from "../Backend/gemini";
import { db } from "../Backend/firebase";
import ReactMarkdown from "react-markdown";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const handleRefine = async (mode) => {
  setLoading(true);
  try {
    const refined = await refineSummary(summary, mode);
    setSummary(refined);
  } catch (error) {
    console.error("Error refining summary:", error);
  } finally {
    setLoading(false);
  }
};

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
      <h1>Smart Content Summarizer</h1>
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
        

  <p><ReactMarkdown>{summary}</ReactMarkdown></p>
      </div>
      <div className="refine-buttons">
  <button onClick={() => handleRefine("expand")}>Expand</button>
  <button onClick={() => handleRefine("simplify")}>Simplify</button>
  <button onClick={() => handleRefine("detail")}>Write As Essay</button>
</div>
    </div>
  );
}

export default App;
