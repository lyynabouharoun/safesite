import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function StatsRow({ metrics, alerts }) {

  // 🧠 Real-time calculations from WebSocket alerts
  const totalAlerts = alerts.length;

  const dangerCount = alerts.filter(
    (a) => a.type === "weapon"
  ).length;

  const stats = [
  {
    label: "Input Feed",
    value: metrics.cameras === 1 ? "LIVE CAMERA" : "UPLOAD MODE",
    badge: "ACTIVE",
    variant: "success"
  },
  {
    label: "Detected Alerts",
    value: totalAlerts,
    badge: totalAlerts > 0 ? "REVIEW" : "CLEAR",
    variant: totalAlerts > 0 ? "danger" : "success"
  },
  {
    label: "High Risk Events",
    value: dangerCount,
    badge: dangerCount > 0 ? "CRITICAL" : "SAFE",
    variant: dangerCount > 0 ? "danger" : "success"
  },
  {
    label: "AI Processing Speed",
    value: `${metrics.fps} fps`,
    badge: "STABLE",
    variant: "success"
  },
  {
    label: "System Activity",
    value: "RUNNING",
    badge: "LIVE",
    variant: "purple"
  }
];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <Card key={s.label}>
          <span className="font-mono text-xs text-cream/30 uppercase tracking-widest">
            {s.label}
          </span>

          <div className="flex items-end justify-between mt-2">

            {/* 🔥 Dynamic value with alert animation */}
            <span
              className={`text-2xl font-light ${
                s.variant === "danger"
                  ? "text-red-500 animate-pulse"
                  : "text-cream"
              }`}
            >
              {s.value}
            </span>

            <Badge variant={s.variant}>{s.badge}</Badge>

          </div>
        </Card>
      ))}
    </div>
  );
}