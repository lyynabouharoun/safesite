import DashboardLayout from "../components/layout/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import LiveFeed from "../components/dashboard/LiveFeed";
import AlertPanel from "../components/dashboard/AlertPanel";
import HistoryTable from "../components/dashboard/HistoryTable";

export default function Dashboard() {
  const metrics = { cameras: 3, alerts: 1, fps: 30, events: 12, uptime: "2h" };
  const alerts = [
    { title: "Motion detected — Entrance", time: "14:32:01", camera: "CAM-01", severity: "HIGH" },
  ];
  const logs = [
    { time: "14:32:01", camera: "CAM-01", event: "Motion detected", zone: "Zone-A", severity: "HIGH", status: "Open" },
    { time: "13:15:44", camera: "CAM-02", event: "Person identified", zone: "Zone-B", severity: "MED", status: "Resolved" },
    { time: "11:02:17", camera: "CAM-03", event: "Connection restored", zone: "Zone-C", severity: "INFO", status: "Resolved" },
  ];
  const frame = null;

  return (
    <DashboardLayout>
      <StatsRow metrics={metrics} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LiveFeed frame={frame} />
        </div>
        <AlertPanel alerts={alerts} />
      </div>
      <HistoryTable logs={logs} />
    </DashboardLayout>
  );
}