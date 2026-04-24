import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/alerts/");
      setAlerts(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAlert = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/alerts/${id}/`);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchive = async (alert) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/alerts/${alert.id}/`, {
        archived: !alert.archived,
      });

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
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b border-blue-900/20 hover:bg-blue-950/30 transition"
                >
                  {/* Type */}
                  <td className="py-3 font-medium text-white capitalize">
                    {alert.type.replace("_", " ")}
                  </td>

                  {/* Confidence */}
                  <td>
                    <span className="px-2 py-1 rounded bg-blue-900/40 text-blue-200 text-xs">
                      {Math.round(alert.confidence * 100)}%
                    </span>
                  </td>

                  {/* Timestamp */}
                  <td className="text-blue-200/60">
                    {new Date(alert.timestamp).toLocaleString()}
                  </td>

                  {/* Status */}
                  <td>
                    {alert.archived ? (
                      <span className="px-2 py-1 text-xs rounded bg-gray-700/50 text-gray-300">
                        Archived
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-green-900/30 text-green-300">
                        Active
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => toggleArchive(alert)}
                      className="text-xs px-3 py-1 rounded bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50 transition"
                    >
                      {alert.archived ? "Unarchive" : "Archive"}
                    </button>

                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="text-xs px-3 py-1 rounded bg-red-900/30 text-red-300 hover:bg-red-900/50 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {alerts.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-blue-200/50"
                  >
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