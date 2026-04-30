import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { useAlerts } from "../context/AlertsContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";

export default function History() {
  const { alerts, setAlerts } = useAlerts();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const deleteLog = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/api/alerts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchive = async (alert) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://127.0.0.1:8000/api/alerts/${alert.id}/`, {
        archived: !alert.archived,
      }, {
        headers: { Authorization: `Bearer ${token}` }
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

  const getDate = (t) => {
    const d = new Date(t);
    return isNaN(d.getTime()) ? null : d;
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const filteredAlerts = alerts.filter((alert) => {
    const d = getDate(alert.timestamp);
    if (!d) return false;

    if (typeFilter !== "all" && alert.type !== typeFilter) return false;
    if (timeFilter === "today" && d < todayStart) return false;
    if (timeFilter === "24h" && d < last24h) return false;

    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate + "T23:59:59")) return false;

    return true;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "violence":
      case "suspicious":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-yellow-400 bg-yellow-500/10";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "violence":
        return "🔴 Violence";
      case "suspicious":
        return "🟠 Suspicious Activity";
      default:
        return "⚠️ Unknown";
    }
  };

  return (
    <DashboardLayout>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-xl font-bold text-cream font-mono">
          Alert History
        </h2>
        <p className="text-xs text-cream/50">
          Security event audit timeline
        </p>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-3 mt-4 items-center">

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-dark-card border border-dark-border px-3 py-2 rounded-lg text-xs text-cream"
          >
            <option value="all">All Types</option>
            <option value="violence">🚨 Violence</option>
            <option value="suspicious">⚠️ Suspicious</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-dark-card border border-dark-border px-3 py-2 rounded-lg text-xs text-cream"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="24h">Last 24h</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-dark-card border border-dark-border px-3 py-2 rounded-lg text-xs text-cream"
          />

          <span className="text-cream/40 text-xs">to</span>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-dark-card border border-dark-border px-3 py-2 rounded-lg text-xs text-cream"
          />

          {(fromDate || toDate || typeFilter !== "all" || timeFilter !== "all") && (
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
                setTypeFilter("all");
                setTimeFilter("all");
              }}
              className="text-xs text-cyan hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </motion.div>

      {/* TABLE */}
      <Card>
        <div className="overflow-x-auto">

          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-cream/40 border-b border-dark-border">
                <th className="py-3 text-left">Type</th>
                <th>Confidence</th>
                <th>Timestamp</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {[...filteredAlerts].reverse().map((alert, i) => (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className="border-b border-dark-border/50 hover:bg-dark-base/40 transition"
                  >

                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize ${getTypeColor(
                          alert.type
                        )}`}
                      >
                        {getTypeLabel(alert.type)}
                      </span>
                    </td>

                    <td className="text-cream/60">
                      <span className="px-2 py-1 rounded bg-dark-base text-cyan text-xs">
                        {alert.confidence ? `${(alert.confidence * 100).toFixed(1)}%` : "--"}
                      </span>
                    </td>

                    <td className="text-cream/60">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>

                    <td className="text-right space-x-2">
                      <button
                        onClick={() => toggleArchive(alert)}
                        className="px-3 py-1 text-xs rounded bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition"
                      >
                        {alert.archived ? "Unarchive" : "Archive"}
                      </button>

                      <button
                        onClick={() => deleteLog(alert.id)}
                        className="px-3 py-1 text-xs rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      >
                        Delete
                      </button>
                    </td>

                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {filteredAlerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-cream/40 text-sm"
            >
              No security events found for selected filters
            </motion.div>
          )}

        </div>
      </Card>

    </DashboardLayout>
  );
}