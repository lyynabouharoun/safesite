import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import DashboardLayout from "../components/layout/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import AlertPanel from "../components/dashboard/AlertPanel";
import { useAlerts } from "../context/AlertsContext";

export default function Dashboard() {
  const { alerts } = useAlerts();

  const [mode, setMode] = useState("live");
  const [video, setVideo] = useState(null);

  const metrics = {
    cameras: 3,
    alerts: alerts.length,
    fps: 30,
    events: alerts.length,
    uptime: "2h",
  };

  const latestAlerts = (alerts ?? []).slice(0, 5);

  const switchMode = (newMode) => {
    setMode(newMode);
    setVideo(null);
  };

  return (
    <DashboardLayout>
      {/* STATS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <StatsRow metrics={metrics} alerts={alerts} />
      </motion.div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-4 space-y-4"
        >

          {/* MODE SWITCH */}
          <div className="flex gap-2">
            {["live", "upload"].map((m) => (
              <motion.button
                key={m}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => switchMode(m)}
                className={`px-3 py-1 text-xs rounded-lg transition relative overflow-hidden ${
                  mode === m
                    ? "bg-cyan text-dark-base shadow-lg shadow-cyan/20"
                    : "bg-dark-base text-cream hover:bg-dark-card"
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="modeGlow"
                    className="absolute inset-0 bg-cyan/20"
                  />
                )}
                {m === "live" ? "Live Camera" : "Upload Video"}
              </motion.button>
            ))}
          </div>

          {/* CONTENT SWITCH WITH ANIMATION */}
          <AnimatePresence mode="wait">

            {/* LIVE */}
            {mode === "live" && (
              <motion.div
                key="live"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <LiveCamera />
              </motion.div>
            )}

            {/* UPLOAD */}
            {mode === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0])}
                  className="text-sm text-cream"
                />

                {video && (
                  <motion.video
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    controls
                    className="w-full rounded-lg border border-dark-border"
                    src={URL.createObjectURL(video)}
                  />
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-3 py-2 text-xs bg-coral/10 text-coral rounded-lg hover:bg-coral/20 transition"
                >
                  Send to AI Service
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertPanel alerts={latestAlerts} />
        </motion.div>

      </div>
    </DashboardLayout>
  );
}

/* ---------------- LIVE CAMERA ---------------- */

function LiveCamera() {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera error:", err));

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <video
        ref={videoRef}
        autoPlay
        className="w-full rounded-lg border border-dark-border"
      />

      {/* LIVE indicator overlay */}
      <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/40 px-2 py-1 rounded-md">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-cream font-mono">LIVE FEED</span>
      </div>
    </motion.div>
  );
}