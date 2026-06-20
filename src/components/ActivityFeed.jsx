import { useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Terminal } from 'lucide-react';

export default function ActivityFeed({ writeStack, evictions }) {
  const activities = useMemo(() => {
    const list = [];

    // Process writes
    writeStack.forEach(write => {
      list.push({
        id: write.id,
        type: 'WRITE',
        title: 'Cache Write Completed',
        description: `Key "${write.key}" written to server node ${write.serverId}`,
        timestamp: write.timestamp,
        icon: CheckCircle2,
        color: 'text-emerald-500 bg-emerald-500/10'
      });
    });

    // Process evictions
    evictions.forEach(eviction => {
      list.push({
        id: eviction.id,
        type: 'EVICTION',
        title: 'LRU Cache Eviction Triggered',
        description: `${eviction.keys.length} keys evicted from ${eviction.serverId} (Capacity reached)`,
        timestamp: eviction.timestamp,
        icon: AlertTriangle,
        color: 'text-red-500 bg-red-500/10'
      });
    });

    // Sort by timestamp descending
    list.sort((a, b) => b.timestamp - a.timestamp);

    // Take top 8
    return list.slice(0, 8);
  }, [writeStack, evictions]);

  return (
    <div className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border p-5 shadow-sm flex flex-col h-full min-h-[350px]">
      <div className="flex items-center gap-2 mb-4 border-b border-dashboard-border pb-3">
        <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-500">
          <Terminal className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text-primary">System Activity Log</h4>
          <p className="text-[10px] text-dashboard-text-secondary">Real-time cache pipeline events</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[300px]">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <span className="text-xs text-dashboard-text-secondary italic">No system events logged yet.</span>
            <span className="text-[10px] text-slate-500 mt-1">Perform a cache write or wait for the simulator to tick.</span>
          </div>
        ) : (
          activities.map((act) => {
            const IconComp = act.icon;
            const timeStr = new Date(act.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });

            return (
              <div
                key={act.id}
                className="flex items-start gap-3 text-xs group hover:bg-white/[0.02] p-1.5 rounded-lg transition-colors duration-200"
              >
                <div className={`p-1.5 rounded-md flex-shrink-0 ${act.color}`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-dashboard-text-primary truncate">
                      {act.title}
                    </p>
                    <span className="text-[9px] font-mono text-dashboard-text-secondary bg-dashboard-border/30 px-1 py-0.5 rounded flex-shrink-0">
                      {timeStr}
                    </span>
                  </div>
                  <p className="text-[11px] text-dashboard-text-secondary mt-0.5 leading-relaxed truncate">
                    {act.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
