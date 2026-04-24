import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const LOGS = [
  { time: "14:32:01", camera: "CAM-01", event: "Motion detected",      zone: "Zone-A", severity: "HIGH", status: "Open"     },
  { time: "13:15:44", camera: "CAM-02", event: "Person identified",     zone: "Zone-B", severity: "MED",  status: "Resolved" },
  { time: "12:04:11", camera: "CAM-04", event: "Camera disconnected",   zone: "Zone-A", severity: "MED",  status: "Resolved" },
  { time: "11:02:17", camera: "CAM-03", event: "Connection restored",   zone: "Zone-C", severity: "INFO", status: "Resolved" },
  { time: "10:45:33", camera: "CAM-06", event: "Recording started",     zone: "Zone-C", severity: "INFO", status: "Resolved" },
  { time: "09:30:00", camera: "CAM-01", event: "System armed",          zone: "Zone-A", severity: "LOW",  status: "Resolved" },
  { time: "08:00:00", camera: "ALL",    event: "Daily boot complete",   zone: "ALL",    severity: "INFO", status: "Resolved" },
];

const SEV_VARIANT = { HIGH: "danger", MED: "warning", LOW: "success", INFO: "purple" };

export default function History() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-cream">Event History</h2>
          <p className="text-xs font-mono text-cream/30 mt-0.5">Full audit log · Today</p>
        </div>
        <Badge variant="purple">{LOGS.length} RECORDS</Badge>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-dark-border">
                {["Timestamp","Camera","Event","Zone","Severity","Status"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-cream/30 font-medium tracking-wider uppercase text-[10px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LOGS.map((log, i) => (
                <tr key={i} className="border-b border-dark-border/50 hover:bg-dark-surface/60 transition-colors">
                  <td className="py-3 px-3 text-cream/50">{log.time}</td>
                  <td className="py-3 px-3 text-cyan">{log.camera}</td>
                  <td className="py-3 px-3 text-cream">{log.event}</td>
                  <td className="py-3 px-3 text-cream/50">{log.zone}</td>
                  <td className="py-3 px-3"><Badge variant={SEV_VARIANT[log.severity] || "default"}>{log.severity}</Badge></td>
                  <td className="py-3 px-3"><Badge variant={log.status === "Resolved" ? "success" : "danger"}>{log.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}