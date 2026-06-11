import { Activity, Power, PowerOff } from 'lucide-react';

export default function ServerStatusChecker({ servers, toggleServerStatus }) {
  return (
    <div className="bg-dashboard-card p-4 rounded-xl border border-dashboard-border flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-dashboard-accent" />
        d. Server Status list
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-dashboard-border">
              <th className="pb-2 font-medium">Server</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Load %</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {servers.map(server => {
              const isOnline = server.status === 'ONLINE';
              return (
                <tr key={server.id} className="border-b border-dashboard-border/50">
                  <td className="py-3 font-mono">{server.id}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${isOnline ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                      {server.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isOnline ? 'bg-dashboard-accent' : 'bg-slate-700'}`}
                          style={{ width: `${server.memoryUsed}%` }}
                        />
                      </div>
                      <span className={`text-xs ${isOnline ? 'text-slate-300' : 'text-slate-600'}`}>
                        {Math.round(server.memoryUsed)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <button 
                      onClick={() => toggleServerStatus(server.id)}
                      className="p-1.5 rounded hover:bg-slate-700 transition-colors"
                      title={isOnline ? "Simulate Crash" : "Reboot"}
                    >
                      {isOnline ? <PowerOff className="w-4 h-4 text-red-400" /> : <Power className="w-4 h-4 text-green-400" />}
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
