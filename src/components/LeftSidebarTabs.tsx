import React, { useState } from "react";
import type { TravelRecordsMap } from "../types/travel";
import { PrefectureList } from "./PrefectureList";
import { TravelTimeline } from "./TravelTimeline";
import { ListFilter, Clock } from "lucide-react";

interface LeftSidebarTabsProps {
  records: TravelRecordsMap;
  selectedCode: number | null;
  selectedRegion?: string | null;
  onSelectPrefecture: (code: number) => void;
  onClearRegion?: () => void;
}

export const LeftSidebarTabs: React.FC<LeftSidebarTabsProps> = ({
  records,
  selectedCode,
  selectedRegion = null,
  onSelectPrefecture,
  onClearRegion,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"list" | "timeline">("list");

  return (
    <div className="flex flex-col space-y-2">
      {/* Top Switcher Tabs */}
      <div className="flex bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab("list")}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === "list"
              ? "bg-white dark:bg-[#0E1628] text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <ListFilter className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span>도도부현 목록</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("timeline")}
          className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            activeSubTab === "timeline"
              ? "bg-white dark:bg-[#0E1628] text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>여행 타임라인</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === "list" ? (
        <PrefectureList
          records={records}
          selectedCode={selectedCode}
          selectedRegion={selectedRegion}
          onSelectPrefecture={onSelectPrefecture}
          onClearRegion={onClearRegion}
        />
      ) : (
        <TravelTimeline
          records={records}
          selectedCode={selectedCode}
          onSelectPrefecture={onSelectPrefecture}
        />
      )}
    </div>
  );
};
