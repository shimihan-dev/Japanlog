import React from "react";
import type { TravelStats } from "../utils/statistics";
import { MapPin, Navigation, Building2, Crown } from "lucide-react";

interface StatsCardsProps {
  stats: TravelStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. 방문한 현 */}
      <div className="bg-white dark:bg-[#151D2A] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-cyan-950/60 text-blue-600 dark:text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">방문한 현</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.visitedCount}</span>
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">/ 47</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between items-center">
          <span>직접 도달하여 활동한 지역</span>
          <span className="font-semibold text-blue-600 dark:text-cyan-400">{((stats.visitedCount / 47) * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* 2. 경유한 현 */}
      <div className="bg-white dark:bg-[#151D2A] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">경유한 현</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.transitCount}</span>
              <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">/ 47</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 flex justify-between items-center">
          <span>이동 과정 중 통과한 지역</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{((stats.transitCount / 47) * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* 3. 방문 도시 수 */}
      <div className="bg-white dark:bg-[#151D2A] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">방문 도시 수</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalCitiesCount}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">개</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          기록된 중복 없는 시/구/정
        </div>
      </div>

      {/* 4. 방문 달성률 */}
      <div className="bg-white dark:bg-[#151D2A] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">방문 달성률</span>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.achievementRate}</span>
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">%</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          (방문한 현 기준, 경유 제외)
        </div>
      </div>
    </div>
  );
};

