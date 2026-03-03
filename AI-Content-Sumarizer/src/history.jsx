import { useEffect, useState } from "react";
import { db, auth } from "../Backend/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./history.css";

function History() {
  const [summaries, setSummaries] = useState([]);
  const navigate = useNavigate(); // 🔹 ADDED: hook for navigation

  useEffect(() => {
    const fetchSummaries = async () => {
      const user = auth.currentUser;
      if (!user) {
        setSummaries([]);
        return;
      }

      try {
        const q = query(
          collection(db, "users", user.uid, "summaries"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSummaries(data);
      } catch (error) {
        console.error("Error fetching summaries:", error);
      }
    };

    fetchSummaries();
  }, []); 

  return (
    <div>
      <h2>Your Summary History</h2>
      <div className="container">
        {summaries.length > 0 ? (
          <ul>
            {summaries.map((s) => (
              <li key={s.id}>
                <p>{s.text}</p>
                <small>
                  {s.createdAt && s.createdAt.toDate
                    ? s.createdAt.toDate().toLocaleString()
                    : "No timestamp"}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No summaries yet. Create one from the dashboard!</p>
        )}
      </div>

      {/* 🔹 CHANGED: use navigate instead of window.history.back */}
      <button id="back" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default History;
