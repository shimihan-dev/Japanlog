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
      <div className="text-center py-4 px-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
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
            className="bg-white dark:bg-[#1A2332] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs transition-all overflow-hidden"
          >
            {/* Header Item Row */}
            <div className="p-2.5 flex items-center justify-between group">
              <div className="space-y-1 flex-1 pr-2">
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {city.cityNameKo}
                  </span>
                  {city.cityNameJa && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                      ({city.cityNameJa})
                    </span>
                  )}

                  {/* Multi-Visit Badge Count */}
                  {summary.visitCount > 1 ? (
                    <span className="px-1.5 py-0.2 rounded-md bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-300 text-[10px] font-extrabold border border-red-200/60 dark:border-red-800/60 flex items-center space-x-0.5">
                      <span>🔥</span>
                      <span>{summary.visitCount}회 방문</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 text-[10px] font-semibold border border-blue-200/40 dark:border-cyan-800/40">
                      1회 방문
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  {summary.lastVisitedAt && (
                    <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <span>최근: {summary.lastVisitedAt}</span>
                    </span>
                  )}
                  {city.notes && (
                    <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                      <FileText className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                      <span className="truncate max-w-[130px]">{city.notes}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons & History Expand Toggle */}
              <div className="flex items-center space-x-1 shrink-0">
                {hasHistory && (
                  <button
                    onClick={() => setExpandedCityId(isExpanded ? null : city.id)}
                    className="px-2 py-1 text-[10px] font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-slate-800 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 flex items-center space-x-1 transition-colors"
                    title="방문 히스토리 보기"
                  >
                    <span>히스토리</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}

                <button
                  onClick={() => onEdit(city)}
                  className="p-1 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 rounded-md hover:bg-blue-50 dark:hover:bg-cyan-950/50"
                  title="도시 수정"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(city.id)}
                  className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50"
                  title="도시 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expandable Multi-Visit History Log Timeline Card */}
            {isExpanded && hasHistory && (
              <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
                    <span>{city.cityNameKo} 방문 이력 타임라인 ({summary.history.length}건)</span>
                  </span>
                </div>

                <div className="space-y-1.5 pl-1 border-l-2 border-blue-200 dark:border-cyan-800 ml-1">
                  {summary.history.map((h, idx) => (
                    <div
                      key={h.id}
                      className="pl-2.5 py-1 relative text-[11px] space-y-0.5"
                    >
                      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 ring-2 ring-white dark:ring-slate-900" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                          <span>{h.emoji || "✈️"}</span>
                          <span>{idx + 1}차: {h.title}</span>
                        </span>
                        {h.dateRange && (
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-cyan-300 bg-blue-50/80 dark:bg-cyan-950/60 px-1.5 py-0.2 rounded border border-blue-100 dark:border-cyan-900/60">
                            {h.dateRange}
                          </span>
                        )}
                      </div>
                      {h.notes && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 pl-4">
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
