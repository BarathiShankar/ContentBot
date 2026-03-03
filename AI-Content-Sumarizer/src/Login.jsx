import { useState } from "react";
import { auth, db } from "../Backend/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

// ✅ Loading screen component
function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Logging in... Please wait</p>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // show loading screen
    try {
      // Try to login with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check Firestore record by UID
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        alert("User record missing in DB. Please register first.");
        setLoading(false);
        navigate("/register");
        return;
      }

      // ✅ Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials. Please try again or register.");
      setLoading(false); // stop loading if error
    }
  };

  return (
    <div className="auth-container">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p>
            Don’t have an account?{" "}
            <Link to="/register">Click here to Register</Link>
          </p>
        </>
      )}
    </div>
  );
}

export default Login;
