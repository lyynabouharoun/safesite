export default function StatsRow({ metrics }) {
  return (
    <div className="stats-row">
      <div>Cameras: {metrics?.cameras || 0}</div>
      <div>Alerts: {metrics?.alerts || 0}</div>
      <div>FPS: {metrics?.fps || 0}</div>
      <div>Events: {metrics?.events || 0}</div>
      <div>Uptime: {metrics?.uptime || "0h"}</div>
    </div>
  );
}