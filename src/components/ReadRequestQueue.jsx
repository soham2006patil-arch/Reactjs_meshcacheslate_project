import { ArrowRight, ListPlus } from 'lucide-react';
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
          // Ensure we don't duplicate keys
          if (!newDisplay.find(item => item.id === req)) {
            newDisplay.push({ id: req, entering: true, exiting: false });
          }
        });

        return newDisplay;
      });

      // Clean up exiting and entering items after animation (300ms)
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
    <div className={`bg-dashboard-card p-4 rounded-xl border border-dashboard-border flex flex-col h-auto overflow-hidden relative`}>
      <div className="flex justify-between items-center mb-4 z-10">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-dashboard-accent" />
          c. Request Queue
        </h2>
        <button 
          onClick={injectReadRequest}
          className="text-xs bg-dashboard-accent text-slate-900 px-2 py-1.5 rounded hover:bg-cyan-400 flex items-center gap-1 transition-colors font-medium"
        >
          <ListPlus className="w-3 h-3" /> Inject Request
        </button>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 mb-2 z-10">
        <span>Live FIFO pipeline</span>
        <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-slate-700">
          Queue Length: {readQueue.length}
        </span>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2 min-h-[40px] w-full">
        {displayQueue.map((item, i) => (
          <div 
            key={item.id}
            className={`flex-shrink-0 bg-slate-800 border border-slate-600 px-3 py-1.5 rounded-r-full rounded-l-md text-sm font-mono text-cyan-200 flex items-center gap-2 transition-all duration-300
              ${item.exiting ? 'opacity-0 -translate-x-12 -ml-24 scale-95' : 'opacity-100 translate-x-0 scale-100'}
              ${item.entering ? 'opacity-0 translate-x-12' : ''}
            `}
          >
            {item.id}
            {i !== displayQueue.length - 1 && !item.exiting && <ArrowRight className="w-3 h-3 text-slate-500" />}
          </div>
        ))}
        {displayQueue.length === 0 && (
          <span className="text-sm text-slate-500 italic">Queue is empty</span>
        )}
      </div>
    </div>
  );
}
