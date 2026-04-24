import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-cyan" : "bg-dark-muted"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-dark-base rounded-full transition-all ${value ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    motionAlerts:    true,
    nightMode:       false,
    soundAlerts:     true,
    autoRecord:      true,
    emailNotify:     false,
    retentionDays:   30,
  });

  const set = (key, val) => setSettings((s) => ({ ...s, [key]: val }));

  const SECTIONS = [
    {
      title: "Detection",
      items: [
        { key: "motionAlerts", label: "Motion detection alerts", sub: "Trigger alert on motion events" },
        { key: "nightMode",    label: "Night mode",              sub: "Enhanced low-light processing" },
        { key: "autoRecord",   label: "Auto record on alert",    sub: "Start recording when alert fires" },
      ],
    },
    {
      title: "Notifications",
      items: [
        { key: "soundAlerts",  label: "Sound alerts",   sub: "Play audio on new alerts" },
        { key: "emailNotify",  label: "Email notifications", sub: "Send alert summaries by email" },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-base font-medium text-cream">System Settings</h2>
        <p className="text-xs font-mono text-cream/30 mt-0.5">Configure your SafeSite installation</p>
      </div>

      <div className="space-y-4 max-w-xl">
        {SECTIONS.map((section) => (
          <Card key={section.title}>
            <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-4">{section.title}</p>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-cream">{item.label}</p>
                    <p className="text-xs font-mono text-cream/30 mt-0.5">{item.sub}</p>
                  </div>
                  <Toggle value={settings[item.key]} onChange={(v) => set(item.key, v)} />
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Retention */}
        <Card>
          <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-4">Storage</p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-cream">Recording retention</p>
              <p className="text-xs font-mono text-cream/30 mt-0.5">Days to keep recordings</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => set("retentionDays", Math.max(7, settings.retentionDays - 7))}
                className="w-7 h-7 rounded-lg bg-dark-base border border-dark-border text-cream/50 hover:text-cream transition-colors text-sm">−</button>
              <span className="font-mono text-sm text-cream w-8 text-center">{settings.retentionDays}</span>
              <button onClick={() => set("retentionDays", Math.min(90, settings.retentionDays + 7))}
                className="w-7 h-7 rounded-lg bg-dark-base border border-dark-border text-cream/50 hover:text-cream transition-colors text-sm">+</button>
            </div>
          </div>
        </Card>

        {/* Version info */}
        <Card>
          <p className="font-mono text-xs text-cream/30 uppercase tracking-widest mb-3">System Info</p>
          {[
            ["Version",   "SafeSite v2.4.1"],
            ["Build",     "2026.04.22"],
            ["License",   "Professional"],
            ["Status",    "All systems operational"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-dark-border/50 last:border-0">
              <span className="font-mono text-xs text-cream/30">{k}</span>
              <span className="font-mono text-xs text-cream">{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </DashboardLayout>
  );
}