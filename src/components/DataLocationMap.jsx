import { Server, Database } from 'lucide-react';

export default function DataLocationMap({ servers, activeNodeId, setActiveNodeId, addMockData }) {
  const activeServer = servers.find(s => s.id === activeNodeId);

  return (
    <div className="bg-dashboard-card p-4 rounded-xl border border-dashboard-border flex flex-col h-auto">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">a. Simplified Data Location Map</h2>
      <p className="text-sm text-slate-400 mb-4">Click a node to view its cached keys.</p>
      
  
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"> 
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setActiveNodeId(activeNodeId === server.id ? null : server.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${ 
              activeNodeId === server.id 
                ? 'border-dashboard-accent bg-dashboard-accent/10' 
                : 'border-dashboard-border hover:border-slate-500 bg-slate-800/50'
            } ${server.status === 'FAILED' ? 'opacity-50 grayscale' : ''}`}
          >
            <Server className={`w-8 h-8 mb-2 ${server.status === 'ONLINE' ? 'text-cyan-400' : 'text-red-500'}`} /> 
            <span className="text-xs font-mono">{server.id}</span>
          </button>
        ))}
      </div> 

      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          activeServer 
            ? 'max-h-[300px] opacity-100 mt-4' 
            : 'max-h-0 opacity-0 mt-0 pointer-events-none'
        }`}
      >
        <div className="bg-slate-900 rounded-lg p-3 border border-dashboard-border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4 text-dashboard-accent" />
              {activeServer?.id || ''} Cache
            </h3>
            <button 
              onClick={() => activeServer && addMockData(activeServer.id)}
              disabled={!activeServer || activeServer.status === 'FAILED'}
              className="text-xs bg-dashboard-accent text-slate-900 px-2 py-1 rounded hover:bg-cyan-400 disabled:opacity-50 transition-colors"
            >
              Add Mock Data
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
            {!activeServer || activeServer.cachedKeys.length === 0 ? (
              <span className="text-xs text-slate-500">Empty cache</span>
            ) : (
              activeServer.cachedKeys.map((k, i) => (
                <span key={i} className="text-xs bg-slate-800 px-2 py-1 rounded text-cyan-200 border border-slate-700 font-mono">
                  {k.key}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
