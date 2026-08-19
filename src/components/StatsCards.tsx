import React from "react";
import type { TravelStats } from "../utils/statistics";

interface StatsCardsProps {
  stats: TravelStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const percentage = ((stats.visitedCount / 47) * 100).toFixed(1);

  return (
    <div className="mb-6 bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 p-4 shadow-2xs transition-all">
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-slate-800 gap-y-3 sm:gap-y-0">
        {/* Metric 1: 방문한 현 */}
        <div className="px-3 py-1 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">
            방문한 현
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-serif-jp text-slate-900 dark:text-slate-100">
              {stats.visitedCount}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-sans-outfit">/ 47 현</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">직접 탐색 및 체류 지역</p>
        </div>

        {/* Metric 2: 경유한 현 */}
        <div className="px-3 py-1 space-y-1 sm:pl-4">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">
            경유한 현
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-serif-jp text-emerald-700 dark:text-emerald-400">
              {stats.transitCount}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-sans-outfit">/ 47 현</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">이동 중 경유 및 통과</p>
        </div>

        {/* Metric 3: 방문 도시 수 */}
        <div className="px-3 py-1 space-y-1 sm:pl-4">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-sans">
            기록된 방문 도시
          </span>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold font-sans-outfit text-slate-900 dark:text-slate-100">
              {stats.totalCitiesCount}
            </span>
            <span className="text-xs font-semibold text-slate-400 font-serif-jp">개 도시</span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">중복 없는 시/구/정/촌</p>
        </div>

        {/* Metric 4: 방문 달성률 */}
        <div className="px-3 py-1 space-y-1 sm:pl-4">
          <span className="text-[11px] font-bold text-[#E63946] dark:text-[#FF5A65] uppercase tracking-wider block font-sans">
            일본 열도 달성률
          </span>
          <div className="flex items-baseline space-x-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold font-sans-outfit text-[#E63946] dark:text-[#FF5A65]">
              {stats.achievementRate}
            </span>
            <span className="text-sm font-bold text-[#E63946] dark:text-[#FF5A65] font-sans-outfit">%</span>
          </div>
          {/* Subtle Progress Bar */}
          <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-[#E63946] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
