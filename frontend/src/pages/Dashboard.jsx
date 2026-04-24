import DashboardLayout from "../components/layout/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import LiveFeed from "../components/dashboard/LiveFeed";
import AlertPanel from "../components/dashboard/AlertPanel";
import HistoryTable from "../components/dashboard/HistoryTable";
import useWebSocket from "../hooks/useWebSocket";

export default function Dashboard() {
  // 🔌 connect to backend
  const alerts = useWebSocket("ws://127.0.0.1:8000/ws/alerts/");

  // 📊 dynamic stats
  const metrics = {
    cameras: 3, // you can make this dynamic later
    alerts: alerts.length,
    fps: 30,
    events: alerts.length,
    uptime: "2h",
  };

  // 🚨 transform alerts for UI
  const formattedAlerts = alerts.map((a, i) => ({
    title: a.message || "Unknown alert",
    time: a.time || new Date().toLocaleTimeString(),
    camera: a.camera || "CAM-01",
    severity: a.type === "weapon" ? "HIGH" : "MED",
  }));

  // 📜 logs = same alerts but formatted differently
  const logs = alerts.map((a, i) => ({
    time: a.time || new Date().toLocaleTimeString(),
    camera: a.camera || "CAM-01",
    event: a.message || "Detection",
    zone: a.zone || "Zone-A",
    severity: a.type === "weapon" ? "HIGH" : "MED",
    status: "Open",
  }));

  const frame = null;

  return (
    <DashboardLayout>
     <StatsRow metrics={metrics} alerts={alerts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LiveFeed frame={frame} />
        </div>

        <AlertPanel alerts={formattedAlerts} />
      </div>

    
    </DashboardLayout>
  );
}