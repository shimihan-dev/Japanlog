import React from "react";

export const MapLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-5 py-2 px-3.5 bg-[#FBF9F5] dark:bg-[#0C1017] rounded-xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs text-xs font-sans">
      {/* Map Legend Label */}
      <span className="font-serif-jp text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pr-1 border-r border-slate-200 dark:border-slate-800">
        🗺️ MAP LEGEND
      </span>

      {/* Visited */}
      <div className="flex items-center space-x-1.5">
        <span className="w-3 h-3 rounded-full bg-[#E63946] dark:bg-[#FF5A65] shadow-2xs inline-block border border-red-300 dark:border-red-900" />
        <span className="text-slate-800 dark:text-slate-200 font-bold font-serif-jp text-[11px]">방문 완료 (Visited)</span>
      </div>

      {/* Transit */}
      <div className="flex items-center space-x-1.5">
        <span className="w-3 h-3 rounded-full bg-[#192F52] dark:bg-emerald-500 shadow-2xs inline-block border border-slate-700" />
        <span className="text-slate-700 dark:text-slate-300 font-medium font-serif-jp text-[11px]">경유 (Transit)</span>
      </div>

      {/* Unvisited */}
      <div className="flex items-center space-x-1.5">
        <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800 inline-block border border-slate-300 dark:border-slate-700" />
        <span className="text-slate-400 dark:text-slate-500 font-medium font-serif-jp text-[11px]">미방문 (Unvisited)</span>
      </div>

      {/* Shinkansen Rail */}
      <div className="flex items-center space-x-1.5">
        <span className="w-4 h-0.5 bg-[#E63946] border-t border-b border-white inline-block" />
        <span className="text-slate-600 dark:text-slate-400 font-medium text-[10px] font-serif-jp">신칸센 노선</span>
      </div>
    </div>
  );
};
