import React from "react";

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm text-xs space-y-2">
      <div className="font-semibold text-slate-700 pb-1 border-b border-slate-100 flex items-center justify-between">
        <span>범례</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded bg-blue-500 shadow-sm inline-block border border-blue-600" />
          <span className="text-slate-700 font-medium">방문한 현 (Visited)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded pattern-transit shadow-sm inline-block border border-emerald-500" />
          <span className="text-slate-700 font-medium">경유한 현 (Transit)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 rounded bg-slate-200 inline-block border border-slate-300" />
          <span className="text-slate-500 font-medium">미방문 현 (Unvisited)</span>
        </div>
      </div>
    </div>
  );
};
