import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const NOTIFS = [
  { id: 1, type: "HIGH",   title: "Motion detected at Entrance",    sub: "CAM-01 · Zone-A",          time: "2 min ago",  read: false },
  { id: 2, type: "HIGH",   title: "Unrecognized person detected",   sub: "CAM-02 · Zone-B",          time: "18 min ago", read: false },
  { id: 3, type: "MED",    title: "Camera CAM-04 went offline",     sub: "Back Exit · Zone-A",       time: "1 hr ago",   read: true  },
  { id: 4, type: "INFO",   title: "System backup completed",        sub: "All zones · Scheduled",    time: "3 hr ago",   read: true  },
  { id: 5, type: "LOW",    title: "Night mode activated",           sub: "CAM-03 · Zone-C",          time: "6 hr ago",   read: true  },
  { id: 6, type: "INFO",   title: "Daily boot complete",            sub: "All cameras · 08:00",      time: "Today",      read: true  },
];

const TYPE_ICON = {
  HIGH: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L13 12H1L7 1.5Z" stroke="#DA4848" strokeWidth="1.3" strokeLinejoin="round"/>
      <line x1="7" y1="5" x2="7" y2="8" stroke="#DA4848" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="7" cy="10" r="0.6" fill="#DA4848"/>
    </svg>
  ),
  MED: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="#facc15" strokeWidth="1.3"/>
      <line x1="7" y1="4" x2="7" y2="7.5" stroke="#facc15" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="7" cy="9.5" r="0.6" fill="#facc15"/>
    </svg>
  ),
  LOW: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="#76D2DB" strokeWidth="1.3"/>
      <path d="M4.5 7L6.5 9L9.5 5" stroke="#76D2DB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  INFO: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="#8b5cf6" strokeWidth="1.3"/>
      <line x1="7" y1="6" x2="7" y2="10" stroke="#8b5cf6" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="7" cy="4.5" r="0.6" fill="#8b5cf6"/>
    </svg>
  ),
};

const SEV_VARIANT = { HIGH: "danger", MED: "warning", LOW: "success", INFO: "purple" };

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFS);
  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const dismiss = (id) => setNotifs((n) => n.filter((x) => x.id !== id));
  const markRead = (id) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

 return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-cream">Notifications</h2>
          <p className="text-xs font-mono text-cream/30 mt-0.5">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 rounded-lg font-mono text-xs text-cream/40 border border-dark-border hover:text-cream hover:border-cyan/30 transition-all"
          >
            Mark all read
          </button>
        )}
      </div>

      <Card>
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-cream/10">
              <path d="M16 4a8 8 0 018 8v5l2 3H6l2-3v-5a8 8 0 018-8z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13 24a3 3 0 006 0" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="font-mono text-xs text-cream/20">No notifications</span>
          </div>
        ) : (
          <div className="divide-y divide-dark-border/50">
            {notifs.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 py-3 px-1 transition-colors group ${!n.read ? "bg-cyan/[0.03]" : ""}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {!n.read
                    ? <span className="w-1.5 h-1.5 rounded-full bg-cyan block mt-1" />
                    : <span className="w-1.5 h-1.5 block" />
                  }
                </div>

                <div className="flex-shrink-0 mt-0.5">{TYPE_ICON[n.type]}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-medium ${n.read ? "text-cream/60" : "text-cream"}`}>
                      {n.title}
                    </p>
                    <Badge variant={SEV_VARIANT[n.type]}>{n.type}</Badge>
                  </div>
                  <p className="text-xs font-mono text-cream/30 mt-0.5">{n.sub}</p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-mono text-xs text-cream/25">{n.time}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="px-2 py-0.5 rounded font-mono text-[10px] text-cyan/60 hover:text-cyan border border-cyan/20 hover:bg-cyan/5 transition-all"
                      >
                        Read
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(n.id)}
                      className="px-2 py-0.5 rounded font-mono text-[10px] text-cream/30 hover:text-coral border border-dark-border hover:border-coral/30 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}