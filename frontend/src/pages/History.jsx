import { useAlerts } from "../context/AlertsContext";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";

export default function History() {
  const { alerts, setAlerts } = useAlerts();

  const deleteLog = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/alerts/${id}/`);

      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchive = async (alert) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/alerts/${alert.id}/`,
        {
          archived: !alert.archived,
        }
      );

      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alert.id ? { ...a, archived: !a.archived } : a
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">📊 Alert History</h2>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr className="text-gray-600">
                <th className="py-3">Type</th>
                <th>Confidence</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {[...alerts].reverse().map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 font-medium">{alert.type}</td>

                  <td>
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                      {alert.confidence}
                    </span>
                  </td>

                  <td className="text-gray-600">{alert.timestamp}</td>

                  <td>
                    {alert.archived ? (
                      <span className="px-2 py-1 text-xs rounded bg-gray-200">
                        Archived
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="text-right space-x-2">
                    <button
                      onClick={() => toggleArchive(alert)}
                      className="text-sm px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    >
                      {alert.archived ? "Unarchive" : "Archive"}
                    </button>

                    <button
                      onClick={() => deleteLog(alert.id)}
                      className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {alerts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No alerts found
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