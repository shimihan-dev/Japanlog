import React from "react";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { History, MapPin } from "lucide-react";

interface RecentVisitsProps {
  recentVisits: {
    cityName: string;
    prefectureCode: number;
    visitedAt?: string;
    updatedAt: string;
  }[];
  onSelectPrefecture: (code: number) => void;
}

export const RecentVisits: React.FC<RecentVisitsProps> = ({
  recentVisits,
  onSelectPrefecture,
}) => {
  return (
    <div className="bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 mt-4 transition-colors duration-200">
      <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
        <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">최근 추가/수정 도시</h3>
      </div>

      {recentVisits.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">최근 기록이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {recentVisits.map((item, idx) => {
            const pref = PREFECTURE_MAP_BY_CODE.get(item.prefectureCode);
            if (!pref) return null;

            return (
              <div
                key={`${item.prefectureCode}-${item.cityName}-${idx}`}
                onClick={() => onSelectPrefecture(item.prefectureCode)}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-[#1A2332] hover:bg-blue-50/60 dark:hover:bg-cyan-950/40 cursor-pointer transition-colors border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                      {item.cityName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {pref.nameKo}
                    </span>
                  </div>
                </div>
                {item.visitedAt && (
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                    {item.visitedAt}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
