import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../backend/firebase";
import "../styles/History.css";

function History() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "summaries"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort by date descending (newest first)
        data.sort((a, b) => b.createdAt - a.createdAt);
        setSummaries(data);
      } catch (error) {
        console.error("Error fetching summaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "summaries", id));
      setSummaries(summaries.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting summary:", error);
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

  if (loading) {
    return (
      <div className="history-container">
        <h2>Loading history...</h2>
      </div>
    );
  }

  return (
    <div className="history-container">
      <header className="history-header">
        <h1>Summary History</h1>
        <nav className="history-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/history" className="nav-link active">History</Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
      </header>

      <main className="history-content">
        {summaries.length === 0 ? (
          <div className="empty-state">
            <p>No summaries yet. Start summarizing!</p>
            <Link to="/dashboard" className="back-btn">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="summaries-list">
            <p className="summary-count">Total summaries: {summaries.length}</p>
            {summaries.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-header">
                  <small className="summary-date">
                    {new Date(item.createdAt.toDate()).toLocaleString()}
                  </small>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="delete-btn"
                    title="Delete this summary"
                  >
                     Delete
                  </button>
                </div>
                <p className="input-text">
                  <strong>Original:</strong> {item.input.substring(0, 150)}
                  {item.input.length > 150 ? "..." : ""}
                </p>
                <p className="summary-text">
                  <strong>Summary:</strong> {item.summary.substring(0, 200)}
                  {item.summary.length > 2000 ? "..." : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default History;
