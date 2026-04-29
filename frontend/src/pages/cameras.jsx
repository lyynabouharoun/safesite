import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { motion } from "framer-motion";

const CAMERAS = [
  { id: "CAM-01", name: "Main Entrance", zone: "Zone-A", status: "Online", fps: 30, res: "1080p" },
  { id: "CAM-02", name: "Parking Lot", zone: "Zone-B", status: "Online", fps: 25, res: "1080p" },
  { id: "CAM-03", name: "Server Room", zone: "Zone-C", status: "Online", fps: 30, res: "4K" },
  { id: "CAM-04", name: "Back Exit", zone: "Zone-A", status: "Offline", fps: 0, res: "720p" },
  { id: "CAM-05", name: "Rooftop", zone: "Zone-B", status: "Offline", fps: 0, res: "1080p" },
  { id: "CAM-06", name: "Reception Desk", zone: "Zone-C", status: "Online", fps: 30, res: "1080p" },
];

export default function Cameras() {
  const online = CAMERAS.filter((c) => c.status === "Online").length;
  const offline = CAMERAS.filter((c) => c.status === "Offline").length;

  return (
    <DashboardLayout>

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-base font-medium text-cream">
            Camera Control Room
          </h2>
          <p className="text-xs font-mono text-cream/30 mt-0.5">
            {online} active nodes · {offline} offline nodes
          </p>
        </div>

        <Badge variant="success">LIVE GRID</Badge>
      </motion.div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

        {CAMERAS.map((cam, i) => {
          const isOnline = cam.status === "Online";

          return (
            <motion.div
              key={cam.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card accent={isOnline}>

                {/* FEED BOX */}
                <div className="aspect-video bg-dark-base rounded-lg border border-dark-border flex items-center justify-center mb-3 relative overflow-hidden">

                  {isOnline ? (
                    <>
                      {/* LIVE CAMERA VISUAL */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full border border-cyan/30 flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 bg-cyan rounded-full" />
                        </div>
                        <span className="font-mono text-xs text-cyan/40 tracking-widest">
                          LIVE FEED
                        </span>
                      </div>

                      {/* LIVE PULSE */}
                      <div className="absolute top-2 right-2 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                      </div>

                      {/* SCAN LINE EFFECT */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/5 to-transparent animate-pulse" />

                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-60">
                      <div className="w-10 h-10 rounded-full border border-cream/10 flex items-center justify-center">
                        <div className="w-2 h-2 bg-cream/20 rounded-full" />
                      </div>
                      <span className="font-mono text-xs text-cream/20">
                        NO SIGNAL
                      </span>
                    </div>
                  )}

                </div>

                {/* INFO */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-cream">
                      {cam.name}
                    </p>
                    <p className="text-xs font-mono text-cream/30 mt-0.5">
                      {cam.id} · {cam.zone}
                    </p>
                  </div>

                  <Badge variant={isOnline ? "success" : "danger"}>
                    {cam.status.toUpperCase()}
                  </Badge>
                </div>

                {/* STATS */}
                <div className="flex gap-3 mt-3">

                  <div className="flex-1 bg-dark-base rounded-lg p-2 text-center">
                    <p className="font-mono text-xs text-cream/30">FPS</p>
                    <p className="font-mono text-sm text-cream mt-0.5">
                      {cam.fps}
                    </p>
                  </div>

                  <div className="flex-1 bg-dark-base rounded-lg p-2 text-center">
                    <p className="font-mono text-xs text-cream/30">RES</p>
                    <p className="font-mono text-sm text-cream mt-0.5">
                      {cam.res}
                    </p>
                  </div>

                  <div className="flex-1 bg-dark-base rounded-lg p-2 text-center">
                    <p className="font-mono text-xs text-cream/30">ZONE</p>
                    <p className="font-mono text-sm text-cream mt-0.5">
                      {cam.zone.replace("Zone-", "")}
                    </p>
                  </div>

                </div>

              </Card>
            </motion.div>
          );
        })}

      </div>

    </DashboardLayout>
  );
}