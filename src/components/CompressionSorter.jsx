import { AlignLeft, ArrowDownUp } from 'lucide-react';

export default function CompressionSorter({ segments, sortOrder, sortCompression }) {
  return (
    <div className="bg-dashboard-card/65 backdrop-blur-md rounded-xl border border-dashboard-border shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-dashboard-border/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-500">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text-primary">Compression Registry</h4>
            <p className="text-[10px] text-dashboard-text-secondary">Memory savings ratio per sector</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-dashboard-text-secondary border-b border-dashboard-border/50 bg-[#020617]/20 sticky top-0 backdrop-blur-md">
              <th className="py-3 px-5 font-semibold uppercase tracking-wider">Segment</th>
              <th 
                className="py-3 px-5 font-semibold uppercase tracking-wider cursor-pointer hover:text-dashboard-text-primary transition-colors select-none"
                onClick={sortCompression}
              >
                <div className="flex items-center gap-1.5">
                  Ratio % <ArrowDownUp className="w-3.5 h-3.5" />
                  <span className="text-[9px] bg-slate-900 border border-white/5 text-cyan-400 px-1 rounded font-mono">
                    {sortOrder.toUpperCase()}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border/30">
            {segments.map(seg => (
              <tr 
                key={seg.id} 
                className="hover:bg-white/[0.01] transition-colors duration-200"
              >
                {/* Segment Name / ID */}
                <td className="py-3.5 px-5 font-medium text-dashboard-text-primary">
                  {seg.id} <span className="text-[10px] text-dashboard-text-secondary ml-1.5 font-normal">({seg.name})</span>
                </td>

                {/* Compression Progress Bar */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-[#020617] rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${seg.ratio}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-emerald-500">
                      {seg.ratio}%
                    </span>
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
