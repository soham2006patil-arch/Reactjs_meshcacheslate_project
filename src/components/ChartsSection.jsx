import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Cpu, Activity, Disc } from 'lucide-react';

function CustomTooltip({ active, payload, label, unit = '' }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-semibold text-slate-100">
                {entry.value}
                {unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export default function ChartsSection({ history, theme }) {
  // Theme styling overrides
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';
  const labelColor = isDark ? '#64748b' : '#64748b';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* 1. Memory Usage Trend */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border p-5 shadow-sm flex flex-col h-[300px]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-500">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text-primary">Memory Usage Trend</h4>
            <p className="text-[10px] text-dashboard-text-secondary">Average cluster-wide load</p>
          </div>
        </div>
        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false} 
                stroke={labelColor} 
                dy={8}
                tick={{ fontSize: 9 }}
              />
              <YAxis 
                domain={[0, 100]} 
                tickLine={false} 
                axisLine={false} 
                stroke={labelColor} 
                tick={{ fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Area 
                type="monotone" 
                dataKey="memory" 
                name="Memory Load" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#memGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2. Request Throughput */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border p-5 shadow-sm flex flex-col h-[300px]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-500">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text-primary">Request Throughput</h4>
            <p className="text-[10px] text-dashboard-text-secondary">Requests processed per second</p>
          </div>
        </div>
        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false} 
                stroke={labelColor} 
                dy={8}
                tick={{ fontSize: 9 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                stroke={labelColor} 
                tick={{ fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip unit=" req/s" />} />
              <Area 
                type="monotone" 
                dataKey="throughput" 
                name="Throughput" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#throughputGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 3. Cache Hit vs Miss */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border p-5 shadow-sm flex flex-col h-[300px]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-500">
            <Disc className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text-primary">Cache Hits vs Misses</h4>
            <p className="text-[10px] text-dashboard-text-secondary">Distributed latency efficiency</p>
          </div>
        </div>
        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="hitsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="missesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="time" 
                tickLine={false} 
                axisLine={false} 
                stroke={labelColor} 
                dy={8}
                tick={{ fontSize: 9 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                stroke={labelColor} 
                tick={{ fontSize: 9 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="hits" 
                name="Hits" 
                stackId="1"
                stroke="#22c55e" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#hitsGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="misses" 
                name="Misses" 
                stackId="2"
                stroke="#ef4444" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#missesGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
