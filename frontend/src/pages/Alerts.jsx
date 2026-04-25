import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import { useAlerts } from "../context/AlertsContext";

export default function Alerts() {
  const { alerts } = useAlerts();

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6 text-blue-200">
        🚨 Alerts
      </h2>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b border-blue-900/40">
              <tr className="text-blue-300/70">
                <th className="py-3">Type</th>
                <th>Confidence</th>
                <th>Timestamp</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-blue-900/20 hover:bg-blue-950/30 transition"
                >
                  <td className="py-3 font-medium text-white capitalize">
                    {alert.type.replace("_", " ")}
                  </td>

                  <td>
                    <span className="px-2 py-1 rounded bg-blue-900/40 text-blue-200 text-xs">
                      {Math.round(alert.confidence * 100)}%
                    </span>
                  </td>

                  <td className="text-blue-200/60">
                    {new Date(alert.timestamp).toLocaleString()}
                  </td>

                  <td>
                    <span className="text-green-300 text-xs">
                      Live
                    </span>
                  </td>
                </tr>
              ))}

              {alerts.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-blue-200/50"
                  >
                    No alerts received yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  );
}