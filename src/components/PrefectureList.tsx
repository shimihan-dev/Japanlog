import React, { useState, useMemo } from "react";
import type { TravelRecordsMap, VisitStatus, SortOption } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";
import { MapPin, Navigation, ArrowUpDown, ChevronRight, X } from "lucide-react";

interface PrefectureListProps {
  records: TravelRecordsMap;
  selectedCode: number | null;
  selectedRegion?: string | null;
  onSelectPrefecture: (code: number) => void;
  onClearRegion?: () => void;
}

export const PrefectureList: React.FC<PrefectureListProps> = ({
  records,
  selectedCode,
  selectedRegion = null,
  onSelectPrefecture,
  onClearRegion,
}) => {
  const [activeTab, setActiveTab] = useState<VisitStatus>("visited");
  const [sortBy, setSortBy] = useState<SortOption>("code");

  // Filter prefectures by selected tab
  const filteredPrefectures = useMemo(() => {
    const list = PREFECTURES.filter((pref) => {
      const rec = records[pref.code];
      const status = rec?.status || "unvisited";
      return status === activeTab;
    });

    return list.sort((a, b) => {
      const recA = records[a.code];
      const recB = records[b.code];

      if (sortBy === "name") {
        return a.nameKo.localeCompare(b.nameKo, "ko-KR");
      }
      if (sortBy === "cities") {
        const countA = recA?.cities?.length || 0;
        const countB = recB?.cities?.length || 0;
        return countB - countA;
      }
      if (sortBy === "recent") {
        const timeA = new Date(recA?.updatedAt || 0).getTime();
        const timeB = new Date(recB?.updatedAt || 0).getTime();
        return timeB - timeA;
      }
      // default: code order (JIS)
      return a.code - b.code;
    });
  }, [records, activeTab, sortBy]);

  const visitedCount = useMemo(() => {
    return Object.values(records).filter((r) => r.status === "visited").length;
  }, [records]);

  const transitCount = useMemo(() => {
    return Object.values(records).filter((r) => r.status === "transit").length;
  }, [records]);

  return (
    <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs p-4 flex flex-col h-full transition-colors duration-250 font-sans">
      {/* Active Region Banner */}
      {selectedRegion && (
        <div className="flex items-center justify-between p-2 bg-red-50/80 dark:bg-red-950/40 rounded-xl border border-red-200/80 dark:border-red-900/60 text-xs font-bold text-[#E63946] dark:text-[#FF5A65] mb-2.5 font-serif-jp">
          <span>🗾 {selectedRegion} 권역 강조</span>
          {onClearRegion && (
            <button
              onClick={onClearRegion}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
              title="권역 강조 해제"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-3">
        <div className="flex items-center space-x-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("visited")}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "visited"
                ? "bg-[#E63946] text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap font-serif-jp">방문한 현</span>
            <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-md font-sans-outfit shrink-0 ${
              activeTab === "visited" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
            }`}>
              {visitedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("transit")}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "transit"
                ? "bg-[#192F52] text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap font-serif-jp">경유한 현</span>
            <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-md font-sans-outfit shrink-0 ${
              activeTab === "transit" ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600"
            }`}>
              {transitCount}
            </span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 shrink-0 font-serif-jp">
          <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-transparent border-none text-slate-700 dark:text-slate-300 font-bold focus:ring-0 cursor-pointer py-0 pl-1 pr-4"
          >
            <option value="code" className="dark:bg-slate-900">JIS 번호순</option>
            <option value="name" className="dark:bg-slate-900">가나다순</option>
            <option value="cities" className="dark:bg-slate-900">도시 많은순</option>
            <option value="recent" className="dark:bg-slate-900">최근 수정순</option>
          </select>
        </div>
      </div>

      {/* Prefecture List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] space-y-1.5 pr-1">
        {filteredPrefectures.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs font-serif-jp">
            {activeTab === "visited"
              ? "아직 방문한 도도부현이 없습니다. 지도나 스마트 등록으로 추가해보세요!"
              : "경유한 도도부현이 없습니다."}
          </div>
        ) : (
          filteredPrefectures.map((pref) => {
            const record = records[pref.code];
            const cityCount = record?.cities?.length || 0;
            const isSelected = selectedCode === pref.code;
            const isRegionSelected = Boolean(selectedRegion && pref.region === selectedRegion);

            return (
              <button
                key={pref.code}
                onClick={() => onSelectPrefecture(pref.code)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-red-50/80 dark:bg-red-950/40 border-[#E63946] dark:border-[#FF5A65] text-[#E63946] dark:text-[#FF5A65] font-extrabold shadow-2xs"
                    : isRegionSelected
                    ? "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-[#E63946] dark:text-[#FF5A65] font-bold"
                    : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      activeTab === "visited"
                        ? "bg-[#E63946]"
                        : "bg-[#192F52]"
                    }`}
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center space-x-1.5 font-serif-jp">
                      <span>{pref.nameKo}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({pref.nameJa})
                      </span>
                    </div>
                    {activeTab === "visited" && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-sans">
                        {cityCount > 0 ? `${cityCount}개 도시 방문` : "도시 정보 없음"}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected
                      ? "text-[#E63946] dark:text-[#FF5A65] translate-x-0.5"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
