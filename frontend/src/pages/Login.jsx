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

  // Error states
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: ""
  });

  // Check password strength
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    let message = "";
    let color = "";

    if (pwd.length >= 8) score++;
    if (pwd.match(/[a-z]/)) score++;
    if (pwd.match(/[A-Z]/)) score++;
    if (pwd.match(/[0-9]/)) score++;
    if (pwd.match(/[^a-zA-Z0-9]/)) score++;

    if (score <= 2) {
      message = "Weak password";
      color = "text-red-500";
    } else if (score === 3) {
      message = "Medium password";
      color = "text-yellow-500";
    } else if (score === 4) {
      message = "Strong password";
      color = "text-green-500";
    } else {
      message = "Very Strong password";
      color = "text-green-400";
    }

    setPasswordStrength({ score, message, color });
    return score;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setRegPassword(pwd);
    checkPasswordStrength(pwd);
    if (errors.password) setErrors({ ...errors, password: "" });
  };

  const validateRegister = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Full name is required";
    
    if (!regEmail) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(regEmail)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!regPassword) {
      newErrors.password = "Password is required";
    } else if (regPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (checkPasswordStrength(regPassword) < 3) {
      newErrors.password = "Use uppercase, lowercase, numbers & special characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    
    setLoading(true);
    setLoginError("");
    try {
      await login(email, password);
    } catch (error) {
      setLoginError("Invalid email or password");
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
    console.log("Google response:", data); // DEBUG

    if (response.ok && data.tokens) {
      // IMPORTANT: Pass tokens to handleAuthSuccess
      handleAuthSuccess(data.user, data.tokens);
    } else {
      setRegisterError(data.message || "Google Authentication failed");
    }
  } catch (error) {
    console.error("Google error:", error);
    setRegisterError("Could not connect to Auth Service");
  }
  setLoading(false);
};
  const handleRegister = async () => {
    if (!validateRegister()) return;
    
    setLoading(true);
    setRegisterError("");
    setRegisterSuccess("");
    
    try {
      const response = await fetch("http://localhost:8002/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterSuccess("Account created successfully! Please login.");
        setTimeout(() => {
          setMode("login");
          setRegEmail("");
          setRegPassword("");
          setName("");
          setPasswordStrength({ score: 0, message: "", color: "" });
          setErrors({});
          setRegisterSuccess("");
        }, 2000);
      } else {
        setRegisterError(data.message || "Registration failed");
      }
    } catch (error) {
      setRegisterError("Auth Service is offline. Please try again later.");
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
            <div>
              <input 
                className={`w-full p-3 bg-[#252936] text-white rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } focus:border-blue-500 focus:outline-none transition`}
                placeholder="Full Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <input 
              className={`w-full p-3 bg-[#252936] text-white rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } focus:border-blue-500 focus:outline-none transition`}
              placeholder="Email Address"
              type="email"
              value={mode === "login" ? email : regEmail}
              onChange={(e) => {
                mode === "login"
                  ? setEmail(e.target.value)
                  : setRegEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
                if (loginError) setLoginError("");
                if (registerError) setRegisterError("");
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input 
              type="password"
              className={`w-full p-3 bg-[#252936] text-white rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } focus:border-blue-500 focus:outline-none transition`}
              placeholder="Password"
              value={mode === "login" ? password : regPassword}
              onChange={(e) =>
                mode === "login"
                  ? setPassword(e.target.value)
                  : handlePasswordChange(e)
              }
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            
            {/* Password strength indicator - only show on register */}
            {mode === "register" && regPassword && !errors.password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1">
                  <div className={`flex-1 rounded-full transition-all ${
                    passwordStrength.score >= 1 ? 'bg-red-500' : 'bg-gray-700'
                  }`} />
                  <div className={`flex-1 rounded-full transition-all ${
                    passwordStrength.score >= 2 ? 'bg-yellow-500' : 'bg-gray-700'
                  }`} />
                  <div className={`flex-1 rounded-full transition-all ${
                    passwordStrength.score >= 3 ? 'bg-green-500' : 'bg-gray-700'
                  }`} />
                  <div className={`flex-1 rounded-full transition-all ${
                    passwordStrength.score >= 4 ? 'bg-green-400' : 'bg-gray-700'
                  }`} />
                  <div className={`flex-1 rounded-full transition-all ${
                    passwordStrength.score >= 5 ? 'bg-green-300' : 'bg-gray-700'
                  }`} />
                </div>
                <p className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.message}
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mt-2">
                  <li className={regPassword.length >= 8 ? "text-green-500" : ""}>
                    • At least 8 characters
                  </li>
                  <li className={/[a-z]/.test(regPassword) && /[A-Z]/.test(regPassword) ? "text-green-500" : ""}>
                    • Uppercase & lowercase letters
                  </li>
                  <li className={/[0-9]/.test(regPassword) ? "text-green-500" : ""}>
                    • At least one number
                  </li>
                  <li className={/[^a-zA-Z0-9]/.test(regPassword) ? "text-green-500" : ""}>
                    • Special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Error messages */}
          {mode === "login" && loginError && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            </div>
          )}
          
          {mode === "register" && registerError && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
              <p className="text-red-500 text-sm text-center">{registerError}</p>
            </div>
          )}

          {mode === "register" && registerSuccess && (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
              <p className="text-green-500 text-sm text-center">{registerSuccess}</p>
            </div>
          )}

          <button 
            type="button"
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                  onError={() => setRegisterError("Google Login Failed")}
                />
              </div>
            </>
          )}
        </div>

        <p className="text-gray-400 mt-8 text-center text-sm">
          {mode === "login" ? "New to the platform?" : "Already have an account?"}
          <button 
            className="ml-2 text-blue-500 font-semibold hover:text-blue-400 transition"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setEmail("");
              setPassword("");
              setRegEmail("");
              setRegPassword("");
              setName("");
              setErrors({});
              setLoginError("");
              setRegisterError("");
              setRegisterSuccess("");
              setPasswordStrength({ score: 0, message: "", color: "" });
            }}
          >
            {mode === "login" ? "Register Now" : "Log In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}