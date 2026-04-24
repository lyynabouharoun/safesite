import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center px-4">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#76D2DB 1px, transparent 1px), linear-gradient(90deg, #76D2DB 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-lg bg-cyan flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="3" fill="#0d0d14" />
              <circle cx="9" cy="9" r="6.5" stroke="#0d0d14" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <span className="font-mono text-sm font-medium tracking-widest text-cream uppercase">
            SafeSite
          </span>
        </div>

        <h1 className="text-2xl font-light text-cream mb-1">Welcome back</h1>
        <p className="text-sm text-cream/40 font-mono mb-8">Security Operations Center</p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-cream/40 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@safesite.io"
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/20 focus:outline-none focus:border-cyan transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-cream/40 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/20 focus:outline-none focus:border-cyan transition-colors"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-2 bg-cyan text-dark-base font-mono font-medium text-sm py-3 rounded-lg hover:bg-cyan/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : "Access Dashboard →"}
          </button>
        </div>

        <p className="text-xs text-cream/20 font-mono mt-8 text-center">
          SAFESITE v2.4.1 · ENCRYPTED CONNECTION
        </p>
      </div>
    </div>
  );
}