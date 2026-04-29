import Card from "../ui/Card";
import Badge from "../ui/Badge";

const SEV = { HIGH: "danger", MED: "warning", LOW: "success", INFO: "purple" };

export default function HistoryTable({ logs }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-cream">Event History</div>
        <span className="font-mono text-xs text-cream/30">{logs.length} records</span>
      </div>

      {logs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <span className="font-mono text-xs text-cream/20">No events logged yet</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-dark-border">
                {["Timestamp","Camera","Event","Zone","Severity","Status"].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-cream/30 font-medium tracking-wider uppercase text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-dark-border/50 hover:bg-dark-surface/60 transition-colors">
                  <td className="py-3 px-3 text-cream/50">{log.time}</td>
                  <td className="py-3 px-3 text-cyan">{log.camera}</td>
                  <td className="py-3 px-3 text-cream">{log.event}</td>
                  <td className="py-3 px-3 text-cream/50">{log.zone}</td>
                  <td className="py-3 px-3"><Badge variant={SEV[log.severity] || "default"}>{log.severity}</Badge></td>
                  <td className="py-3 px-3"><Badge variant={log.status === "Resolved" ? "success" : "danger"}>{log.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}