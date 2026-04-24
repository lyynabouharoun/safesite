import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function StatsRow({ metrics }) {
  const stats = [
    { label: "Active Cameras", value: metrics.cameras, badge: "ONLINE",        variant: "success" },
    { label: "Open Alerts",    value: metrics.alerts,  badge: metrics.alerts > 0 ? "ACTION" : "ALL CLEAR", variant: metrics.alerts > 0 ? "danger" : "success" },
    { label: "Stream FPS",     value: `${metrics.fps} fps`, badge: "STABLE",   variant: "success" },
    { label: "Events Today",   value: metrics.events,  badge: "LOGGED",        variant: "purple"  },
    { label: "Uptime",         value: metrics.uptime,  badge: "RUNNING",       variant: "success" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <span className="font-mono text-xs text-cream/30 uppercase tracking-widest">{s.label}</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-light text-cream">{s.value}</span>
            <Badge variant={s.variant}>{s.badge}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}