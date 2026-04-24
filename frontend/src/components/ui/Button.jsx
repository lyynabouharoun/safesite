const VARIANTS = {
  primary:  "bg-cyan text-dark-base hover:bg-cyan/90",
  danger:   "bg-coral text-white hover:bg-coral/90",
  ghost:    "bg-transparent text-cream/60 border border-dark-border hover:text-cream hover:bg-dark-card",
  plum:     "bg-plum text-cyan border border-cyan/20 hover:bg-plum-800",
};

export default function Button({ children, variant = "ghost", onClick, disabled = false, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}