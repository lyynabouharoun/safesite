import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV = [
  {
    label: "Dashboard", path: "/dashboard",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
  },
  {
    label: "Cameras", path: "/cameras",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/></svg>
  },
  {
    label: "Alerts", path: "/alerts",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14.5 13H1.5L8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><line x1="8" y1="6" x2="8" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="8" cy="11" r="0.7" fill="currentColor"/></svg>
  },
  {
    label: "History", path: "/history",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 4.5V8.5L10.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  },
  {
    label: "Settings", path: "/settings",
    icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col bg-dark-surface border-r border-dark-border transition-all duration-300 ${collapsed ? "w-16" : "w-56"} min-h-screen flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center h-16 border-b border-dark-border px-4 gap-3 overflow-hidden">
        <div className="w-7 h-7 rounded-md bg-cyan flex-shrink-0 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="2.5" fill="#0d0d14" />
            <circle cx="7" cy="7" r="5.5" stroke="#0d0d14" strokeWidth="1.2" fill="none" />
          </svg>
        </div>
        {!collapsed && (
          <span className="font-mono text-xs font-medium tracking-widest text-cream uppercase whitespace-nowrap">
            SafeSite
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all text-sm
              ${isActive ? "bg-cyan/10 text-cyan" : "text-cream/40 hover:text-cream/80 hover:bg-dark-card"}`
            }
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="font-mono text-xs tracking-wide whitespace-nowrap">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center h-12 border-t border-dark-border text-cream/30 hover:text-cyan transition-colors"
      >
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        >
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </aside>
  );
}