import { AlignLeft, ArrowDownUp } from 'lucide-react';

export default function CompressionSorter({ segments, sortOrder, sortCompression }) {
  return (
    <div className="bg-dashboard-card p-4 rounded-xl border border-dashboard-border flex flex-col h-auto">
      <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <AlignLeft className="w-5 h-5 text-dashboard-accent" />
        e. Compression Sorter
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-dashboard-border">
              <th className="pb-2 font-medium">Segment</th>
              <th className="pb-2 font-medium cursor-pointer hover:text-slate-200" onClick={sortCompression}>
                <div className="flex items-center gap-1 select-none">
                  Ratio % <ArrowDownUp className="w-3 h-3" />
                  <span className="text-[10px] bg-slate-800 px-1 rounded">{sortOrder.toUpperCase()}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {segments.map(seg => (
              <tr key={seg.id} className="border-b border-dashboard-border/50">
                <td className="py-3 text-slate-300">{seg.id}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-4 bg-slate-800 rounded overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${seg.ratio}%` }}
                      />
                    </div>
                    <span className="text-xs text-green-400 font-mono">{seg.ratio}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
