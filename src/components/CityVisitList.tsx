import React, { useState } from "react";
import type { CityVisit, PrefectureRecord, Trip } from "../types/travel";
import { Edit2, Trash2, Calendar, FileText, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { getCityVisitHistory } from "../utils/visitHistory";

interface CityVisitListProps {
  cities: CityVisit[];
  prefectureCode?: number;
  record?: PrefectureRecord;
  trips?: Trip[];
  onEdit: (city: CityVisit) => void;
  onDelete: (cityId: string) => void;
}

export const CityVisitList: React.FC<CityVisitListProps> = ({
  cities,
  prefectureCode = 0,
  record,
  trips = [],
  onEdit,
  onDelete,
}) => {
  const [expandedCityId, setExpandedCityId] = useState<string | null>(null);

  if (cities.length === 0) {
    return (
      <div className="text-center py-4 px-2 bg-white dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-serif-jp">
        등록된 방문 도시가 없습니다. 아래 버튼으로 도시를 추가해보세요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cities.map((city) => {
        const summary = getCityVisitHistory(prefectureCode, city.cityNameKo, record, trips);
        const isExpanded = expandedCityId === city.id;
        const hasHistory = summary.history.length > 0;

        return (
          <div
            key={city.id}
            className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all overflow-hidden"
          >
            {/* Header Item Row */}
            <div className="p-2.5 flex items-center justify-between group">
              <div className="space-y-1 flex-1 pr-2">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-xs font-bold font-serif-jp text-slate-900 dark:text-slate-100">
                    {city.cityNameKo}
                  </span>
                  {city.cityNameJa && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-serif-jp font-normal">
                      ({city.cityNameJa})
                    </span>
                  )}

                  {/* Multi-Visit Badge Count */}
                  {summary.visitCount > 1 ? (
                    <span className="px-1.5 py-0.2 rounded-md bg-red-50 dark:bg-red-950/80 text-[#E63946] dark:text-[#FF5A65] text-[10px] font-extrabold border border-red-200/60 dark:border-red-900/60 flex items-center space-x-0.5 font-sans">
                      <span>🔥</span>
                      <span>{summary.visitCount}회 방문</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold font-sans">
                      1회 방문
                    </span>
                  )}
                </div>

                {/* Sub Metadata (Latest Visited Date & Notes Preview) */}
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  {summary.lastVisitedAt ? (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#E63946] dark:text-[#FF5A65]" />
                      <span>{summary.lastVisitedAt}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">날짜 미지정</span>
                  )}

                  {city.notes && (
                    <span className="flex items-center space-x-1 truncate max-w-[150px]">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{city.notes}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons & History Accordion Toggle */}
              <div className="flex items-center space-x-1 shrink-0">
                {hasHistory && (
                  <button
                    type="button"
                    onClick={() => setExpandedCityId(isExpanded ? null : city.id)}
                    className="flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/80 text-[#E63946] dark:text-[#FF5A65] border border-red-200/60 dark:border-red-900/60 transition-colors cursor-pointer font-sans"
                    title="방문 히스토리 보기"
                  >
                    <Clock className="w-3 h-3" />
                    <span>히스토리</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onEdit(city)}
                  className="p-1.5 text-slate-400 hover:text-[#E63946] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="수정"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(city.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expandable History Log Accordion */}
            {isExpanded && hasHistory && (
              <div className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/60 dark:border-slate-800 p-2.5 space-y-2 text-xs animate-in slide-in-from-top duration-150 font-sans">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1 font-serif-jp">
                  <Clock className="w-3 h-3 text-[#E63946]" />
                  <span>{city.cityNameKo} 다회 방문 여정 히스토리 (오름차순 1차, 2차...)</span>
                </div>

                <div className="space-y-1.5 relative pl-2.5 border-l-2 border-red-300 dark:border-red-800 ml-1">
                  {summary.history.map((h, idx) => (
                    <div key={`${h.tripId}-${idx}`} className="space-y-0.5 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="px-1.5 py-0.2 rounded bg-[#E63946] text-white text-[9px] font-bold">
                            {h.visitRound}차 방문
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 font-serif-jp">
                            {h.emoji || "✈️"} {h.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {h.dateRange}
                        </span>
                      </div>

                      {h.notes && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-1 font-sans">
                          {h.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
