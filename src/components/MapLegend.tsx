import React from "react";

export const MapLegend: React.FC = () => {
  return (
    <div className="w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2 px-4 bg-white/90 dark:bg-[#151D2A]/90 backdrop-blur-sm rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs transition-colors duration-200">
      <div className="flex items-center space-x-2">
        <span className="w-3.5 h-3.5 rounded bg-blue-500 dark:bg-cyan-400 shadow-sm inline-block border border-blue-600 dark:border-cyan-500" />
        <span className="text-slate-700 dark:text-slate-200 font-medium">방문한 현 (Visited)</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3.5 h-3.5 rounded pattern-transit shadow-sm inline-block border border-emerald-500 dark:border-emerald-400" />
        <span className="text-slate-700 dark:text-slate-200 font-medium">경유한 현 (Transit)</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-700 inline-block border border-slate-300 dark:border-slate-600" />
        <span className="text-slate-500 dark:text-slate-400 font-medium">미방문 현 (Unvisited)</span>
      </div>
    </div>
  );
};


