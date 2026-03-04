import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { summarizeText, refineSummary } from "../../Backend/gemini";
import { db, auth } from "../../backend/firebase";
import { collection, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "../styles/Dashboard.css";

function Dashboard() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleSummarize = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await summarizeText(input);
      setSummary(result);

      // Save to Firestore
      if (user) {
        await addDoc(collection(db, "summaries"), {
          userId: user.uid,
          userEmail: user.email,
          input,
          summary: result,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("⚠️ Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (mode) => {
    if (!summary) return;
    setLoading(true);
    try {
      const refined = await refineSummary(summary, mode);
      setSummary(refined);
    } catch (error) {
      console.error("Error refining:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Smart Content Summarizer</h1>
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/history" className="nav-link">History</Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        <div className="input-section">
          <h2>Enter Your Content</h2>
          <textarea
            placeholder="Paste the text you want to summarize..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="8"
            disabled={loading}
          />
          <button
            onClick={handleSummarize}
            disabled={loading || !input.trim()}
            className="summarize-btn"
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>

        {summary && (
          <div className="output-section">
            <h2>Summary</h2>
            <div className="summary-text">{summary}</div>
            <div className="refine-buttons">
              <button onClick={() => handleRefine("expand")} disabled={loading}>
                Expand
              </button>
              <button onClick={() => handleRefine("simplify")} disabled={loading}>
                Simplify
              </button>
              <button onClick={() => handleRefine("detail")} disabled={loading}>
                Essay
              </button>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(summary)}
              className="copy-btn"
            >
              Copy Summary
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
