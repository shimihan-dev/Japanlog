import React from "react";
import type { Trip } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { Plus, Calendar, MapPin, Sparkles, Edit2, Trash2, Crosshair, Luggage, ListFilter } from "lucide-react";

interface TripListProps {
  trips: Trip[];
  selectedTripId: string | null;
  onSelectTrip: (tripId: string | null) => void;
  onOpenCreateModal: (mode: "existing" | "new") => void;
  onEditTrip: (trip: Trip) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const TripList: React.FC<TripListProps> = ({
  trips,
  selectedTripId,
  onSelectTrip,
  onOpenCreateModal,
  onEditTrip,
  onDeleteTrip,
}) => {
  return (
    <div className="space-y-3">
      {/* Top Action Bar with Dual Buttons */}
      <div className="space-y-2 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
            <Luggage className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span>여행 회차 관리 ({trips.length}개)</span>
          </div>
        </div>

        {/* Dual Mode Creation Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onOpenCreateModal("existing")}
            className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold transition-all border border-slate-200 dark:border-slate-700"
            title="기존에 지도로 등록된 기록에서 선택해 여행으로 묶기"
          >
            <ListFilter className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
            <span>📋 기존 기록 묶기</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCreateModal("new")}
            className="flex items-center justify-center space-x-1 py-1.5 px-2 bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-slate-900 rounded-xl text-[11px] font-bold transition-all shadow-2xs"
            title="신규 여행 등록 (지도에 방문 현 & 도시 핀 자동 생성)"
          >
            <Plus className="w-3 h-3" />
            <span>➕ 신규 여행 (지도 연동)</span>
          </button>
        </div>
      </div>

      {/* Trips Card List */}
      {trips.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <Luggage className="w-8 h-8 mx-auto text-slate-400 mb-2 stroke-[1.5]" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
            등록된 여행 회차가 없습니다.
          </p>
          <div className="flex justify-center space-x-2">
            <button
              type="button"
              onClick={() => onOpenCreateModal("new")}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              + 첫 신규 여행 등록하기 (지도 자동 반영)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {trips.map((trip) => {
            const isSelected = selectedTripId === trip.id;

            return (
              <div
                key={trip.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                  isSelected
                    ? "bg-blue-50/90 dark:bg-cyan-950/40 border-blue-400 dark:border-cyan-400 shadow-sm ring-2 ring-blue-500/20"
                    : "bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {/* Header: Emoji, Title & Action Menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2 min-w-0">
                    <span className="text-xl select-none pt-0.5">{trip.emoji || "🧳"}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug break-words">
                        {trip.title}
                      </h4>
                      {(trip.startDate || trip.endDate) && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            {trip.startDate || "시작일 미정"} {trip.endDate ? `~ ${trip.endDate}` : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditTrip(trip)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="여행 수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="여행 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Visited Prefectures Badges */}
                {trip.prefectures.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {trip.prefectures.map((code) => {
                      const pref = PREFECTURE_MAP_BY_CODE.get(code);
                      if (!pref) return null;
                      return (
                        <span
                          key={code}
                          className="px-2 py-0.5 bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-cyan-300 rounded-lg text-[10px] font-bold"
                        >
                          {pref.nameKo}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Visited Cities */}
                {trip.cities.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                    {trip.cities.map((c, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/60 rounded-md text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <MapPin className="w-2.5 h-2.5 text-rose-500" />
                        <span>{c.cityNameKo}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="space-y-0.5 pt-0.5 border-t border-slate-100 dark:border-slate-700/50">
                    {trip.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center space-x-1 text-[10px] text-amber-700 dark:text-amber-300">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                {trip.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2">
                    "{trip.description}"
                  </p>
                )}

                {/* Map Focus Toggle Button */}
                <button
                  type="button"
                  onClick={() => onSelectTrip(isSelected ? null : trip.id)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all ${
                    isSelected
                      ? "bg-rose-600 dark:bg-cyan-500 text-white dark:text-slate-900 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-900"
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{isSelected ? "지도 강조 해제 (Clear Focus)" : "📍 지도에서 이 여행만 보기"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
