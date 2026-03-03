import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState,useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Backend/firebase";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={<Login onLogin={(email) => setUser(email)} />} />

        {/* Register */}
        <Route path="/register" element={<Register onRegister={(email) => setUser(email)} />} />

        {/* Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
