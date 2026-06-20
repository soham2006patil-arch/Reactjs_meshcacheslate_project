import { useState } from 'react';
import { History, Undo, Send } from 'lucide-react';

export default function WriteHistoryUndo({ writeStack, writeData, undoWrite }) {
  const [input, setInput] = useState('');

  const handleWrite = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    writeData(input.trim());
    setInput('');
  };

  return (
    <div className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border shadow-sm flex flex-col h-full p-5">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-500">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-dashboard-text-primary">Cache Write Client</h4>
          <p className="text-[10px] text-dashboard-text-secondary">Inject write operations into random nodes</p>
        </div>
      </div>

      {/* Form Input */}
      <form onSubmit={handleWrite} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. user_session_42"
          className="flex-1 bg-slate-900 border border-white/10 rounded-md px-3 py-2 text-xs text-dashboard-text-primary focus:outline-none focus:border-cyan-500 transition-colors duration-200"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-2 rounded-md font-bold text-xs flex items-center gap-1 transition-colors duration-200 shadow-sm"
        >
          <Send className="w-3.5 h-3.5" /> Write
        </button>
      </form>

      {/* Write History List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[220px] pr-1">
        {writeStack.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="text-xs text-dashboard-text-secondary italic">No cache writes registered.</span>
            <span className="text-[9px] text-slate-500 mt-1">Submit a key above to initiate.</span>
          </div>
        ) : (
          writeStack.map(action => (
            <div 
              key={action.id} 
              className="bg-slate-900/40 p-2.5 rounded-lg border border-white/5 flex justify-between items-center text-xs group hover:border-white/10 transition-colors duration-200"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-cyan-400 font-mono font-medium truncate">
                  {action.key} <span className="text-slate-600">→</span> <span className="text-slate-400 font-semibold">{action.serverId}</span>
                </span>
                <span className="text-[9px] text-dashboard-text-secondary mt-0.5">
                  {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </span>
              </div>
              <button
                onClick={() => undoWrite(action.id)}
                className="text-[10px] bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-white/5 text-dashboard-text-primary px-2.5 py-1 rounded-md flex items-center gap-1 transition-all duration-200"
              >
                <Undo className="w-3 h-3" /> Undo
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
