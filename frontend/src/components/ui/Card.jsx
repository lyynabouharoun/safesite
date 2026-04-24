export default function Card({ children, className = "", accent = false }) {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-xl p-4 ${accent ? "border-l-2 border-l-cyan" : ""} ${className}`}>
      {children}
    </div>
  );
}