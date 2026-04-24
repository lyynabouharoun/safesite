import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const timeStr = time.toLocaleTimeString("en-GB");
  const dateStr = time.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
  const initials = user?.email?.slice(0, 2).toUpperCase() || "OP";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-dark-border bg-dark-surface flex-shrink-0 relative z-50">
      <div>
        <h1 className="text-sm font-medium text-cream">Operations Dashboard</h1>
        <p className="text-xs font-mono text-cream/30 mt-0.5">Live monitoring · Zone A–C</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Live dot */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
          </span>
          <span className="font-mono text-xs text-coral">LIVE</span>
        </div>

        {/* Clock */}
        <div className="text-right hidden sm:block">
          <p className="font-mono text-xs text-cream">{timeStr}</p>
          <p className="font-mono text-xs text-cream/30">{dateStr}</p>
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-plum border border-cyan/30 flex items-center justify-center hover:border-cyan/60 transition-colors"
          >
            <span className="font-mono text-xs text-cyan">{initials}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-56 bg-dark-surface border border-dark-border rounded-xl shadow-xl overflow-hidden z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-plum border border-cyan/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-xs text-cyan">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-cream truncate">Operator</p>
                    <p className="text-xs font-mono text-cream/30 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan inline-block" />
                  <span className="font-mono text-xs text-cyan/70">Active session</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {[
                  { label: "Profile & Account", icon: "👤", action: () => { navigate("/profile");       setOpen(false); } },
                   { label: "Notifications",     icon: "🔔", action: () => { navigate("/notifications"); setOpen(false); } },
                  { label: "Settings",          icon: "⚙️", action: () => { navigate("/settings");      setOpen(false); } },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono text-cream/50 hover:text-cream hover:bg-dark-card transition-colors text-left"
                  >
                    <span style={{ fontSize: "13px" }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-dark-border py-1">
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono text-coral/70 hover:text-coral hover:bg-coral/5 transition-colors text-left"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h3M9 9.5L12 6.5M12 6.5L9 3.5M12 6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}