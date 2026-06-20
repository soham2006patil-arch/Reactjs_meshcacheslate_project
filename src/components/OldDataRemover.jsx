import { Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OldDataRemover({ evictions }) {
  const [displayItems, setDisplayItems] = useState([]);
  const [prevEvictions, setPrevEvictions] = useState([]);

  if (evictions !== prevEvictions) {
    setPrevEvictions(evictions);
    if (evictions.length > 0) {
      const latest = evictions[0];
      if (!displayItems.some(item => item.id === latest.id)) {
        setDisplayItems(prev => [{ ...latest, fading: false }, ...prev].slice(0, 3));
      }
    }
  }

  useEffect(() => {
    if (evictions.length > 0) {
      const latest = evictions[0];

      const fadeTimer = setTimeout(() => {
        setDisplayItems(prev => prev.map(item =>
          item.id === latest.id ? { ...item, fading: true } : item
        ));
      }, 3000);

      const removeTimer = setTimeout(() => {
        setDisplayItems(prev => prev.filter(item => item.id !== latest.id));
      }, 4000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [evictions]);

  return (
    <div className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border shadow-sm flex flex-col h-full p-5">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded bg-red-500/10 text-red-500">
          <Trash2 className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text-primary">LRU Eviction Sentinel</h4>
          <p className="text-[10px] text-dashboard-text-secondary">Triggers automatically when nodes exceed 95% load</p>
        </div>
      </div>

      <p className="text-[10px] uppercase font-semibold text-dashboard-text-secondary mb-3 tracking-wider">
        Next Deletion Candidates
      </p>

      <div className="flex-1 space-y-3 min-h-[120px] max-h-[180px] overflow-y-auto pr-1">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border border-dashed border-dashboard-border rounded-lg text-center h-full">
            <AlertCircle className="w-5 h-5 text-slate-600 mb-1.5" />
            <span className="text-xs text-dashboard-text-secondary italic">Sentinel stand-by.</span>
            <span className="text-[9px] text-slate-500 mt-1">No automatic evictions recorded.</span>
          </div>
        ) : (
          displayItems.map(item => (
            <div
              key={item.id}
              className={`bg-red-500/5 border border-red-500/10 p-3 rounded-lg transition-all duration-1000 ${
                item.fading ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100'
              }`}
            >
              <div className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LRU EVICTED: {item.keys.length} Keys from {item.serverId}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.keys.map((k, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] bg-[#020617] text-red-400/90 px-2 py-0.5 rounded font-mono border border-red-500/20"
                  >
                    {k.key}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
