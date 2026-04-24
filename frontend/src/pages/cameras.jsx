import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

const CAMERAS = [
  { id: "CAM-01", name: "Main Entrance",   zone: "Zone-A", status: "Online",  fps: 30, res: "1080p" },
  { id: "CAM-02", name: "Parking Lot",     zone: "Zone-B", status: "Online",  fps: 25, res: "1080p" },
  { id: "CAM-03", name: "Server Room",     zone: "Zone-C", status: "Online",  fps: 30, res: "4K"    },
  { id: "CAM-04", name: "Back Exit",       zone: "Zone-A", status: "Offline", fps: 0,  res: "720p"  },
  { id: "CAM-05", name: "Rooftop",         zone: "Zone-B", status: "Offline", fps: 0,  res: "1080p" },
  { id: "CAM-06", name: "Reception Desk",  zone: "Zone-C", status: "Online",  fps: 30, res: "1080p" },
];

export default function Cameras() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-cream">Camera Management</h2>
          <p className="text-xs font-mono text-cream/30 mt-0.5">
            {CAMERAS.filter(c => c.status === "Online").length} online · {CAMERAS.filter(c => c.status === "Offline").length} offline
          </p>
        </div>
        <Badge variant="success">ALL ZONES</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAMERAS.map((cam) => (
          <Card key={cam.id} accent={cam.status === "Online"}>
            {/* Feed placeholder */}
            <div className="aspect-video bg-dark-base rounded-lg border border-dark-border flex items-center justify-center mb-3 relative overflow-hidden">
              {cam.status === "Online" ? (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan/20">
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <span className="font-mono text-xs text-cream/20">LIVE</span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-coral" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cream/10">
                    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="font-mono text-xs text-cream/20">NO SIGNAL</span>
                </div>
              )}
            </div>

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-cream">{cam.name}</p>
                <p className="text-xs font-mono text-cream/30 mt-0.5">{cam.id} · {cam.zone}</p>
              </div>
              <Badge variant={cam.status === "Online" ? "success" : "danger"}>
                {cam.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex gap-3 mt-3">
              <div className="flex-1 bg-dark-base rounded-lg p-2 text-center">
                <p className="font-mono text-xs text-cream/30">FPS</p>
                <p className="font-mono text-sm text-cream mt-0.5">{cam.fps}</p>
              </div>
              <div className="flex-1 bg-dark-base rounded-lg p-2 text-center">
                <p className="font-mono text-xs text-cream/30">RES</p>
                <p className="font-mono text-sm text-cream mt-0.5">{cam.res}</p>
              </div>
              <div className="flex-1 bg-dark-base rounded-lg p-2 text-center">
                <p className="font-mono text-xs text-cream/30">ZONE</p>
                <p className="font-mono text-sm text-cream mt-0.5">{cam.zone.replace("Zone-", "")}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}