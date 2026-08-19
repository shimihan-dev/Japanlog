import React from "react";
import type { TravelRecordsMap } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";
import { Compass, CheckCircle2 } from "lucide-react";

interface RegionOverviewProps {
  records: TravelRecordsMap;
  selectedRegion: string | null;
  onSelectRegion: (regionName: string) => void;
}

interface RegionStat {
  name: string;
  kanji: string;
  total: number;
  visited: number;
  transit: number;
  percentage: number;
  prefectureCodes: number[];
}

const REGION_DATA: { name: string; kanji: string }[] = [
  { name: "홋카이도", kanji: "北海道" },
  { name: "도호쿠", kanji: "東北" },
  { name: "간토", kanji: "関東" },
  { name: "주부", kanji: "中部" },
  { name: "간사이", kanji: "関西" },
  { name: "주고쿠", kanji: "中国" },
  { name: "시코쿠", kanji: "四国" },
  { name: "큐슈", kanji: "九州" },
  { name: "오키나와", kanji: "沖縄" },
];

export const RegionOverview: React.FC<RegionOverviewProps> = ({
  records,
  selectedRegion,
  onSelectRegion,
}) => {
  const regionStats = React.useMemo(() => {
    const map = new Map<string, { total: number; visited: number; transit: number; codes: number[] }>();

    REGION_DATA.forEach((r) => {
      map.set(r.name, { total: 0, visited: 0, transit: 0, codes: [] });
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
    REGION_DATA.forEach((r) => {
      const entry = map.get(r.name);
      if (entry && entry.total > 0) {
        const pct = Math.round((entry.visited / entry.total) * 100);
        list.push({
          name: r.name,
          kanji: r.kanji,
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
    <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs p-4 w-full transition-colors duration-250 mt-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-[#E63946] dark:text-[#FF5A65]" />
          <h3 className="text-xs font-bold font-serif-jp text-slate-900 dark:text-slate-100">일본 9개 권역/지방별 탐색 현황</h3>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">권역 클릭 시 전체 강조</span>
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
                  ? "bg-red-50/70 dark:bg-red-950/40 border-[#E63946] dark:border-[#FF5A65] shadow-2xs"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-1">
                  <span className="text-xs font-bold font-serif-jp text-slate-900 dark:text-slate-100 group-hover:text-[#E63946] transition-colors">
                    {stat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-serif-jp">
                    {stat.kanji}
                  </span>
                </div>
                <span className={`text-xs font-extrabold font-sans-outfit ${
                  isSelected ? "text-[#E63946] dark:text-[#FF5A65]" : "text-slate-700 dark:text-slate-300"
                }`}>
                  {stat.percentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-[#E63946] shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{stat.visited}현</span>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">총 {stat.total}현</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#E63946] dark:bg-[#FF5A65] h-full rounded-full transition-all duration-300"
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
