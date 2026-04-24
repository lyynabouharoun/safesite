import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function LiveFeed({ frame }) {
  return (
    <Card accent>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-cream">Live Feed</div>
          <div className="text-xs font-mono text-cream/30 mt-0.5">CAM-01 · Entrance</div>
        </div>
        <Badge variant="danger">● REC</Badge>
      </div>

      <div className="relative aspect-video bg-dark-base rounded-lg border border-dark-border flex items-center justify-center overflow-hidden">
        {frame ? (
          <img src={frame} alt="Live feed" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-cream/10">
              <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="font-mono text-xs text-cream/20">AWAITING SIGNAL</span>
          </div>
        )}
        <div className="absolute inset-3 pointer-events-none">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan/40" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan/40" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan/40" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan/40" />
        </div>
      </div>

      <div className="flex justify-between mt-3 text-xs font-mono text-cream/30">
        <span>1920×1080 · H.264</span>
        <span>30 FPS</span>
        <span>ZONE-A</span>
      </div>
    </Card>
  );
}