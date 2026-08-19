import React, { useMemo } from "react";
import type { TravelRecordsMap, Trip } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { Calendar, MapPin, Clock, ChevronRight, Luggage, Sparkles } from "lucide-react";

interface TravelTimelineProps {
  records?: TravelRecordsMap;
  trips?: Trip[];
  selectedTripId?: string | null;
  selectedCode?: number | null;
  onSelectPrefecture?: (code: number) => void;
  onSelectTrip?: (tripId: string | null) => void;
}

interface TripTimelineEntry {
  id: string;
  trip: Trip;
  title: string;
  emoji: string;
  displayDate: string;
  timestamp: number;
}

export const TravelTimeline: React.FC<TravelTimelineProps> = ({
  trips = [],
  selectedTripId = null,
  onSelectTrip,
}) => {
  // Extract ONLY explicitly created user Trips into chronological timeline
  const timelineItems = useMemo(() => {
    const list: TripTimelineEntry[] = [];

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

      list.push({
        id: trip.id,
        trip,
        title: trip.title,
        emoji: trip.emoji || "🧳",
        displayDate: dateStr,
        timestamp: timeVal,
      });
    });

    // Sort by timestamp descending (most recent trip first)
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [trips]);

  return (
    <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs p-4 flex flex-col h-full transition-colors duration-250 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-[#E63946]" />
          <h3 className="text-xs font-bold font-serif-jp text-slate-900 dark:text-slate-100">여행 회차 타임라인</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-2 py-0.5 rounded-md font-sans-outfit">
          총 {timelineItems.length}회차
        </span>
      </div>

      {timelineItems.length === 0 ? (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs space-y-2 font-serif-jp">
          <Luggage className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-1 stroke-[1.5]" />
          <p className="font-bold text-slate-700 dark:text-slate-300">작성된 여행 회차가 없습니다.</p>
          <p className="text-[11px] font-sans text-slate-400">
            '여행 회차' 탭에서 [+ 신규 여행 등록]을 완료하면 이곳에 연도별 타임라인으로 기록됩니다.
          </p>
        </div>
      ) : (
        <div className="relative pl-3 space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
          {/* Vertical Timeline Red Line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#E63946]/30 dark:bg-[#E63946]/20" />

          {timelineItems.map((item) => {
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
                  className={`p-3.5 rounded-xl border text-left transition-all space-y-2 ${
                    isTripSelected
                      ? "bg-red-50/90 dark:bg-red-950/50 border-[#E63946] dark:border-[#FF5A65] shadow-2xs ring-1 ring-[#E63946]/30"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-[#E63946]"
                  }`}
                >
                  {/* Date Badge & Trip Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#E63946] dark:text-[#FF5A65] flex items-center space-x-1 font-sans-outfit">
                      <Calendar className="w-3 h-3 text-[#E63946]" />
                      <span>{item.displayDate}</span>
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950 text-[#E63946] dark:text-[#FF5A65] font-serif-jp border border-red-200/60 dark:border-red-900/60 flex items-center space-x-1">
                      <Luggage className="w-2.5 h-2.5" />
                      <span>여행 회차</span>
                    </span>
                  </div>

                  {/* Trip Title */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-lg shrink-0">{item.emoji}</span>
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
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.trip.prefectures.map((code) => {
                        const pref = PREFECTURE_MAP_BY_CODE.get(code);
                        if (!pref) return null;
                        return (
                          <span
                            key={code}
                            className="px-2 py-0.5 bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] rounded-md text-[10px] font-bold font-serif-jp border border-red-200/60 dark:border-red-900/60"
                          >
                            {pref.nameKo}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Cities in Trip */}
                  {item.trip.cities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.trip.cities.map((c, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 bg-[#FBF9F5] dark:bg-slate-800 rounded-md text-[10px] font-medium text-slate-700 dark:text-slate-300 font-serif-jp border border-[#E8E3D8] dark:border-slate-700"
                        >
                          <MapPin className="w-2.5 h-2.5 text-[#E63946]" />
                          <span>{c.cityNameKo}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Highlights */}
                  {item.trip.highlights && item.trip.highlights.length > 0 && (
                    <div className="space-y-0.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                      {item.trip.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center space-x-1 text-[10px] text-slate-600 dark:text-slate-400 font-serif-jp">
                          <Sparkles className="w-2.5 h-2.5 text-[#E63946] shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {item.trip.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 font-sans pt-0.5">
                      "{item.trip.description}"
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
