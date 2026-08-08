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
    <div className="bg-white dark:bg-[#0E1628] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-4 flex flex-col h-full transition-colors duration-200">
      {/* Active Region Banner */}
      {selectedRegion && (
        <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-cyan-950/60 rounded-xl border border-blue-200/80 dark:border-cyan-800/80 text-xs font-semibold text-blue-900 dark:text-cyan-200 mb-2.5">
          <span>🗾 {selectedRegion} 권역 강조</span>
          {onClearRegion && (
            <button
              onClick={onClearRegion}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors"
              title="권역 강조 해제"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
        <div className="flex items-center space-x-1 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setActiveTab("visited")}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "visited"
                ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-cyan-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
            <span className="whitespace-nowrap">방문한 현</span>
            <span className="ml-1 px-1.5 py-0.2 bg-blue-100 dark:bg-cyan-950 text-blue-800 dark:text-cyan-300 text-[10px] rounded-full shrink-0">
              {visitedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("transit")}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "transit"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">경유한 현</span>
            <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] rounded-full shrink-0">
              {transitCount}
            </span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-transparent border-none text-slate-600 dark:text-slate-300 font-medium focus:ring-0 cursor-pointer py-0 pl-1 pr-4"
          >
            <option value="code" className="dark:bg-slate-800">번호순</option>
            <option value="name" className="dark:bg-slate-800">가나다순</option>
            <option value="cities" className="dark:bg-slate-800">도시 많은순</option>
            <option value="recent" className="dark:bg-slate-800">최근 수정순</option>
          </select>
        </div>
      </div>

      {/* Prefecture List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] space-y-1.5 pr-1">
        {filteredPrefectures.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
            {activeTab === "visited"
              ? "아직 방문한 도도부현이 없습니다. 지도나 패널에서 선택 후 등록해보세요!"
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
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-blue-50/70 dark:bg-cyan-950/40 border-blue-300 dark:border-cyan-500/50 ring-1 ring-blue-500/20 dark:ring-cyan-400/20 text-blue-900 dark:text-cyan-200"
                    : isRegionSelected
                    ? "bg-blue-50/40 dark:bg-cyan-950/20 border-blue-200 dark:border-cyan-800/40 text-blue-900 dark:text-cyan-200 font-bold"
                    : "bg-white dark:bg-[#1A2332] border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activeTab === "visited"
                        ? "bg-blue-500 dark:bg-cyan-400"
                        : "bg-emerald-500 dark:bg-emerald-400"
                    }`}
                  />
                  <div>
                    <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                      <span>{pref.nameKo}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                        ({pref.nameJa})
                      </span>
                    </div>
                    {activeTab === "visited" && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {cityCount > 0 ? `${cityCount}개 도시 방문` : "도시 정보 없음"}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected
                      ? "text-blue-600 dark:text-cyan-400 translate-x-0.5"
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
