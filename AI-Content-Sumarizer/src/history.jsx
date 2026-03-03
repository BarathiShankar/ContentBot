import { useEffect, useState } from "react";
import { db, auth } from "../Backend/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./history.css";

function History() {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      const user = auth.currentUser;
      if (!user) {
        setSummaries([]);
        return;
      }

      try {
        // ✅ Query the summaries subcollection under the logged-in user
        const q = query(
          collection(db, "users", user.uid, "summaries"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        // ✅ Map documents safely
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
  }, [/* empty: no external dependencies */]);


  return (
    <div className="container">
      <h2>Your Summary History</h2>
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
      <button onClick={() => window.history.back()}>Back to Dashboard</button>
    </div>
  );
}

export default History;
