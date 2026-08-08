import React, { useMemo } from "react";
import type { TravelRecordsMap, CityVisit } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { Calendar, MapPin, Clock, ChevronRight, FileText } from "lucide-react";

interface TravelTimelineProps {
  records: TravelRecordsMap;
  selectedCode: number | null;
  onSelectPrefecture: (code: number) => void;
}

interface TimelineItem {
  code: number;
  nameKo: string;
  nameJa: string;
  region: string;
  status: "visited" | "transit";
  displayDate: string;
  timestamp: number;
  cities: { cityNameKo: string; visitedAt?: string; notes?: string }[];
  notes?: string;
  visitCount?: number;
}

export const TravelTimeline: React.FC<TravelTimelineProps> = ({
  records,
  selectedCode,
  onSelectPrefecture,
}) => {
  // Extract visited and transit records into a chronological timeline (grouped by prefecture + visit date)
  const timelineItems = useMemo(() => {
    const list: TimelineItem[] = [];

    Object.values(records).forEach((rec) => {
      if (rec.status === "unvisited") return;

      const pref = PREFECTURE_MAP_BY_CODE.get(rec.prefectureCode);
      if (!pref) return;

      if (!rec.cities || rec.cities.length === 0) {
        // If transit or no cities recorded, create single entry
        const dateStr = rec.lastVisitedAt || rec.firstVisitedAt || "날짜 미지정";
        let timeVal = new Date(rec.updatedAt || 0).getTime();
        if (dateStr !== "날짜 미지정") {
          const parsed = new Date(dateStr.replace(/\./g, "-")).getTime();
          if (!isNaN(parsed) && parsed > 0) timeVal = parsed;
        }

        list.push({
          code: rec.prefectureCode,
          nameKo: pref.nameKo,
          nameJa: pref.nameJa,
          region: pref.region,
          status: rec.status,
          displayDate: dateStr,
          timestamp: timeVal,
          cities: [],
          notes: rec.notes,
          visitCount: rec.visitCount,
        });
      } else {
        // Group cities by their visitedAt date
        const dateGroups = new Map<string, CityVisit[]>();
        rec.cities.forEach((city: CityVisit) => {
          const d = (city.visitedAt && city.visitedAt.trim()) || "날짜 미지정";
          if (!dateGroups.has(d)) {
            dateGroups.set(d, []);
          }
          dateGroups.get(d)!.push(city);
        });

        dateGroups.forEach((groupCities, dateStr) => {
          let timeVal = new Date(rec.updatedAt || 0).getTime();
          if (dateStr !== "날짜 미지정") {
            const parsed = new Date(dateStr.replace(/\./g, "-")).getTime();
            if (!isNaN(parsed) && parsed > 0) timeVal = parsed;
          }

          list.push({
            code: rec.prefectureCode,
            nameKo: pref.nameKo,
            nameJa: pref.nameJa,
            region: pref.region,
            status: rec.status,
            displayDate: dateStr,
            timestamp: timeVal,
            cities: groupCities,
            notes: rec.notes,
            visitCount: rec.visitCount,
          });
        });
      }
    });

    // Sort by timestamp descending
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [records]);

  return (
    <div className="bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 mt-4 transition-colors duration-200">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">여행 타임라인 / 히스토리</h3>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          총 {timelineItems.length}곳
        </span>
      </div>

      {timelineItems.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs space-y-1">
          <Calendar className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
          <p>아직 기록된 여행 히스토리가 없습니다.</p>
          <p className="text-[11px]">상단 스마트 검색이나 지도에서 방문 장소를 등록해보세요!</p>
        </div>
      ) : (
        <div className="relative pl-3 space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700/80" />

          {timelineItems.map((item) => {
            const isSelected = selectedCode === item.code;

            return (
              <div
                key={`timeline-${item.code}`}
                onClick={() => onSelectPrefecture(item.code)}
                className={`relative pl-5 cursor-pointer group transition-all`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                    isSelected
                      ? "bg-blue-600 dark:bg-cyan-400 border-white dark:border-slate-900 scale-125 ring-2 ring-blue-500/30 shadow-sm"
                      : item.status === "visited"
                      ? "bg-blue-500 dark:bg-cyan-500 border-white dark:border-slate-900 group-hover:scale-110"
                      : "bg-emerald-500 border-white dark:border-slate-900 group-hover:scale-110"
                  }`}
                />

                {/* Card Container */}
                <div
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-blue-50/80 dark:bg-cyan-950/40 border-blue-300 dark:border-cyan-500/50 ring-1 ring-blue-500/20 shadow-xs"
                      : "bg-slate-50/70 dark:bg-[#1A2332] border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800/80"
                  }`}
                >
                  {/* Header: Date & Status */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <span>{item.displayDate}</span>
                    </span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                        item.status === "visited"
                          ? "bg-blue-100 dark:bg-cyan-950 text-blue-800 dark:text-cyan-300"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                      }`}
                    >
                      {item.status === "visited" ? "방문" : "경유"}
                    </span>
                  </div>

                  {/* Body: Prefecture Name & Region */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                        <span>{item.nameKo}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                          ({item.nameJa})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.region} 지방
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected
                          ? "text-blue-600 dark:text-cyan-400 translate-x-0.5"
                          : "text-slate-300 dark:text-slate-600 group-hover:text-slate-400"
                      }`}
                    />
                  </div>

                  {/* Cities Chips */}
                  {item.cities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.cities.map((city, idx) => (
                        <span
                          key={`${item.code}-city-${idx}`}
                          className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
                        >
                          <MapPin className="w-2.5 h-2.5 text-blue-500 dark:text-cyan-400" />
                          <span>{city.cityNameKo}</span>
                          {city.visitedAt && (
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">
                              ({city.visitedAt})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 italic truncate">
                      <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item.notes}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
