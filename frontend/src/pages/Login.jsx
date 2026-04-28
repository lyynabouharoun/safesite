import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";

export default function Auth() {
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);

    // TODO: connect to backend later
    console.log({ name, regEmail, regPassword });

    setLoading(false);
    setMode("login");
  };

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">

      {/* GRID BG */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#76D2DB 1px, transparent 1px), linear-gradient(90deg, #76D2DB 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-cream">
            Secure Access
          </h1>
          <p className="text-sm text-cream/40 font-mono">
            Security Operations System
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex mb-6 bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-xs font-mono transition ${
              mode === "login"
                ? "bg-cyan text-dark-base"
                : "text-cream/50"
            }`}
          >
            LOGIN
          </button>

          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-xs font-mono transition ${
              mode === "register"
                ? "bg-cyan text-dark-base"
                : "text-cream/50"
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* FORM */}
        <AnimatePresence mode="wait">

          {/* LOGIN */}
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <input
                type="email"
                placeholder="operator@safesite.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-sm text-cream"
              />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-sm text-cream"
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-cyan text-dark-base font-mono text-sm py-3 rounded-lg"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </motion.div>
          )}

          {/* REGISTER */}
          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-sm text-cream"
              />

              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-sm text-cream"
              />

              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-sm text-cream"
              />

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-cyan text-dark-base font-mono text-sm py-3 rounded-lg"
              >
                Create Account
              </button>
            </motion.div>
          )}

        </AnimatePresence>

        {/* GOOGLE LOGIN */}
        <div className="mt-5">
          <button className="w-full border border-dark-border text-cream/70 text-xs py-3 rounded-lg hover:border-cyan/40 transition">
            Continue with Google
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-cream/20 font-mono mt-8 text-center">
          SAFESITE AUTH SYSTEM · ENCRYPTED
        </p>

      </div>
    </div>
  );
}