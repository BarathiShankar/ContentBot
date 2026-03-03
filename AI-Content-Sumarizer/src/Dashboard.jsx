import { useState } from "react";
import { refineSummary, summarizeText } from "../Backend/gemini";
import { db, auth } from "../Backend/firebase";
import ReactMarkdown from "react-markdown";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function App() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const saveSummary = async (text) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "users", user.uid, "summaries"), {
        text,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error saving summary:", error);
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const result = await summarizeText(input);
      setSummary(result);

      await saveSummary(result);
    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("⚠️ Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (mode) => {
    if (!summary) {
      alert("Generate a summary first!");
      return;
    }
    setLoading(true);
    try {
      const refined = await refineSummary(summary, mode);
      setSummary(refined);

      await saveSummary(refined);
    } catch (error) {
      console.error("Error refining summary:", error);
      setSummary("⚠️ Failed to refine summary.");
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
      <button className="btsum" onClick={handleSummarize} disabled={loading || !input}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      <h2>Summary:</h2>
      <div className="output">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>

      {/* 🔹 History button fixed top-right */}
      <button className="history-btn" onClick={() => navigate("/history")}>
        History
      </button>

      <div className="refine-buttons">
        <button className="bt1" onClick={() => handleRefine("expand")}>Expand</button>
        <button className="bt2" onClick={() => handleRefine("simplify")}>Simplify</button>
        <button className="bt3" onClick={() => handleRefine("detail")}>Write As Essay</button>
      </div>
    </div>
  );
}

export default App;
