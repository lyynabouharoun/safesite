import DashboardLayout from "../components/layout/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import LiveFeed from "../components/dashboard/LiveFeed";
import AlertPanel from "../components/dashboard/AlertPanel";
import HistoryTable from "../components/dashboard/HistoryTable";
import { useAlerts } from "../context/AlertsContext";

export default function Dashboard() {
  // 🔌 global alerts (REAL FIX)
  const { alerts } = useAlerts();
  const latestAlerts = alerts.slice(0, 5);


  // 📊 dynamic stats
  const metrics = {
    cameras: 3,
    alerts: alerts.length,
    fps: 30,
    events: alerts.length,
    uptime: "2h",
  };



  // 📜 logs (optional use later)
  const logs = alerts.map((a) => ({
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

        <AlertPanel alerts={latestAlerts} />
      </div>
    </DashboardLayout>
  );
}