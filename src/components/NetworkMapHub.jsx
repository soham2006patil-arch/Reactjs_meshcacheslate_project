import { Network, Search, Zap, Database } from 'lucide-react';
import { useState, useMemo } from 'react';

// Hardcoded connections between the 8 servers to form a mesh
const TOPOLOGY = {
  'Srv 01': ['Srv 02', 'Srv 04', 'Srv 05'],
  'Srv 02': ['Srv 01', 'Srv 03', 'Srv 05', 'Srv 06'],
  'Srv 03': ['Srv 02', 'Srv 06', 'Srv 08'],
  'Srv 04': ['Srv 01', 'Srv 05', 'Srv 07'],
  'Srv 05': ['Srv 01', 'Srv 02', 'Srv 04', 'Srv 06', 'Srv 07'],
  'Srv 06': ['Srv 02', 'Srv 03', 'Srv 05', 'Srv 08', 'Srv 07'],
  'Srv 07': ['Srv 04', 'Srv 05', 'Srv 06', 'Srv 08'],
  'Srv 08': ['Srv 03', 'Srv 06', 'Srv 07']
};

// Node coordinates (for SVG drawing, percentages 0-100) arranged in a circle to prevent edge clipping
const COORDS = {
  'Srv 01': { x: 25, y: 25 },
  'Srv 02': { x: 50, y: 15 },
  'Srv 03': { x: 75, y: 25 },
  'Srv 04': { x: 15, y: 50 },
  'Srv 05': { x: 85, y: 50 },
  'Srv 06': { x: 25, y: 75 },
  'Srv 07': { x: 50, y: 85 },
  'Srv 08': { x: 75, y: 75 }
};

export default function NetworkMapHub({ servers }) {
  const [source, setSource] = useState('Srv 01');
  const [target, setTarget] = useState('Srv 08');

  // Re-run BFS and pathEdges calculation whenever source, target, or server statuses change
  const { path, latency, pathEdges } = useMemo(() => {
    if (source === target) {
      return { path: [], latency: 0, pathEdges: [] };
    }

    const isOnline = (id) => {
      const s = servers.find(srv => srv.id === id);
      return s && s.status === 'ONLINE';
    };

    if (!isOnline(source) || !isOnline(target)) {
      return { path: [], latency: 0, pathEdges: [] };
    }

    // BFS
    let queue = [[source]];
    let visited = new Set([source]);
    let foundPath = null;

    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentNode = currentPath[currentPath.length - 1];

      if (currentNode === target) {
        foundPath = currentPath;
        break;
      }

      const neighbors = TOPOLOGY[currentNode];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && isOnline(neighbor)) {
          visited.add(neighbor);
          queue.push([...currentPath, neighbor]);
        }
      }
    }

    if (foundPath) {
      // Calculate total latency based on pings
      const totalLatency = foundPath.reduce((acc, nodeId) => {
        const s = servers.find(srv => srv.id === nodeId);
        return acc + (s ? s.ping : 0);
      }, 0);

      // Compute edges for SVG rendering
      const edges = [];
      for (let i = 0; i < foundPath.length - 1; i++) {
        edges.push(`${foundPath[i]}-${foundPath[i+1]}`);
      }

      return { path: foundPath, latency: totalLatency, pathEdges: edges };
    }

    return { path: [], latency: 0, pathEdges: [] };
  }, [source, target, servers]);

  return (
    <div className="bg-dashboard-card p-4 rounded-xl border border-dashboard-border flex flex-col h-auto col-span-1 md:col-span-2 lg:col-span-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-dashboard-accent" />
            f. Network Map Hub
          </h2>
          <p className="text-xs text-slate-400">Interactive graph & g. Quickest Route</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <select 
          value={source} 
          onChange={e => setSource(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 flex-1 focus:outline-none focus:border-dashboard-accent"
        >
          {servers.map(s => <option key={s.id} value={s.id}>{s.id} {s.status === 'FAILED' ? '(Offline)' : ''}</option>)}
        </select>
        <span className="text-slate-500 self-center text-xs">to</span>
        <select 
          value={target} 
          onChange={e => setTarget(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 flex-1 focus:outline-none focus:border-dashboard-accent"
        >
          {servers.map(s => <option key={s.id} value={s.id}>{s.id} {s.status === 'FAILED' ? '(Offline)' : ''}</option>)}
        </select>
      </div>

      {path.length > 0 ? (
        <div className="bg-dashboard-accent/10 border border-dashboard-accent/30 rounded p-2 mb-4 flex items-center justify-between">
          <div className="text-xs text-cyan-200 flex items-center gap-2">
            <Zap className="w-3 h-3 text-cyan-400" /> Path Found
          </div>
          <div className="text-xs font-mono text-cyan-400">{latency}ms latency</div>
        </div>
      ) : (
        <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mb-4">
          <div className="text-xs text-red-400 flex items-center gap-2">
            <Search className="w-3 h-3" /> No valid path
          </div>
        </div>
      )}

      <div className="relative flex-1 w-full bg-slate-900 rounded-lg border border-slate-800 min-h-[250px] overflow-hidden mt-2 p-4">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Base edges */}
          {Object.entries(TOPOLOGY).map(([node, neighbors]) => 
            neighbors.map(neighbor => {
              // avoid duplicate lines by checking order
              if (node < neighbor) {
                const c1 = COORDS[node];
                const c2 = COORDS[neighbor];
                const isPath = pathEdges.includes(`${node}-${neighbor}`) || pathEdges.includes(`${neighbor}-${node}`);
                return (
                  <line 
                    key={`${node}-${neighbor}`}
                    x1={`${c1.x}%`} y1={`${c1.y}%`}
                    x2={`${c2.x}%`} y2={`${c2.y}%`}
                    stroke={isPath ? '#22d3ee' : '#334155'}
                    strokeWidth={isPath ? 3 : 1}
                    className={isPath ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300" : "transition-all duration-300"}
                    strokeLinecap="round"
                  />
                );
              }
              return null;
            })
          )}
        </svg>

        {/* Nodes */}
        {servers.map(server => {
          const coords = COORDS[server.id];
          const inPath = path.includes(server.id);
          const isSource = source === server.id;
          const isTarget = target === server.id;
          
          return (
            <div 
              key={server.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center
                w-10 h-10 rounded-full border-2 transition-all duration-300 z-10
                ${server.status === 'FAILED' ? 'bg-slate-800 border-red-500/50' : 'bg-slate-800 border-slate-600 hover:border-slate-400'}
                ${inPath ? 'border-dashboard-accent shadow-[0_0_15px_rgba(34,211,238,0.5)] bg-dashboard-accent/20' : ''}
              `}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              title={`${server.id} - ${server.status} (${server.ping}ms)`}
            >
              <Database className={`w-4 h-4 ${server.status === 'FAILED' ? 'text-red-500/50' : inPath ? 'text-cyan-300' : 'text-slate-400'}`} />
              <div className="absolute -bottom-5 text-[10px] font-mono whitespace-nowrap text-slate-400 font-medium bg-slate-900/80 px-1 rounded">
                {server.id}
              </div>
              {(isSource || isTarget) && (
                <div className={`absolute -top-5 text-[10px] font-bold ${isSource ? 'text-green-400' : 'text-purple-400'} bg-slate-900/80 px-1 rounded`}>
                  {isSource ? 'SRC' : 'DST'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
