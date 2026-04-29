// frontend/src/components/ui/Card.jsx

const VARIANTS = {
  default: "bg-dark-card border-dark-border",
  elevated: "bg-dark-card border-dark-border shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 transition-shadow",
  glass: "bg-dark-card/80 backdrop-blur-sm border border-white/5",
  alert: "bg-dark-card border-coral/40 ring-1 ring-coral/20",
  success: "bg-dark-card border-cyan/40 ring-1 ring-cyan/20",
  warning: "bg-dark-card border-amber-500/40 ring-1 ring-amber-500/20",
};

export default function Card({ 
  children, 
  variant = "default",
  className = "", 
  accent = false,
  accentColor = "cyan", // cyan, coral, plum, amber
  hoverable = false,
  padding = true,
  onClick = null,
}) {
  const accentColors = {
    cyan: "border-l-cyan",
    coral: "border-l-coral",
    plum: "border-l-plum",
    amber: "border-l-amber-500",
  };
  
  const isClickable = onClick || hoverable;
  
  return (
    <div
      onClick={onClick}
      className={`
        bg-dark-card border rounded-xl transition-all duration-200
        ${VARIANTS[variant]}
        ${padding ? "p-4" : "p-0"}
        ${accent ? `border-l-2 ${accentColors[accentColor]}` : ""}
        ${isClickable ? "cursor-pointer" : ""}
        ${hoverable ? "hover:-translate-y-0.5 hover:border-cyan/30 hover:shadow-lg hover:shadow-cyan/5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Preset card components for common use cases
export const StatsCard = ({ title, value, icon, trend, trendValue, variant = "default" }) => (
  <Card variant={variant} hoverable>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-cream/50 text-xs font-mono uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-cream mt-1 font-mono">{value}</p>
        
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-xs font-mono ${trend === 'up' ? 'text-coral' : 'text-cyan'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-cream/40 text-xs">vs last hour</span>
          </div>
        )}
      </div>
      
      {icon && (
        <div className="p-2 rounded-lg bg-cyan/5 border border-cyan/10">
          {icon}
        </div>
      )}
    </div>
  </Card>
);

export const CameraCard = ({ name, location, status, thumbnail, onClick, isActive = false }) => {
  const statusConfig = {
    live: { badge: "LIVE", color: "border-red-500/50" },
    recording: { badge: "REC", color: "border-cyan/50" },
    offline: { badge: "OFFLINE", color: "border-dark-muted" },
    motion: { badge: "MOTION", color: "border-amber-500/50" },
  };
  
  const currentStatus = statusConfig[status] || statusConfig.offline;
  
  return (
    <Card 
      variant={isActive ? "elevated" : "default"}
      hoverable 
      onClick={onClick}
      className="overflow-hidden group"
    >
      {/* Thumbnail area */}
      <div className="relative -m-4 mb-2">
        <div className="aspect-video bg-dark-surface rounded-t-xl overflow-hidden">
          {thumbnail ? (
            <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-surface to-dark-card">
              <span className="text-cream/20 text-4xl">📷</span>
            </div>
          )}
        </div>
        
        {/* Status badge overlay */}
        <div className="absolute top-2 left-2">
          <span className={`
            inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold
            ${status === 'live' ? 'bg-red-500 text-white animate-pulse' : ''}
            ${status === 'recording' ? 'bg-cyan text-dark-base' : ''}
            ${status === 'offline' ? 'bg-dark-muted text-cream/40' : ''}
            ${status === 'motion' ? 'bg-amber-500 text-dark-base' : ''}
          `}>
            {status === 'live' && "●"}
            {currentStatus.badge}
          </span>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
      </div>
      
      {/* Card content */}
      <div className="mt-3">
        <h4 className="font-mono font-semibold text-cream text-sm">{name}</h4>
        <p className="text-cream/40 text-xs mt-0.5">{location}</p>
      </div>
    </Card>
  );
};

export const AlertCard = ({ title, timestamp, severity, message, onAcknowledge, isNew = false }) => {
  const severityConfig = {
    critical: { color: "border-coral", bg: "bg-coral/5", icon: "⚠️" },
    high: { color: "border-orange-500", bg: "bg-orange-500/5", icon: "⚡" },
    medium: { color: "border-amber-500", bg: "bg-amber-500/5", icon: "!" },
    low: { color: "border-cyan", bg: "bg-cyan/5", icon: "ℹ️" },
  };
  
  const config = severityConfig[severity] || severityConfig.low;
  
  return (
    <Card 
      variant="default" 
      accent 
      accentColor={severity === 'critical' ? 'coral' : severity === 'high' ? 'amber' : 'cyan'}
      className={`${config.bg} ${isNew ? 'animate-pulse shadow-md shadow-coral/10' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-mono font-semibold text-cream text-sm truncate">{title}</h4>
            <span className="text-cream/40 text-xs font-mono">{timestamp}</span>
          </div>
          <p className="text-cream/60 text-sm mt-1">{message}</p>
          
          {onAcknowledge && (
            <button
              onClick={onAcknowledge}
              className="mt-2 text-xs font-mono text-cyan hover:text-cyan-light transition-colors"
            >
              Acknowledge →
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};