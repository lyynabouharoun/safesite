import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiGrid,
  FiCamera,
  FiClock,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
} from "react-icons/fi";

const NAV = [
  { label: "Dashboard", path: "/dashboard", icon: FiGrid },
  { label: "Cameras", path: "/cameras", icon: FiCamera },
  { label: "History", path: "/history", icon: FiClock },
  { label: "Profile", path: "/profile", icon: FiUser },
];

export default function Sidebar({
  user = { name: "Admin", role: "Security Operator" },
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path, e) => {
    // If already on the same page, force a hard refresh
    if (window.location.pathname === path) {
      e.preventDefault();
      window.location.href = path;
    }
  };

  return (
    <aside
      className={`
        flex flex-col bg-dark-surface/95 backdrop-blur-md border-r border-dark-border
        transition-all duration-300 relative z-20
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* LOGO */}
      <div className="flex items-center h-16 border-b border-dark-border px-4 gap-3">
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-cyan/60 flex items-center justify-center shadow-lg shadow-cyan/20">
          <FiShield className="w-4 h-4 text-dark-base" />
          <div className="absolute inset-0 rounded-lg border border-cyan/40 animate-pulse" />
        </div>

        {!collapsed && (
          <div>
            <p className="text-cream font-mono text-sm tracking-wider">
              SAFESITE
            </p>
            <p className="text-cyan/60 text-[10px] font-mono -mt-1">
              SECURITY AI
            </p>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink 
              key={item.path} 
              to={item.path}
              onClick={(e) => handleNavigation(item.path, e)}
              className="relative group"
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 3 }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl relative
                    transition-all duration-200 font-mono text-sm
                    ${
                      isActive
                        ? "text-cyan bg-cyan/10"
                        : "text-cream/40 hover:text-cream hover:bg-dark-card/40"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  {/* ACTIVE LEFT BAR */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1 bottom-1 w-1 bg-cyan rounded-full shadow-lg shadow-cyan/30"
                    />
                  )}

                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />

                  {!collapsed && (
                    <span className="text-xs tracking-wide">
                      {item.label}
                    </span>
                  )}

                  {/* COLLAPSED TOOLTIP */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-dark-card border border-dark-border rounded-md text-xs text-cream opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* USER SECTION */}
      <div className="border-t border-dark-border p-3 relative">
        <div
          onClick={() => setUserMenu((v) => !v)}
          className={`
            flex items-center gap-3 p-2 rounded-xl cursor-pointer
            hover:bg-dark-card/50 transition
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-plum to-plum-800 flex items-center justify-center border border-cyan/20">
              <FiUser className="w-4 h-4 text-cyan" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-surface" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="text-cream text-xs font-mono truncate">
                {user.name}
              </p>
              <p className="text-cyan/50 text-[10px] font-mono truncate">
                {user.role}
              </p>
            </div>
          )}
        </div>

        {/* USER MENU */}
        <AnimatePresence>
          {userMenu && !collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 left-3 right-3 bg-dark-surface border border-dark-border rounded-xl shadow-xl overflow-hidden z-50"
            >
              <button 
                onClick={() => navigate("/profile")}
                className="w-full text-left px-3 py-2 text-xs text-cream hover:bg-dark-card transition"
              >
                Profile Settings
              </button>

              <button className="w-full text-left px-3 py-2 text-xs text-coral hover:bg-coral/10 transition flex items-center gap-2">
                <FiLogOut className="w-3 h-3" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOGGLE */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="
          absolute -right-3 top-20
          w-6 h-6 rounded-full bg-dark-card border border-dark-border
          flex items-center justify-center
          hover:text-cyan hover:border-cyan/30 transition
        "
      >
        {collapsed ? (
          <FiChevronRight className="w-3 h-3" />
        ) : (
          <FiChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}