import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Database, Zap, Plus, X, Radio } from 'lucide-react';

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

const COORDS = {
  'Srv 01': { x: 25, y: 22 },
  'Srv 02': { x: 50, y: 12 },
  'Srv 03': { x: 75, y: 22 },
  'Srv 04': { x: 12, y: 50 },
  'Srv 05': { x: 50, y: 50 },
  'Srv 06': { x: 88, y: 50 },
  'Srv 07': { x: 25, y: 78 },
  'Srv 08': { x: 75, y: 78 }
};

export default function NetworkMapHub({ servers, activeNodeId, setActiveNodeId, addMockData }) {
  const [source, setSource] = useState('Srv 01');
  const [target, setTarget] = useState('Srv 08');

  // BFS Route Path Calculation
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

      const neighbors = TOPOLOGY[currentNode] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && isOnline(neighbor)) {
          visited.add(neighbor);
          queue.push([...currentPath, neighbor]);
        }
      }
    }

    if (foundPath) {
      const totalLatency = foundPath.reduce((acc, nodeId) => {
        const s = servers.find(srv => srv.id === nodeId);
        return acc + (s ? s.ping : 0);
      }, 0);

      const edges = [];
      for (let i = 0; i < foundPath.length - 1; i++) {
        edges.push(`${foundPath[i]}-${foundPath[i + 1]}`);
      }

      return { path: foundPath, latency: totalLatency, pathEdges: edges };
    }

    return { path: [], latency: 0, pathEdges: [] };
  }, [source, target, servers]);

  const activeServer = servers.find(s => s.id === activeNodeId);

  // SVG Animated Path string
  const animatedPathD = useMemo(() => {
    if (path.length < 2) return '';
    return path.map((nodeId, idx) => {
      const coord = COORDS[nodeId];
      return `${idx === 0 ? 'M' : 'L'} ${coord.x}% ${coord.y}%`;
    }).join(' ');
  }, [path]);

  return (
    <div className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border shadow-sm flex flex-col xl:flex-row gap-6 p-6 h-full min-h-[500px]">
      
      {/* 1. Main Network Visualization Area */}
      <div className="flex-1 flex flex-col relative min-h-[380px] bg-slate-950/40 rounded-lg border border-dashboard-border/30 overflow-hidden">
        
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-dashboard-text-primary">Live Mesh Cluster Topology</span>
          </div>
          <p className="text-[10px] text-dashboard-text-secondary mt-0.5">Click nodes to inspect caches</p>
        </div>

        {/* SVG Network Connections (Background layer) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Default connections grid */}
          {Object.entries(TOPOLOGY).map(([node, neighbors]) =>
            neighbors.map(neighbor => {
              if (node < neighbor) {
                const c1 = COORDS[node];
                const c2 = COORDS[neighbor];
                const isPath = pathEdges.includes(`${node}-${neighbor}`) || pathEdges.includes(`${neighbor}-${node}`);
                return (
                  <line
                    key={`${node}-${neighbor}`}
                    x1={`${c1.x}%`} y1={`${c1.y}%`}
                    x2={`${c2.x}%`} y2={`${c2.y}%`}
                    stroke={isPath ? '#06b6d4' : 'rgba(255, 255, 255, 0.04)'}
                    strokeWidth={isPath ? 3 : 1.2}
                    className="transition-all duration-300"
                  />
                );
              }
              return null;
            })
          )}

          {/* Glowing Animated Route Path */}
          {animatedPathD && (
            <>
              {/* Outer stroke glow */}
              <path
                d={animatedPathD}
                fill="none"
                stroke="rgba(6, 182, 212, 0.35)"
                strokeWidth="6"
                strokeLinecap="round"
                className="blur-[2px]"
              />
              {/* Animated dashed line */}
              <path
                d={animatedPathD}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-packet-line"
              />
            </>
          )}
        </svg>

        {/* Interactive Server Nodes (Overlay) */}
        {servers.map(server => {
          const coord = COORDS[server.id];
          const isSelected = activeNodeId === server.id;
          const isOnline = server.status === 'ONLINE';
          const isInRoute = path.includes(server.id);
          const isSrc = source === server.id;
          const isDst = target === server.id;

          return (
            <button
              key={server.id}
              onClick={() => setActiveNodeId(isSelected ? null : server.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 flex flex-col items-center outline-none`}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
            >
              {/* Glowing Pulse Rings */}
              {isOnline && (
                <span className="absolute flex h-11 w-11 items-center justify-center pointer-events-none">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-10 ${
                    isInRoute ? 'bg-cyan-400' : 'bg-slate-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-8 w-8 ${
                    isInRoute ? 'bg-cyan-500/10' : 'bg-slate-800/20'
                  }`}></span>
                </span>
              )}

              {/* Node Circle */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                !isOnline 
                  ? 'bg-slate-900 border-red-500/30 text-red-500 opacity-60' 
                  : isSelected
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : isInRoute
                      ? 'bg-slate-900 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'bg-[#0f172a] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}>
                <Database className="w-4.5 h-4.5" />
              </div>

              {/* Node ID label */}
              <div className={`mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-tight border transition-colors ${
                isSelected 
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-slate-950/80 border-white/5 text-slate-400'
              }`}>
                {server.id}
              </div>

              {/* Route Markers */}
              {(isSrc || isDst) && isOnline && (
                <span className={`absolute -top-5 text-[8px] font-bold px-1 rounded shadow-sm ${
                  isSrc ? 'bg-emerald-500 text-slate-950' : 'bg-purple-500 text-white'
                }`}>
                  {isSrc ? 'SRC' : 'DST'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Control Panel & Inspector Sidebar */}
      <div className="w-full xl:w-72 flex flex-col gap-5 justify-between">
        
        {/* BFS Pathfinding Selector */}
        <div className="bg-[#020617]/50 rounded-lg p-4 border border-dashboard-border/30">
          <h4 className="text-xs font-bold uppercase tracking-wider text-dashboard-text-primary mb-3 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-cyan-500" />
            BFS Router
          </h4>
          
          <div className="space-y-3.5">
            <div>
              <label className="text-[10px] text-dashboard-text-secondary uppercase font-semibold">Source node</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/10 text-xs text-dashboard-text-primary rounded-md p-2 outline-none focus:border-cyan-500"
              >
                {servers.map(s => (
                  <option key={s.id} value={s.id} disabled={s.status !== 'ONLINE'}>
                    {s.id} {s.status === 'FAILED' ? '(OFFLINE)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-dashboard-text-secondary uppercase font-semibold">Destination node</label>
              <select
                value={target}
                onChange={e => setTarget(e.target.value)}
                className="w-full mt-1 bg-slate-900 border border-white/10 text-xs text-dashboard-text-primary rounded-md p-2 outline-none focus:border-cyan-500"
              >
                {servers.map(s => (
                  <option key={s.id} value={s.id} disabled={s.status !== 'ONLINE'}>
                    {s.id} {s.status === 'FAILED' ? '(OFFLINE)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashboard-border/50">
            {path.length > 0 ? (
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                  <Zap className="w-3 h-3 text-emerald-500" /> path active
                </span>
                <span className="font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/30">
                  {latency}ms total
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-red-400 italic">
                No active route (Offline nodes)
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Cache Inspector drawer */}
        <div className="flex-1 flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {activeServer ? (
              <motion.div
                key={activeServer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#020617]/50 rounded-lg p-4 border border-dashboard-border/30 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dashboard-text-primary flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-500" />
                      {activeServer.id} Cache
                    </h4>
                    <button
                      onClick={() => setActiveNodeId(null)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[10px] text-dashboard-text-secondary mb-3 flex items-center justify-between font-mono">
                    <span>Keys: {activeServer.cachedKeys.length}</span>
                    <span>Load: {Math.round(activeServer.memoryUsed)}%</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {activeServer.cachedKeys.length === 0 ? (
                      <span className="text-xs text-slate-500 italic py-2">Cache directory empty</span>
                    ) : (
                      activeServer.cachedKeys.map((k, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] bg-slate-900 text-cyan-300 border border-white/5 px-2 py-0.5 rounded font-mono"
                        >
                          {k.key}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addMockData(activeServer.id)}
                  disabled={activeServer.status === 'FAILED'}
                  className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs py-2 rounded-md transition-colors flex items-center justify-center gap-1 shadow-md shadow-cyan-500/10"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Cache Key
                </button>
              </motion.div>
            ) : (
              <div className="h-full border border-dashed border-dashboard-border rounded-lg flex items-center justify-center p-4 text-center">
                <p className="text-[11px] text-dashboard-text-secondary">
                  Select any server node in the grid visualization to inspect current local memory indices.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
