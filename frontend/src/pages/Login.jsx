import { useState } from "react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google"; 
import useAuth from "../hooks/useAuth";

export default function Auth() {
  const { login, handleAuthSuccess } = useAuth();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login Error:", error);
    }
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8002/api/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      console.log("GOOGLE RESPONSE:", data);

      // ✅ FIX 1: use response.ok instead of data.status
      if (response.ok) {
        // ✅ FIX 2: pass email not whole user object
       handleAuthSuccess({
  email: data.user.email,
  name: data.user.name || data.user.email.split("@")[0],
});
      } else {
        alert(data.message || "Google Authentication failed");
      }
    } catch (error) {
      console.error("Google Connection Error:", error);
      alert("Could not connect to Auth Service.");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8002/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // ✅ FIX 3: correct field names
        body: JSON.stringify({
          name,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();
      console.log("REGISTER RESPONSE:", data);

      if (response.ok) {
        alert("Account created! You can now login.");
        setMode("login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      alert("Auth Service is offline.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1a1d29] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800"
      >
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">
          {mode === "login" ? "Secure Login" : "Join Safesite"}
        </h2>
        
        <div className="space-y-4">
          {mode === "register" && (
            <input 
              className="w-full p-3 bg-[#252936] text-white rounded-lg border border-gray-700"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input 
            className="w-full p-3 bg-[#252936] text-white rounded-lg border border-gray-700"
            placeholder="Email Address"
            value={mode === "login" ? email : regEmail}
            onChange={(e) =>
              mode === "login"
                ? setEmail(e.target.value)
                : setRegEmail(e.target.value)
            }
          />

          <input 
            type="password"
            className="w-full p-3 bg-[#252936] text-white rounded-lg border border-gray-700"
            placeholder="Password"
            value={mode === "login" ? password : regPassword}
            onChange={(e) =>
              mode === "login"
                ? setPassword(e.target.value)
                : setRegPassword(e.target.value)
            }
          />

          <button 
            type="button" // ✅ prevents weird refresh bugs
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {mode === "login" && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="px-3 text-xs text-gray-500 uppercase">Or continue with</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={() => alert("Google Login Failed")}
                />
              </div>
            </>
          )}
        </div>

        <p className="text-gray-400 mt-8 text-center text-sm">
          {mode === "login" ? "New to the platform?" : "Already have an account?"}
          <button 
            className="ml-2 text-blue-500 font-semibold"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register Now" : "Log In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}