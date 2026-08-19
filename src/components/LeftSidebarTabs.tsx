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
      {/* Editorial Top Switcher Tabs */}
      <div className="flex bg-[#FBF9F5] dark:bg-[#0C1017] p-1 rounded-2xl border border-[#E8E3D8] dark:border-slate-800 text-[11px] font-semibold font-sans shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveSubTab("list")}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
            activeSubTab === "list"
              ? "bg-[#E63946] text-white font-bold shadow-2xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span className="font-serif-jp">도도부현</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("trips")}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
            activeSubTab === "trips"
              ? "bg-[#E63946] text-white font-bold shadow-2xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Luggage className="w-3.5 h-3.5" />
          <span className="font-serif-jp">여행 회차 ({trips.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("timeline")}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer ${
            activeSubTab === "timeline"
              ? "bg-[#E63946] text-white font-bold shadow-2xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span className="font-serif-jp font-bold">타임라인</span>
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
