import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google"; 
import useAuth from "../hooks/useAuth";
import { FiMail, FiLock, FiUser, FiShield, FiEye, FiEyeOff } from "react-icons/fi";

export default function Auth() {
  const { login, handleAuthSuccess } = useAuth();

  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      color = "text-red-400";
    } else if (score === 3) {
      message = "Medium password";
      color = "text-yellow-400";
    } else if (score === 4) {
      message = "Strong password";
      color = "text-green-400";
    } else {
      message = "Very Strong password";
      color = "text-emerald-400";
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
      console.log("Google response:", data);

      if (response.ok && data.tokens) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0c15] to-[#0f111a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo/Badge */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25"
          >
            <FiShield className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        <div className="bg-dark-card/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl w-full border border-dark-border">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-cream mb-2 text-center">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-cream/40 text-sm text-center mb-8">
              {mode === "login" ? "Sign in to continue to Safesite" : "Join the security platform"}
            </p>
          </motion.div>
          
          <div className="space-y-5">
            {/* Name Field - Register Only */}
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                    <input 
                      className={`w-full pl-12 pr-4 py-3.5 bg-dark-base text-cream rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-dark-border'
                      } focus:border-cyan focus:outline-none transition-all duration-200 text-base`}
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                    />
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs mt-1 ml-4"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
              <input 
                className={`w-full pl-12 pr-4 py-3.5 bg-dark-base text-cream rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-dark-border'
                } focus:border-cyan focus:outline-none transition-all duration-200 text-base`}
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
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1 ml-4"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
              <input 
                type={showPassword ? "text" : "password"}
                className={`w-full pl-12 pr-12 py-3.5 bg-dark-base text-cream rounded-xl border ${
                  errors.password ? 'border-red-500' : 'border-dark-border'
                } focus:border-cyan focus:outline-none transition-all duration-200 text-base`}
                placeholder="Password"
                value={mode === "login" ? password : regPassword}
                onChange={(e) =>
                  mode === "login"
                    ? setPassword(e.target.value)
                    : handlePasswordChange(e)
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-xs mt-1 ml-4"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Password strength indicator - only show on register */}
            <AnimatePresence mode="wait">
              {mode === "register" && regPassword && !errors.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex gap-1 h-1.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.score > i
                            ? i < 2 ? 'bg-red-500' : i < 3 ? 'bg-yellow-500' : i < 4 ? 'bg-green-500' : 'bg-emerald-500'
                            : 'bg-dark-border'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength.color} ml-1`}>
                    {passwordStrength.message}
                  </p>
                  <ul className="text-xs text-cream/40 space-y-1 ml-1">
                    <li className={regPassword.length >= 8 ? "text-green-400" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={/[a-z]/.test(regPassword) && /[A-Z]/.test(regPassword) ? "text-green-400" : ""}>
                      • Uppercase & lowercase letters
                    </li>
                    <li className={/[0-9]/.test(regPassword) ? "text-green-400" : ""}>
                      • At least one number
                    </li>
                    <li className={/[^a-zA-Z0-9]/.test(regPassword) ? "text-green-400" : ""}>
                      • Special character (!@#$%^&*)
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error messages */}
            <AnimatePresence>
              {(mode === "login" && loginError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"
                >
                  <p className="text-red-400 text-sm text-center">{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(mode === "register" && registerError) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-3"
                >
                  <p className="text-red-400 text-sm text-center">{registerError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(mode === "register" && registerSuccess) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-xl p-3"
                >
                  <p className="text-green-400 text-sm text-center">{registerSuccess}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button 
              type="button"
              onClick={mode === "login" ? handleLogin : handleRegister}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </motion.button>

            {/* Divider */}
            {mode === "login" && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-dark-border"></div>
                <span className="text-xs text-cream/40 uppercase">Or continue with</span>
                <div className="flex-1 h-px bg-dark-border"></div>
              </div>
            )}

            {/* Google Login */}
            {mode === "login" && (
              <div className="flex justify-center">
                <GoogleLogin 
                  onSuccess={handleGoogleSuccess} 
                  onError={() => setRegisterError("Google Login Failed")}
                />
              </div>
            )}
          </div>

          {/* Switch Mode */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-cream/40 text-sm">
              {mode === "login" ? "New to Safesite?" : "Already have an account?"}
              <button 
                className="ml-2 text-cyan font-semibold hover:text-cyan-400 transition"
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
      </motion.div>
    </div>
  );
}