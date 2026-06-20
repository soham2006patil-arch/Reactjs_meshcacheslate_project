import { Activity, Power, PowerOff, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function ServerStatusChecker({ servers, toggleServerStatus }) {
  return (
    <div className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 p-5 border-b border-dashboard-border/50">
        <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-500">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text-primary">Server Node Registry</h4>
          <p className="text-[10px] text-dashboard-text-secondary">Individual memory footprint & routing status</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto max-h-[350px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-dashboard-text-secondary border-b border-dashboard-border/50 bg-[#020617]/20 sticky top-0 backdrop-blur-md">
              <th className="py-3 px-5 font-semibold uppercase tracking-wider">Node ID</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Ping</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Memory Allocation</th>
              <th className="py-3 px-5 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border/30">
            {servers.map(server => {
              const isOnline = server.status === 'ONLINE';
              const memoryPct = Math.round(server.memoryUsed);
              
              // Determine progress bar color based on memory load
              let barColor = 'bg-cyan-500';
              if (memoryPct > 80) barColor = 'bg-amber-500';
              if (memoryPct > 90) barColor = 'bg-red-500';
              if (!isOnline) barColor = 'bg-slate-700';

              return (
                <tr 
                  key={server.id} 
                  className="hover:bg-white/[0.01] transition-colors duration-200"
                >
                  {/* Node ID */}
                  <td className="py-3.5 px-5 font-mono font-semibold text-dashboard-text-primary">
                    {server.id}
                  </td>
                  
                  {/* Status Badges */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      isOnline 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {isOnline ? (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          ONLINE
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3" />
                          FAILED
                        </>
                      )}
                    </span>
                  </td>

                  {/* Ping latency */}
                  <td className="py-3.5 px-4 font-mono font-medium text-dashboard-text-secondary">
                    {isOnline ? `${server.ping}ms` : '—'}
                  </td>

                  {/* Memory Progress Bar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1.5 bg-[#020617] rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${isOnline ? memoryPct : 0}%` }}
                        />
                      </div>
                      <span className={`font-mono text-[11px] font-semibold ${isOnline ? 'text-dashboard-text-primary' : 'text-dashboard-text-secondary'}`}>
                        {isOnline ? `${memoryPct}%` : '0%'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => toggleServerStatus(server.id)}
                      className={`p-1.5 rounded-md border transition-all duration-200 ${
                        isOnline 
                          ? 'border-red-500/10 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20' 
                          : 'border-emerald-500/10 text-emerald-400/80 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'
                      }`}
                      title={isOnline ? "Simulate Node Failure" : "Reboot Node"}
                    >
                      {isOnline ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
