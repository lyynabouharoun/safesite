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
      label: "Active Cameras",
      value: metrics.cameras,
      badge: "ONLINE",
      variant: "success"
    },
    {
      label: "Open Alerts",
      value: totalAlerts,
      badge: totalAlerts > 0 ? "ACTION" : "ALL CLEAR",
      variant: totalAlerts > 0 ? "danger" : "success"
    },
    {
      label: "Danger Alerts",
      value: dangerCount,
      badge: dangerCount > 0 ? "HIGH" : "SAFE",
      variant: dangerCount > 0 ? "danger" : "success"
    },
    {
      label: "Stream FPS",
      value: `${metrics.fps} fps`,
      badge: "STABLE",
      variant: "success"
    },
    {
      label: "Events Today",
      value: metrics.events + totalAlerts,
      badge: "LOGGED",
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