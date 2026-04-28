import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import useAuth from "../../hooks/useAuth";
import { useAlerts } from "../../context/AlertsContext";

import { FiBell, FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar({ pageTitle }) {
  const [time, setTime] = useState(new Date());

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const { alerts } = useAlerts();

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const latestAlerts = alerts.slice(0, 5);
  const unreadNotifications = alerts.length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/cameras") return "Camera Feeds";
    if (path === "/history") return "Event History";
    if (path === "/profile") return "Profile";
    if (path === "/notifications") return "Notifications";
    return "Security Console";
  };

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleNotif = () => {
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
  };

  const timeStr = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateStr = time.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  const initials = user?.email?.slice(0, 2).toUpperCase() || "OP";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-dark-border bg-dark-surface/95 backdrop-blur-md relative z-50">

      {/* LEFT */}
      <div>
        <h1 className="text-sm font-semibold text-cream">
          {pageTitle || getPageTitle()}
        </h1>
        <p className="text-[11px] text-cream/30 font-mono">
          SECURITY SYSTEM ACTIVE
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>

        {/* LIVE */}
        <div className="flex items-center gap-2 text-coral text-xs font-mono">
          <span className="w-2 h-2 bg-coral rounded-full animate-pulse" />
          LIVE
        </div>

        {/* CLOCK */}
        <div className="hidden sm:block text-right">
          <p className="text-xs text-cream font-mono">{timeStr}</p>
          <p className="text-[10px] text-cream/30">{dateStr}</p>
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative">

          <button
            onClick={toggleNotif}
            className="relative p-2 text-cream/60 hover:text-cyan transition"
          >
            <FiBell className="w-4 h-4" />

            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-coral text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-dark-surface/95 backdrop-blur-xl border border-dark-border rounded-xl shadow-2xl z-[9999]"
              >
                <div className="p-3 border-b border-dark-border">
                  <p className="text-xs text-cream font-mono">
                    Recent Security Alerts
                  </p>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {latestAlerts.length === 0 ? (
                    <p className="p-3 text-xs text-cream/40">
                      No alerts detected
                    </p>
                  ) : (
                    latestAlerts.map((a, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 border-b border-dark-border/40 hover:bg-dark-card transition"
                      >
                        <p className="text-xs text-cream">
                          ⚠ {a.type} detected
                        </p>
                        <p className="text-[10px] text-cream/40">
                          {a.timestamp}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PROFILE */}
        <div className="relative">

          <button
            onClick={toggleProfile}
            className="w-8 h-8 rounded-full bg-plum flex items-center justify-center hover:scale-105 transition"
          >
            <span className="text-xs text-cyan font-mono">
              {initials}
            </span>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 bg-dark-surface/95 backdrop-blur-xl border border-dark-border rounded-xl shadow-2xl z-[9999]"
              >

                <div className="p-3 border-b border-dark-border">
                  <p className="text-xs text-cream">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-dark-card transition flex items-center gap-2"
                >
                  <FiUser className="w-3 h-3" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-coral hover:bg-coral/10 transition flex items-center gap-2"
                >
                  <FiLogOut className="w-3 h-3" />
                  Logout
                </button>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}