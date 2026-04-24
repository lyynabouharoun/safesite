// frontend/src/layout/Sidebar.jsx

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiGrid, FiCamera, FiBell, FiClock, FiSettings, FiLogOut, FiUser, FiChevronLeft, FiChevronRight, FiShield } from 'react-icons/fi';

const NAV = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: FiGrid,
  },
  {
    label: "Cameras",
    path: "/cameras",
    icon: FiCamera,
  },
  {
    label: "Alerts",
    path: "/alerts",
    icon: FiBell,
  },
  {
    label: "History",
    path: "/history",
    icon: FiClock,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: FiSettings,
  },
];

export default function Sidebar({ user = { name: "Admin", role: "Security Operator" } }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`
        flex flex-col bg-dark-surface/95 backdrop-blur-sm border-r border-dark-border 
        transition-all duration-300 ease-in-out flex-shrink-0 relative z-20
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Logo Section */}
      <div className="flex items-center h-16 border-b border-dark-border px-4 gap-3 overflow-hidden">
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-cyan/60 flex-shrink-0 flex items-center justify-center shadow-lg shadow-cyan/20">
          <FiShield className="w-4 h-4 text-dark-base" />
          {/* Pulse ring animation */}
          <div className="absolute inset-0 rounded-lg border border-cyan/50 animate-pulse" />
        </div>
        
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-mono text-sm font-bold tracking-wider text-cream block whitespace-nowrap">
              SAFESITE
            </span>
            <span className="font-mono text-[10px] text-cyan/60 tracking-wider block -mt-0.5">
              SECURITY AI
            </span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1 px-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl 
                transition-all duration-200 font-mono text-sm
                ${isActive 
                  ? "bg-cyan/10 text-cyan shadow-sm" 
                  : "text-cream/40 hover:text-cream/80 hover:bg-dark-card/50"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-all ${collapsed ? "w-5 h-5" : ""}`} />
              
              {!collapsed && (
                <span className="text-xs tracking-wide whitespace-nowrap">
                  {item.label}
                </span>
              )}
              
              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="
                  absolute left-full ml-2 px-2 py-1 bg-dark-card border border-dark-border 
                  rounded-md text-xs font-mono text-cream whitespace-nowrap
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                  transition-all duration-200 z-50 shadow-lg
                ">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-dark-border pt-4 pb-6">
        <div className={`px-3 ${collapsed ? "flex justify-center" : ""}`}>
          <div className="group relative">
            <div className={`
              flex items-center gap-3 rounded-xl p-2 transition-all duration-200
              hover:bg-dark-card/50 cursor-pointer
              ${collapsed ? "justify-center" : ""}
            `}>
              {/* Avatar */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-plum to-plum-800 flex items-center justify-center border border-cyan/20">
                  <FiUser className="w-4 h-4 text-cyan" />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-dark-surface" />
              </div>
              
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-cream text-xs font-mono font-medium truncate">
                    {user.name}
                  </p>
                  <p className="text-cyan/50 text-[10px] font-mono truncate">
                    {user.role}
                  </p>
                </div>
              )}
            </div>
            
            {/* Expanded user menu tooltip for collapsed mode */}
            {collapsed && (
              <div className="
                absolute left-full ml-2 bottom-0 px-3 py-2 bg-dark-card border border-dark-border 
                rounded-lg min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-200 z-50 shadow-xl
              ">
                <p className="text-cream text-sm font-mono">{user.name}</p>
                <p className="text-cyan/60 text-xs font-mono">{user.role}</p>
                <div className="h-px bg-dark-border my-2" />
                <button className="flex items-center gap-2 text-cream/60 hover:text-coral text-xs font-mono w-full transition-colors">
                  <FiLogOut className="w-3 h-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="
          absolute -right-3 top-20
          w-6 h-6 rounded-full bg-dark-card border border-dark-border
          flex items-center justify-center
          text-cream/40 hover:text-cyan hover:border-cyan/30
          transition-all duration-200 shadow-md
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