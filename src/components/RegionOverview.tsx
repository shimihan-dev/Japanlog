import React from "react";
import type { TravelRecordsMap } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";
import { Compass, CheckCircle2, Navigation } from "lucide-react";

interface RegionOverviewProps {
  records: TravelRecordsMap;
  onSelectPrefecture?: (code: number) => void;
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
  onSelectPrefecture,
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
    <div className="bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 w-full transition-colors duration-200 mt-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">일본 9개 권역/지방별 달성 현황</h3>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">지역별 클릭 시 이동</span>
      </div>

      {/* Region Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {regionStats.map((stat) => (
          <div
            key={stat.name}
            onClick={() => onSelectPrefecture && onSelectPrefecture(stat.prefectureCodes[0])}
            className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#1A2332] border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 hover:bg-blue-50/40 dark:hover:bg-cyan-950/30 cursor-pointer transition-all flex flex-col justify-between space-y-1.5 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {stat.name}
                </span>
                <span className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400">
                  {stat.percentage}%
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center space-x-0.5 text-blue-600 dark:text-cyan-400 font-semibold">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>{stat.visited}</span>
                </span>
                {stat.transit > 0 && (
                  <span className="flex items-center space-x-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Navigation className="w-2.5 h-2.5" />
                    <span>{stat.transit}</span>
                  </span>
                )}
                <span>/ {stat.total}현</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
