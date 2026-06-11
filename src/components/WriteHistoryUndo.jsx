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
    <div className="bg-dashboard-card p-4 rounded-xl border border-dashboard-border flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-dashboard-accent" />
        b. Write History
      </h2>
      
      <form onSubmit={handleWrite} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter key to cache..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-dashboard-accent"
        />
        <button 
          type="submit"
          className="bg-dashboard-accent text-slate-900 px-3 py-1.5 rounded hover:bg-cyan-400 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <Send className="w-4 h-4" /> Write
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-48 pr-2">
        {writeStack.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No write history.</p>
        ) : (
          writeStack.map(action => (
            <div key={action.id} className="bg-slate-800/50 p-2 rounded border border-slate-700/50 flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="text-cyan-400 font-mono text-xs">{action.key} <span className="text-slate-500">→</span> {action.serverId}</span>
                <span className="text-[10px] text-slate-500">{new Date(action.timestamp).toLocaleTimeString()}</span>
              </div>
              <button 
                onClick={() => undoWrite(action.id)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded flex items-center gap-1 transition-colors"
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
