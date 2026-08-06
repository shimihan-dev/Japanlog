import React from "react";
import type { CityVisit } from "../types/travel";
import { Edit2, Trash2, Calendar, FileText } from "lucide-react";

interface CityVisitListProps {
  cities: CityVisit[];
  onEdit: (city: CityVisit) => void;
  onDelete: (cityId: string) => void;
}

export const CityVisitList: React.FC<CityVisitListProps> = ({
  cities,
  onEdit,
  onDelete,
}) => {
  if (cities.length === 0) {
    return (
      <div className="text-center py-4 px-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs">
        등록된 방문 도시가 없습니다. 아래 버튼으로 도시를 추가해보세요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {cities.map((city) => (
        <div
          key={city.id}
          className="p-2.5 bg-white dark:bg-[#1A2332] rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs hover:border-slate-200 dark:hover:border-slate-700 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {city.cityNameKo}
              </span>
              {city.cityNameJa && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                  ({city.cityNameJa})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              {city.visitedAt && (
                <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>{city.visitedAt}</span>
                </span>
              )}
              {city.notes && (
                <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                  <FileText className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span className="truncate max-w-[140px]">{city.notes}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
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
      ))}
    </div>
  );
};
