import React, { useMemo } from "react";
import type { TravelRecordsMap, Trip, CityVisit } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { Calendar, MapPin, Clock, ChevronRight, FileText, Luggage } from "lucide-react";

interface TravelTimelineProps {
  records: TravelRecordsMap;
  trips?: Trip[];
  selectedTripId?: string | null;
  selectedCode: number | null;
  onSelectPrefecture: (code: number) => void;
  onSelectTrip?: (tripId: string | null) => void;
}

type TimelineEntry =
  | {
      id: string;
      type: "trip";
      trip: Trip;
      title: string;
      emoji: string;
      displayDate: string;
      timestamp: number;
    }
  | {
      id: string;
      type: "prefecture";
      code: number;
      nameKo: string;
      nameJa: string;
      region: string;
      status: "visited" | "transit";
      displayDate: string;
      timestamp: number;
      cities: { cityNameKo: string; visitedAt?: string; notes?: string }[];
      notes?: string;
    };

export const TravelTimeline: React.FC<TravelTimelineProps> = ({
  records,
  trips = [],
  selectedTripId = null,
  selectedCode,
  onSelectPrefecture,
  onSelectTrip,
}) => {
  // Extract both explicit user Trips AND prefecture visit records into a unified chronological timeline
  const timelineItems = useMemo(() => {
    const list: TimelineEntry[] = [];
    const processedPrefecturesInTrips = new Set<number>();

    // 1. Add User Explicit Trips
    trips.forEach((trip) => {
      let dateStr = "날짜 미지정";
      if (trip.startDate && trip.endDate) {
        dateStr = `${trip.startDate} ~ ${trip.endDate}`;
      } else if (trip.startDate) {
        dateStr = trip.startDate;
      } else if (trip.endDate) {
        dateStr = trip.endDate;
      }

      let timeVal = 0;
      const dateToParse = trip.startDate || trip.endDate;
      if (dateToParse) {
        const parsed = new Date(dateToParse.replace(/\./g, "-")).getTime();
        if (!isNaN(parsed) && parsed > 0) timeVal = parsed;
      }
      if (!timeVal) {
        timeVal = new Date(trip.createdAt || 0).getTime();
      }

      // Track prefectures in this trip
      trip.prefectures.forEach((pCode) => processedPrefecturesInTrips.add(pCode));

      list.push({
        id: trip.id,
        type: "trip",
        trip,
        title: trip.title,
        emoji: trip.emoji || "🧳",
        displayDate: dateStr,
        timestamp: timeVal,
      });
    });

    // 2. Add Prefecture Visit Records (for direct city additions or prefectures not in a trip)
    Object.values(records).forEach((rec) => {
      if (rec.status === "unvisited") return;

      const pref = PREFECTURE_MAP_BY_CODE.get(rec.prefectureCode);
      if (!pref) return;

      if (!rec.cities || rec.cities.length === 0) {
        const dateStr = rec.lastVisitedAt || rec.firstVisitedAt || "날짜 미지정";
        let timeVal = new Date(rec.updatedAt || 0).getTime();
        if (dateStr !== "날짜 미지정") {
          const parsed = new Date(dateStr.replace(/\./g, "-")).getTime();
          if (!isNaN(parsed) && parsed > 0) timeVal = parsed;
        }

        list.push({
          id: `pref-${rec.prefectureCode}-${dateStr}`,
          type: "prefecture",
          code: rec.prefectureCode,
          nameKo: pref.nameKo,
          nameJa: pref.nameJa,
          region: pref.region,
          status: rec.status,
          displayDate: dateStr,
          timestamp: timeVal,
          cities: [],
          notes: rec.notes,
        });
      } else {
        // Group cities by visitedAt date
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
            id: `pref-${rec.prefectureCode}-${dateStr}`,
            type: "prefecture",
            code: rec.prefectureCode,
            nameKo: pref.nameKo,
            nameJa: pref.nameJa,
            region: pref.region,
            status: rec.status,
            displayDate: dateStr,
            timestamp: timeVal,
            cities: groupCities,
            notes: rec.notes,
          });
        });
      }
    });

    // Sort by timestamp descending (most recent first)
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [records, trips]);

  return (
    <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs p-4 flex flex-col h-full transition-colors duration-250 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#E63946]" />
          <h3 className="text-xs font-bold font-serif-jp text-slate-900 dark:text-slate-100">통합 여정 타임라인</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-2 py-0.5 rounded-md font-sans-outfit">
          총 {timelineItems.length}개 스토리
        </span>
      </div>

      {timelineItems.length === 0 ? (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs space-y-1 font-serif-jp">
          <Calendar className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
          <p>아직 기록된 여정 타임라인이 없습니다.</p>
          <p className="text-[11px] font-sans">여행 회차 등록이나 지도 탐색을 통해 첫 여행을 등록해보세요!</p>
        </div>
      ) : (
        <div className="relative pl-3 space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
          {/* Vertical Timeline Red Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#E63946]/30 dark:bg-[#E63946]/20" />

          {timelineItems.map((item) => {
            if (item.type === "trip") {
              const isTripSelected = selectedTripId === item.trip.id;

              return (
                <div
                  key={`timeline-trip-${item.id}`}
                  onClick={() => onSelectTrip && onSelectTrip(isTripSelected ? null : item.trip.id)}
                  className="relative pl-5 cursor-pointer group transition-all"
                >
                  {/* Timeline Red Stamp Node */}
                  <div
                    className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-transform flex items-center justify-center ${
                      isTripSelected
                        ? "bg-[#E63946] border-white dark:border-slate-900 scale-125 shadow-2xs"
                        : "bg-[#E63946] border-white dark:border-slate-900 group-hover:scale-110"
                    }`}
                  >
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>

                  {/* Trip Card Container */}
                  <div
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isTripSelected
                        ? "bg-red-50/90 dark:bg-red-950/50 border-[#E63946] dark:border-[#FF5A65] shadow-2xs ring-1 ring-[#E63946]/30"
                        : "bg-white dark:bg-slate-900 border-red-200/80 dark:border-red-900/40 hover:border-[#E63946]"
                    }`}
                  >
                    {/* Date Badge & Trip Tag */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#E63946] dark:text-[#FF5A65] flex items-center space-x-1 font-sans-outfit">
                        <Calendar className="w-3 h-3 text-[#E63946]" />
                        <span>{item.displayDate}</span>
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-red-100/80 dark:bg-red-950 text-[#E63946] dark:text-[#FF5A65] font-serif-jp border border-red-200/60 dark:border-red-900/60 flex items-center space-x-1">
                        <Luggage className="w-2.5 h-2.5" />
                        <span>여행 회차</span>
                      </span>
                    </div>

                    {/* Trip Title */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 min-w-0">
                        <span className="text-base shrink-0">{item.emoji}</span>
                        <h4 className="font-extrabold text-xs font-serif-jp text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </h4>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isTripSelected ? "text-[#E63946] translate-x-0.5" : "text-slate-300 dark:text-slate-600 group-hover:text-slate-400"
                        }`}
                      />
                    </div>

                    {/* Prefectures in Trip */}
                    {item.trip.prefectures.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {item.trip.prefectures.map((code) => {
                          const pref = PREFECTURE_MAP_BY_CODE.get(code);
                          if (!pref) return null;
                          return (
                            <span
                              key={code}
                              className="px-1.5 py-0.2 bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] rounded text-[9px] font-bold font-serif-jp border border-red-200/60 dark:border-red-900/60"
                            >
                              {pref.nameKo}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Cities in Trip */}
                    {item.trip.cities.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.trip.cities.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 bg-[#FBF9F5] dark:bg-slate-800 rounded text-[9px] font-medium text-slate-700 dark:text-slate-300 font-serif-jp border border-slate-200/60 dark:border-slate-700/60"
                          >
                            <MapPin className="w-2.5 h-2.5 text-[#E63946]" />
                            <span>{c.cityNameKo}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {item.trip.description && (
                      <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1 font-sans">
                        "{item.trip.description}"
                      </p>
                    )}
                  </div>
                </div>
              );
            }

            // Prefecture Single Item
            const isPrefSelected = selectedCode === item.code;

            return (
              <div
                key={`timeline-pref-${item.id}`}
                onClick={() => onSelectPrefecture(item.code)}
                className="relative pl-5 cursor-pointer group transition-all"
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                    isPrefSelected
                      ? "bg-[#192F52] border-white dark:border-slate-900 scale-125 shadow-2xs"
                      : item.status === "visited"
                        ? "bg-[#E63946] border-white dark:border-slate-900 group-hover:scale-110"
                        : "bg-[#192F52] border-white dark:border-slate-900 group-hover:scale-110"
                  }`}
                />

                {/* Card Container */}
                <div
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isPrefSelected
                      ? "bg-red-50/80 dark:bg-red-950/40 border-[#E63946] dark:border-[#FF5A65] shadow-2xs"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Header: Date & Status */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1 font-sans-outfit">
                      <Calendar className="w-3 h-3 text-[#E63946]" />
                      <span>{item.displayDate}</span>
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md font-serif-jp ${
                        item.status === "visited"
                          ? "bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] border border-red-200/60 dark:border-red-900/60"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {item.status === "visited" ? "방문" : "경유"}
                    </span>
                  </div>

                  {/* Body: Prefecture Name & Region */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center space-x-1.5 font-serif-jp">
                        <span>{item.nameKo}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({item.nameJa})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-serif-jp">
                        {item.region} 지방
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isPrefSelected
                          ? "text-[#E63946] dark:text-[#FF5A65] translate-x-0.5"
                          : "text-slate-300 dark:text-slate-600 group-hover:text-slate-400"
                      }`}
                    />
                  </div>

                  {/* Cities Chips */}
                  {item.cities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.cities.map((city, cIdx) => (
                        <span
                          key={`${item.code}-city-${cIdx}`}
                          className="inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 bg-[#FBF9F5] dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md border border-[#E8E3D8] dark:border-slate-700 font-serif-jp"
                        >
                          <MapPin className="w-2.5 h-2.5 text-[#E63946]" />
                          <span>{city.cityNameKo}</span>
                          {city.visitedAt && (
                            <span className="text-[9px] text-slate-400 font-normal font-sans-outfit">
                              ({city.visitedAt})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 italic truncate font-sans">
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
