import React from "react";
import type { TravelRecordsMap } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";
import { Compass, CheckCircle2, Navigation } from "lucide-react";

interface RegionOverviewProps {
  records: TravelRecordsMap;
  selectedRegion: string | null;
  onSelectRegion: (regionName: string) => void;
}

interface RegionStat {
  name: string;
  total: number;
  visited: number;
  transit: number;
  percentage: number;
  prefectureCodes: number[];
}

const REGION_ORDER = [
  "홋카이도",
  "도호쿠",
  "간토",
  "주부",
  "간사이",
  "주고쿠",
  "시코쿠",
  "큐슈",
  "오키나와",
];

export const RegionOverview: React.FC<RegionOverviewProps> = ({
  records,
  selectedRegion,
  onSelectRegion,
}) => {
  const regionStats = React.useMemo(() => {
    const map = new Map<string, { total: number; visited: number; transit: number; codes: number[] }>();

    REGION_ORDER.forEach((r) => {
      map.set(r, { total: 0, visited: 0, transit: 0, codes: [] });
    });

    PREFECTURES.forEach((pref) => {
      const region = pref.region;
      const rec = records[pref.code];
      const entry = map.get(region) || { total: 0, visited: 0, transit: 0, codes: [] };

      entry.total += 1;
      entry.codes.push(pref.code);

      if (rec?.status === "visited") {
        entry.visited += 1;
      } else if (rec?.status === "transit") {
        entry.transit += 1;
      }

      map.set(region, entry);
    });

    const list: RegionStat[] = [];
    REGION_ORDER.forEach((r) => {
      const entry = map.get(r);
      if (entry && entry.total > 0) {
        const pct = Math.round((entry.visited / entry.total) * 100);
        list.push({
          name: r,
          total: entry.total,
          visited: entry.visited,
          transit: entry.transit,
          percentage: pct,
          prefectureCodes: entry.codes,
        });
      }
    });

    return list;
  }, [records]);

  return (
    <div className="bg-white dark:bg-[#0E1628] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-4 w-full transition-colors duration-200 mt-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">일본 9개 권역/지방별 달성 현황</h3>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">권역 클릭 시 전체 범위 강조</span>
      </div>

      {/* Region Cards Grid (3x3 grid for 9 regions) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
        {regionStats.map((stat) => {
          const isSelected = selectedRegion === stat.name;

          return (
            <div
              key={stat.name}
              onClick={() => onSelectRegion(stat.name)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 group ${
                isSelected
                  ? "bg-purple-50 dark:bg-purple-950/70 border-purple-500 dark:border-purple-400 ring-2 ring-purple-500/40 dark:ring-purple-400/60 shadow-md dark:shadow-[0_0_18px_rgba(168,85,247,0.45)] scale-[1.02]"
                  : "bg-slate-50/80 dark:bg-[#1A2332] border-slate-100 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50/40 dark:hover:bg-purple-950/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold transition-colors whitespace-nowrap ${
                  isSelected ? "text-purple-700 dark:text-purple-300" : "text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }`}>
                  {stat.name}
                </span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap ${
                  isSelected
                    ? "bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-900"
                    : "bg-blue-100/80 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300"
                }`}>
                  {stat.percentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <span className="flex items-center space-x-0.5 text-blue-600 dark:text-cyan-400 font-bold">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{stat.visited}현</span>
                  </span>
                  {stat.transit > 0 && (
                    <span className="flex items-center space-x-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Navigation className="w-3 h-3 shrink-0" />
                      <span>{stat.transit}</span>
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">총 {stat.total}개 현</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
