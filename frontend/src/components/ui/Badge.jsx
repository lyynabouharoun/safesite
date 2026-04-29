// frontend/src/components/ui/Badge.jsx

import { FiCircle, FiAlertCircle, FiCheckCircle, FiEye, FiVideo, FiPower, FiActivity } from 'react-icons/fi';

const VARIANTS = {
  // Status badges
  default: "bg-dark-muted text-cream/60 border border-dark-border",
  success: "bg-cyan/10 text-cyan border border-cyan/20",
  danger:  "bg-coral/10 text-coral border border-coral/20",
  warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  info:    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  purple:  "bg-plum/60 text-cyan border border-cyan/20",
  
  // Camera specific
  live:    "bg-red-500/15 text-red-400 border border-red-500/30",
  recording: "bg-cyan/15 text-cyan border border-cyan/30 animate-pulse",
  offline: "bg-dark-muted/50 text-cream/40 border border-dark-border",
  motion:  "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  
  // Alert levels
  critical: "bg-coral/20 text-coral border border-coral/30 shadow-sm shadow-coral/10",
  high:     "bg-orange-500/15 text-orange-400 border border-orange-500/25",
  medium:   "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  low:      "bg-cyan/10 text-cyan border border-cyan/20",
  
  // AI Detection
  ai:       "bg-plum/50 text-cyan border border-cyan/30 backdrop-blur-sm",
};

const SIZES = {
  sm: "px-1.5 py-0.5 text-[10px] gap-1 rounded",
  md: "px-2 py-0.5 text-xs gap-1.5 rounded-md",
  lg: "px-2.5 py-1 text-sm gap-1.5 rounded-lg",
};

// Optional: preset icons for different badge types
const getDefaultIcon = (variant) => {
  if (variant === 'live') return <FiCircle className="w-2.5 h-2.5 fill-red-400 text-red-400 animate-pulse" />;
  if (variant === 'recording') return <FiVideo className="w-2.5 h-2.5" />;
  if (variant === 'offline') return <FiPower className="w-2.5 h-2.5" />;
  if (variant === 'motion') return <FiActivity className="w-2.5 h-2.5" />;
  if (variant === 'danger' || variant === 'critical') return <FiAlertCircle className="w-2.5 h-2.5" />;
  if (variant === 'success') return <FiCheckCircle className="w-2.5 h-2.5" />;
  if (variant === 'ai') return <FiEye className="w-2.5 h-2.5" />;
  return null;
};

export default function Badge({ 
  children, 
  variant = "default", 
  size = "md",
  showIcon = false,
  icon = null,
  className = "" 
}) {
  const defaultIcon = showIcon ? (icon || getDefaultIcon(variant)) : null;
  
  return (
    <span className={`
      inline-flex items-center font-mono font-medium tracking-wide
      ${VARIANTS[variant]}
      ${SIZES[size]}
      ${className}
    `}>
      {defaultIcon && (
        <span className="flex-shrink-0">{defaultIcon}</span>
      )}
      {children}
    </span>
  );
}

// Optional: Preset badge components for common use cases
export const LiveBadge = () => (
  <Badge variant="live" size="sm" showIcon>
    LIVE
  </Badge>
);

export const RecordingBadge = () => (
  <Badge variant="recording" size="sm" showIcon>
    REC
  </Badge>
);

export const OfflineBadge = () => (
  <Badge variant="offline" size="sm" showIcon>
    OFFLINE
  </Badge>
);

export const MotionBadge = () => (
  <Badge variant="motion" size="sm" showIcon>
    MOTION
  </Badge>
);

export const AIDetectionBadge = ({ label = "AI" }) => (
  <Badge variant="ai" size="sm" showIcon>
    {label}
  </Badge>
);
