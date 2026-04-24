import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function AlertPanel({ alerts }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-cream">Alert Feed</div>
        {alerts.length > 0 && <Badge variant="danger">{alerts.length} NEW</Badge>}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <span className="font-mono text-xs text-cream/20">No active alerts</span>
          </div>
        ) : (
          alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-coral/5 border border-coral/20">
              <div className="w-1.5 h-1.5 rounded-full bg-coral mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-cream">{alert.title}</p>
                <p className="text-xs font-mono text-cream/40 mt-0.5">{alert.time} · {alert.camera}</p>
              </div>
              <Badge variant="danger">{alert.severity}</Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}