import { motion } from "framer-motion";
import { FiCamera, FiBell, FiCpu, FiActivity, FiClock } from "react-icons/fi";

export default function StatsRow({ metrics }) {
  const stats = [
    {
      label: "Cameras",
      value: metrics?.cameras || 0,
      icon: FiCamera,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Alerts",
      value: metrics?.alerts || 0,
      icon: FiBell,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      label: "Processing",
      value: `${metrics?.fps || 0} fps`,
      icon: FiCpu,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      subtext: "AI Speed",
    },
    {
      label: "Events",
      value: metrics?.events || 0,
      icon: FiActivity,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "Uptime",
      value: metrics?.uptime || "2h",
      icon: FiClock,
      color: "from-yellow-500 to-amber-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isAlert = stat.label === "Alerts" && stat.value > 0;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative overflow-hidden rounded-xl p-4 backdrop-blur-sm
              bg-dark-card/50 border ${stat.borderColor}
              hover:scale-[1.02] transition-transform duration-200 cursor-default
              ${isAlert ? 'ring-1 ring-red-500/50 shadow-lg shadow-red-500/10' : ''}
            `}
          >
            {/* Gradient border effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 rounded-xl`} />
            
            {/* Animated pulse for alerts */}
            {isAlert && (
              <div className="absolute top-2 right-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
            )}
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-cream/40 text-[10px] font-mono tracking-wider uppercase mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold tracking-tight ${isAlert ? 'text-red-500' : 'text-cream'}`}>
                  {stat.value}
                </p>
                {stat.subtext && (
                  <p className="text-cream/30 text-[9px] font-mono mt-0.5">{stat.subtext}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${isAlert ? 'text-red-500' : 'text-cream/60'}`} />
              </div>
            </div>
            
            {/* Mini progress bar for alerts */}
            {stat.label === "Alerts" && (
              <div className="mt-3 h-1 bg-dark-base rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / 50) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                />
              </div>
            )}
            
            {/* Mini progress bar for processing */}
            {stat.label === "Processing" && (
              <div className="mt-3 h-1 bg-dark-base rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(metrics?.fps / 60) * 100 || 0}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}