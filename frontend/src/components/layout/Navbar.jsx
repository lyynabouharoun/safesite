// frontend/src/layout/Navbar.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FiBell, FiSearch, FiUser, FiLogOut, FiSettings, FiBellOff, FiShield } from 'react-icons/fi';

export default function Navbar({ pageTitle, unreadNotifications = 3 }) {
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Get current page name from location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/cameras") return "Camera Feeds";
    if (path === "/alerts") return "Alert Center";
    if (path === "/history") return "Event History";
    if (path === "/settings") return "System Settings";
    if (path === "/profile") return "Profile";
    if (path === "/notifications") return "Notifications";
    return "Security Console";
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/')
    }));
  };

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target) && showSearch) {
        setShowSearch(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSearch]);

  const timeStr = time.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  const initials = user?.email?.slice(0, 2).toUpperCase() || "OP";

  const breadcrumbs = getBreadcrumbs();
  const currentTitle = pageTitle || getPageTitle();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-dark-border bg-dark-surface/95 backdrop-blur-sm flex-shrink-0 relative z-50">
      {/* Left Section - Title & Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold text-cream tracking-wide">
            {currentTitle}
          </h1>
          
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && breadcrumbs[0].name !== currentTitle && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-cream/20 text-xs">/</span>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <button
                    onClick={() => navigate(crumb.path)}
                    className="text-xs font-mono text-cream/40 hover:text-cyan transition-colors"
                  >
                    {crumb.name}
                  </button>
                  {idx < breadcrumbs.length - 1 && (
                    <span className="text-cream/20 text-xs">/</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <p className="text-[11px] font-mono text-cream/30 mt-0.5 tracking-wide">
          SECURE LINK ACTIVE • ENCRYPTED STREAM
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Search Bar */}
        <div className="relative" ref={searchRef}>
          {showSearch ? (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 animate-slide-in">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras, events..."
                className="w-full px-3 py-1.5 bg-dark-card border border-cyan/30 rounded-lg text-cream text-xs font-mono placeholder-cream/30 focus:outline-none focus:border-cyan/60 transition-colors"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="text-cream/40 hover:text-cyan transition-colors p-1"
            >
              <FiSearch className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-coral" />
            </span>
          </div>
          <span className="font-mono text-[11px] text-coral font-medium tracking-wider">
            LIVE
          </span>
          <span className="w-px h-3 bg-dark-border mx-1" />
          <span className="font-mono text-[11px] text-cyan/60 tracking-wider">
            AI ACTIVE
          </span>
        </div>

        {/* System Stats */}
        <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-lg bg-dark-card/50 border border-dark-border">
          <FiShield className="w-3 h-3 text-cyan/40" />
          <span className="font-mono text-[10px] text-cream/40">24/7</span>
        </div>

        {/* Clock */}
        <div className="text-right hidden sm:block">
          <p className="font-mono text-xs text-cream font-medium tracking-wide">{timeStr}</p>
          <p className="font-mono text-[10px] text-cream/30">{dateStr}</p>
        </div>

        {/* Notifications Bell */}
        <button 
          onClick={() => navigate("/notifications")}
          className="relative p-1.5 rounded-lg text-cream/40 hover:text-cyan hover:bg-dark-card/50 transition-all"
        >
          <FiBell className="w-4.5 h-4.5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-coral rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-plum to-plum-800 border border-cyan/30 flex items-center justify-center group-hover:border-cyan/60 transition-all shadow-md">
              <span className="font-mono text-xs font-bold text-cyan">{initials}</span>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 top-11 w-64 bg-dark-surface border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50 animate-slide-in">
              {/* User info */}
              <div className="px-4 py-3 border-b border-dark-border bg-gradient-to-r from-dark-card/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-plum to-plum-800 border border-cyan/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-sm font-bold text-cyan">{initials}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-cream truncate">Security Operator</p>
                    <p className="text-xs font-mono text-cream/30 truncate">{user?.email || "operator@safesite.com"}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10px] text-cream/50">Active Session</span>
                  </div>
                  <span className="text-cream/20 text-xs">•</span>
                  <div className="flex items-center gap-1.5">
                    <FiShield className="w-2.5 h-2.5 text-cyan/40" />
                    <span className="font-mono text-[10px] text-cream/50">Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {[
                  { label: "Profile & Account", icon: <FiUser className="w-3.5 h-3.5" />, action: () => { navigate("/profile"); setOpen(false); } },
                  { label: "Notifications", icon: <FiBell className="w-3.5 h-3.5" />, badge: unreadNotifications, action: () => { navigate("/notifications"); setOpen(false); } },
                  { label: "Settings", icon: <FiSettings className="w-3.5 h-3.5" />, action: () => { navigate("/settings"); setOpen(false); } },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono text-cream/60 hover:text-cream hover:bg-dark-card/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-cream/40 group-hover:text-cyan transition-colors">
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    {item.badge > 0 && (
                      <span className="px-1.5 py-0.5 bg-coral/20 text-coral rounded text-[9px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-dark-border py-1">
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-mono text-coral/70 hover:text-coral hover:bg-coral/5 transition-colors text-left group"
                >
                  <FiLogOut className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
                  Disconnect & Lock
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}