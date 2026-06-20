import { ArrowRight, ListPlus, Terminal } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function ReadRequestQueue({ readQueue, injectReadRequest }) {
  const [displayQueue, setDisplayQueue] = useState([]);
  const prevQueueRef = useRef([]);

  useEffect(() => {
    const prevQueue = prevQueueRef.current;

    // Find items that are newly added
    const added = readQueue.filter(req => !prevQueue.includes(req));
    // Find items that were removed
    const removed = prevQueue.filter(req => !readQueue.includes(req));

    if (added.length > 0 || removed.length > 0) {
      setDisplayQueue(prev => {
        let newDisplay = [...prev];

        // Mark removed items as exiting
        newDisplay = newDisplay.map(item => {
          if (removed.includes(item.id)) {
            return { ...item, exiting: true };
          }
          return item;
        });

        // Add new items
        added.forEach(req => {
          if (!newDisplay.find(item => item.id === req)) {
            newDisplay.push({ id: req, entering: true, exiting: false });
          }
        });

        return newDisplay;
      });

      // Clean up exiting and entering items after animation
      const timer = setTimeout(() => {
        setDisplayQueue(curr =>
          curr.filter(item => !item.exiting)
            .map(item => ({ ...item, entering: false }))
        );
      }, 300);

      prevQueueRef.current = readQueue;
      return () => clearTimeout(timer);
    } else {
      prevQueueRef.current = readQueue;
    }
  }, [readQueue]);

  return (
    <div className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border shadow-sm flex flex-col h-full p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-500">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text-primary">Request Queue</h4>
            <p className="text-[10px] text-dashboard-text-secondary">Live FIFO read request pipeline</p>
          </div>
        </div>
        
        <button
          onClick={injectReadRequest}
          className="text-[11px] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors duration-200 shadow-sm"
        >
          <ListPlus className="w-3.5 h-3.5" /> Inject Query
        </button>
      </div>

      <div className="flex justify-between items-center text-[10px] text-dashboard-text-secondary mb-3.5 font-mono uppercase tracking-wider">
        <span>Automatic Simulation Loop</span>
        <span className="bg-[#020617] px-2 py-0.5 rounded text-cyan-400 border border-white/5 font-semibold">
          QUEUE SIZE: {readQueue.length}
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 min-h-[48px] w-full">
        {displayQueue.map((item, i) => (
          <div
            key={item.id}
            className={`flex-shrink-0 bg-slate-900 border border-white/5 px-3.5 py-1.5 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2 transition-all duration-300 shadow-sm
              ${item.exiting ? 'opacity-0 -translate-x-6 scale-90' : 'opacity-100 translate-x-0 scale-100'}
              ${item.entering ? 'opacity-0 translate-x-6 scale-90' : ''}
            `}
          >
            <span>{item.id}</span>
            {i !== displayQueue.length - 1 && !item.exiting && (
              <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            )}
          </div>
        ))}
        {displayQueue.length === 0 && (
          <span className="text-xs text-dashboard-text-secondary italic">Queue currently empty</span>
        )}
      </div>
    </div>
  );
}
