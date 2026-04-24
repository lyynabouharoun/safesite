import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const ALL_ALERTS = [
  { id: 1, title: "Motion detected",       camera: "CAM-01", zone: "Zone-A", time: "14:32:01", severity: "HIGH",   status: "Open"     },
  { id: 2, title: "Unrecognized person",   camera: "CAM-02", zone: "Zone-B", time: "13:15:44", severity: "HIGH",   status: "Open"     },
  { id: 3, title: "Camera disconnected",   camera: "CAM-04", zone: "Zone-A", time: "12:04:11", severity: "MED",    status: "Resolved" },
  { id: 4, title: "Night mode triggered",  camera: "CAM-03", zone: "Zone-C", time: "20:00:00", severity: "LOW",    status: "Resolved" },
  { id: 5, title: "Connection restored",   camera: "CAM-04", zone: "Zone-A", time: "11:02:17", severity: "INFO",   status: "Resolved" },
];

const SEV_VARIANT = { HIGH: "danger", MED: "warning", LOW: "success", INFO: "purple" };

export default function Alerts() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Open", "Resolved"];

  const filtered = filter === "All" ? ALL_ALERTS : ALL_ALERTS.filter(a => a.status === filter);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-cream">Alert Center</h2>
          <p className="text-xs font-mono text-cream/30 mt-0.5">
            {ALL_ALERTS.filter(a => a.status === "Open").length} open · {ALL_ALERTS.filter(a => a.status === "Resolved").length} resolved
          </p>
        </div>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                filter === f
                  ? "bg-cyan/10 text-cyan border border-cyan/20"
                  : "text-cream/40 border border-dark-border hover:text-cream"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <div className="space-y-2">
          {filtered.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-colors
                ${alert.status === "Open"
                  ? "bg-coral/5 border-coral/20 hover:bg-coral/10"
                  : "bg-dark-base border-dark-border hover:bg-dark-surface"
                }`}
            >
              <div className={`w-1.5 h-10 rounded-full flex-shrink-0 ${
                alert.severity === "HIGH" ? "bg-coral" :
                alert.severity === "MED"  ? "bg-yellow-400" :
                alert.severity === "LOW"  ? "bg-cyan" : "bg-plum-800"
              }`} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-cream">{alert.title}</p>
                <p className="text-xs font-mono text-cream/30 mt-0.5">
                  {alert.camera} · {alert.zone} · {alert.time}
                </p>
              </div>

              <Badge variant={SEV_VARIANT[alert.severity]}>{alert.severity}</Badge>
              <Badge variant={alert.status === "Open" ? "danger" : "success"}>{alert.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}