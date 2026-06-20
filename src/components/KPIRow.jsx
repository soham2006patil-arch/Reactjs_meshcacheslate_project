import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Activity, Compass, Cpu } from 'lucide-react';

function CountUp({ value, suffix = '', decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) return;
    if (end === 0) return;

    const duration = 1200; // ms
    const increment = end / (duration / 16); // 60fps approx

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function KPIRow({ servers, cumulativeStats }) {
  const onlineCount = servers.filter(s => s.status === 'ONLINE').length;
  const totalNodes = servers.length;

  const hitRate = cumulativeStats.totalRequests > 0
    ? (cumulativeStats.cacheHits / cumulativeStats.totalRequests) * 100
    : 94.2;

  const activeReqs = cumulativeStats.totalRequests > 0 
    ? Math.floor(cumulativeStats.totalRequests / 180) // normalized simulation value
    : 104;

  const avgMem = servers.filter(s => s.status === 'ONLINE').reduce((acc, s) => acc + s.memoryUsed, 0) / (onlineCount || 1);

  const statsData = [
    {
      title: 'Total Nodes',
      value: totalNodes,
      subtext: `${onlineCount} Online`,
      trend: { text: '100% operational', isPositive: true },
      icon: Server,
      glow: 'shadow-cyan-500/10 border-cyan-500/20',
      iconColor: 'text-cyan-500 bg-cyan-500/15',
      decimals: 0,
      suffix: ''
    },
    {
      title: 'Cache Hit Rate',
      value: hitRate,
      subtext: 'Target > 92%',
      trend: { text: '+0.8% vs last hr', isPositive: true },
      icon: Activity,
      glow: 'shadow-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-500 bg-emerald-500/15',
      decimals: 2,
      suffix: '%'
    },
    {
      title: 'Active Requests',
      value: activeReqs,
      subtext: 'In-flight queries',
      trend: { text: '+4.2% spikes', isPositive: true },
      icon: Compass,
      glow: 'shadow-amber-500/10 border-amber-500/20',
      iconColor: 'text-amber-500 bg-amber-500/15',
      decimals: 0,
      suffix: ' req/s'
    },
    {
      title: 'Memory Utilization',
      value: avgMem || 0,
      subtext: '8x nodes cluster pool',
      trend: { text: '-1.4% reclaimed', isPositive: true },
      icon: Cpu,
      glow: 'shadow-indigo-500/10 border-indigo-500/20',
      iconColor: 'text-indigo-500 bg-indigo-500/15',
      decimals: 1,
      suffix: '%'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
    >
      {statsData.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className={`relative overflow-hidden bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border p-6 shadow-md transition-all duration-300 ${stat.glow} hover:shadow-lg`}
          >
            {/* Soft background glow circles */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-current opacity-[0.03] blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-dashboard-text-secondary">
                  {stat.title}
                </p>
                <h3 className="mt-2 text-3xl font-bold font-mono tracking-tight text-dashboard-text-primary">
                  <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </h3>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.iconColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-dashboard-border/50 pt-3">
              <span className="text-[11px] font-medium text-dashboard-text-secondary">
                {stat.subtext}
              </span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                stat.trend.isPositive 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {stat.trend.text}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
