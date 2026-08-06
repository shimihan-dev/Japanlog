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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 mt-4">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5 mb-3">
        <History className="w-4 h-4 text-slate-500" />
        <h3 className="text-xs font-bold text-slate-900">최근 추가/수정 도시</h3>
      </div>

      {recentVisits.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">최근 기록이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {recentVisits.map((item, idx) => {
            const pref = PREFECTURE_MAP_BY_CODE.get(item.prefectureCode);
            if (!pref) return null;

            return (
              <div
                key={`${item.prefectureCode}-${item.cityName}-${idx}`}
                onClick={() => onSelectPrefecture(item.prefectureCode)}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-blue-50/60 cursor-pointer transition-colors border border-slate-100"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      {item.cityName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {pref.nameKo}
                    </span>
                  </div>
                </div>
                {item.visitedAt && (
                  <span className="text-[10px] font-medium text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
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
