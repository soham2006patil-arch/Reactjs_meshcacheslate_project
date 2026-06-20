import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OldDataRemover({ evictions }) {
  // Use a local state to handle the fade out
  const [displayItems, setDisplayItems] = useState([]);
  const [prevEvictions, setPrevEvictions] = useState([]);

  // Adjust state during render when the evictions prop changes
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
      }, 3000); // Wait 3s before fading

      const removeTimer = setTimeout(() => {
        setDisplayItems(prev => prev.filter(item => item.id !== latest.id));
      }, 4000); // Remove after fade completes

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [evictions]);

  return (
    <div className="bg-dashboard-card p-4 rounded-xl border border-dashboard-border flex flex-col h-auto">
      <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <Trash2 className="w-5 h-5 text-dashboard-accent" />
        Old Data Remover
      </h2>

      <p className="text-xs text-slate-400 mb-3">Next Deletion Candidate (LRU Eviction):</p>

      <div className="space-y-2 min-h-[100px]">
        {displayItems.length === 0 ? (
          <div className="text-sm text-slate-500 italic">No recent evictions.</div>
        ) : (
          displayItems.map(item => (
            <div
              key={item.id}
              className={`bg-red-500/10 border border-red-500/20 p-2 rounded transition-opacity duration-1000 ${item.fading ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="text-xs text-red-400 mb-1 font-semibold">
                AUTO EVICTED: {item.keys.length} Keys cleared from {item.serverId} due to high memory load
              </div>
              <div className="flex flex-wrap gap-1">
                {item.keys.map((k, i) => (
                  <span key={i} className="text-xs bg-slate-900 text-red-400 px-1.5 py-0.5 rounded font-mono border border-red-500/30">
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
