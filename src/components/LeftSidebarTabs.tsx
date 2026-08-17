import React, { useState } from "react";
import type { TravelRecordsMap, Trip } from "../types/travel";
import { PrefectureList } from "./PrefectureList";
import { TravelTimeline } from "./TravelTimeline";
import { TripList } from "./TripList";
import { ListFilter, Clock, Luggage } from "lucide-react";

interface LeftSidebarTabsProps {
  records: TravelRecordsMap;
  trips: Trip[];
  selectedTripId: string | null;
  selectedCode: number | null;
  selectedRegion?: string | null;
  onSelectPrefecture: (code: number) => void;
  onSelectTrip: (tripId: string | null) => void;
  onOpenCreateTripModal: (mode: "existing" | "new") => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
  onClearRegion?: () => void;
}

export const LeftSidebarTabs: React.FC<LeftSidebarTabsProps> = ({
  records,
  trips,
  selectedTripId,
  selectedCode,
  selectedRegion = null,
  onSelectPrefecture,
  onSelectTrip,
  onOpenCreateTripModal,
  onEditTrip,
  onDeleteTrip,
  onClearRegion,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"list" | "trips" | "timeline">("list");

  return (
    <div className="flex flex-col space-y-2">
      {/* Top Switcher Tabs */}
      <div className="flex bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-2xl text-[11px] font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab("list")}
          className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
            activeSubTab === "list"
              ? "bg-white dark:bg-[#0E1628] text-slate-900 dark:text-slate-100 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <ListFilter className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
          <span>도도부현</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("trips")}
          className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
            activeSubTab === "trips"
              ? "bg-white dark:bg-[#0E1628] text-slate-900 dark:text-slate-100 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Luggage className="w-3 h-3 text-rose-500" />
          <span>여행 회차 ({trips.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("timeline")}
          className={`flex-1 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center space-x-1 ${
            activeSubTab === "timeline"
              ? "bg-white dark:bg-[#0E1628] text-slate-900 dark:text-slate-100 shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Clock className="w-3 h-3 text-amber-500" />
          <span>타임라인</span>
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
      ) : activeSubTab === "trips" ? (
        <TripList
          trips={trips}
          selectedTripId={selectedTripId}
          onSelectTrip={onSelectTrip}
          onOpenCreateModal={onOpenCreateTripModal}
          onEditTrip={onEditTrip}
          onDeleteTrip={onDeleteTrip}
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
