const VARIANTS = {
  default: "bg-dark-muted text-cream/60",
  success: "bg-cyan/10 text-cyan",
  danger:  "bg-coral/10 text-coral",
  warning: "bg-yellow-500/10 text-yellow-400",
  purple:  "bg-plum/60 text-cyan border border-cyan/20",
};

export default function Badge({ children, variant = "default" }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}