// frontend/src/components/ui/Button.jsx

const VARIANTS = {
  // Primary - cyan for main actions (view cameras, confirm)
  primary: "bg-cyan text-dark-base hover:bg-cyan/85 shadow-sm hover:shadow-cyan/10 shadow-cyan/5 transition-all",
  
  // Danger - coral for alerts, delete, critical
  danger: "bg-coral text-white hover:bg-coral/85 shadow-sm hover:shadow-coral/10 shadow-coral/5",
  
  // Ghost - subtle, for secondary actions
  ghost: "bg-transparent text-cream/70 hover:text-cream hover:bg-dark-card/80 border border-dark-border hover:border-cyan/30",
  
  // Outline - like ghost but more visible
  outline: "bg-transparent text-cyan border border-cyan/40 hover:border-cyan hover:bg-cyan/10 hover:text-cyan",
  
  // Plum - special actions (AI settings, advanced)
  plum: "bg-plum text-cyan border border-cyan/20 hover:bg-plum-800 hover:border-cyan/40 hover:text-cyan-light",
  
  // Success - acknowledge alert, camera online
  success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50",
  
  // Dark - surface level
  dark: "bg-dark-card text-cream/80 border border-dark-border hover:bg-dark-surface hover:border-cyan/20",
};

const SIZES = {
  xs: "px-2.5 py-1 text-xs gap-1.5 rounded-md",
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm gap-2 rounded-lg",
  lg: "px-5 py-2.5 text-base gap-2 rounded-xl",
  icon: "p-2 text-sm rounded-lg",
  "icon-sm": "p-1.5 text-xs rounded-md",
};

export default function Button({ 
  children, 
  variant = "ghost", 
  size = "md",
  onClick, 
  disabled = false, 
  loading = false,
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  className = "" 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-mono font-medium
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-cyan/30 focus:ring-offset-1 focus:ring-offset-dark-base
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        active:scale-[0.97]
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      
      <span className="font-medium tracking-wide">{children}</span>
      
      {!loading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}