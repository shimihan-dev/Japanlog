import React, { useState } from "react";
import type { Trip } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { Plus, Calendar, MapPin, Sparkles, Edit2, Trash2, Crosshair, Luggage, ListFilter, Eye } from "lucide-react";
import { TripDetailModal } from "./TripDetailModal";

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
  const [detailTripModal, setDetailTripModal] = useState<Trip | null>(null);

  return (
    <div className="space-y-3 font-sans">
      {/* Top Action Bar with Dual Buttons */}
      <div className="space-y-2 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-bold font-serif-jp text-slate-900 dark:text-slate-100">
            <Luggage className="w-4 h-4 text-[#E63946]" />
            <span>여행 회차 관리 ({trips.length}개)</span>
          </div>
        </div>

        {/* Dual Mode Creation Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onOpenCreateModal("existing")}
            className="flex items-center justify-center space-x-1 py-2 px-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-[11px] font-bold transition-all border border-slate-200/80 dark:border-slate-800 cursor-pointer font-serif-jp"
            title="기존에 지도로 등록된 기록에서 선택해 여행으로 묶기"
          >
            <ListFilter className="w-3.5 h-3.5 text-slate-500" />
            <span>기존 기록 묶기</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCreateModal("new")}
            className="flex items-center justify-center space-x-1 py-2 px-2 bg-[#E63946] hover:bg-[#D92534] text-white rounded-xl text-[11px] font-bold transition-all shadow-2xs cursor-pointer font-serif-jp"
            title="신규 여행 등록 (지도에 방문 현 & 도시 핀 자동 생성)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>신규 여행 등록</span>
          </button>
        </div>
      </div>

      {/* Trips Card List */}
      {trips.length === 0 ? (
        <div className="p-8 text-center bg-[#FBF9F5] dark:bg-slate-950/60 rounded-2xl border border-dashed border-[#E8E3D8] dark:border-slate-800">
          <Luggage className="w-8 h-8 mx-auto text-slate-400 mb-2 stroke-[1.5]" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 font-serif-jp">
            등록된 여행 회차가 없습니다.
          </p>
          <div className="flex justify-center space-x-2">
            <button
              type="button"
              onClick={() => onOpenCreateModal("new")}
              className="text-xs font-bold text-[#E63946] hover:underline font-serif-jp cursor-pointer"
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
                    ? "bg-red-50/70 dark:bg-red-950/40 border-[#E63946] dark:border-[#FF5A65] shadow-2xs"
                    : "bg-[#FBF9F5] dark:bg-slate-900 border-[#E8E3D8] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Ticket Stamp Header */}
                <div className="flex items-center justify-between text-[9px] font-sans-outfit border-b border-dashed border-slate-200 dark:border-slate-800 pb-1.5 mb-1.5 text-slate-400">
                  <span className="font-mono tracking-wider text-[#E63946] dark:text-[#FF5A65] font-bold flex items-center gap-1">
                    <span>🎫 JPN-PASS</span>
                    <span>•</span>
                    <span className="text-slate-500 font-normal">SER. {trip.id.substring(0, 6).toUpperCase()}</span>
                  </span>
                  <span className="font-serif-jp text-[10px] text-slate-400">일본 여정 승차권</span>
                </div>

                {/* Header: Emoji, Title & Action Menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2 min-w-0">
                    <span className="text-xl select-none pt-0.5">{trip.emoji || "🧳"}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold font-serif-jp text-slate-900 dark:text-slate-100 leading-snug break-words">
                        {trip.title}
                      </h4>
                      {(trip.startDate || trip.endDate) && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans-outfit">
                          <Calendar className="w-3 h-3 text-[#E63946]" />
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
                      className="p-1 rounded-lg text-slate-400 hover:text-[#E63946] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="여행 수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTrip(trip.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                          className="px-2 py-0.5 bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] rounded-md text-[10px] font-bold font-serif-jp border border-red-200/60 dark:border-red-900/60"
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
                        className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded-md text-[10px] font-medium text-slate-700 dark:text-slate-300 font-serif-jp border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <MapPin className="w-2.5 h-2.5 text-[#E63946]" />
                        <span>{c.cityNameKo}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {trip.highlights && trip.highlights.length > 0 && (
                  <div className="space-y-0.5 pt-0.5 border-t border-slate-200/60 dark:border-slate-800">
                    {trip.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center space-x-1 text-[10px] text-slate-600 dark:text-slate-400 font-serif-jp">
                        <Sparkles className="w-2.5 h-2.5 text-[#E63946] shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                {trip.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 font-sans">
                    "{trip.description}"
                  </p>
                )}

                {/* Action Buttons: Open Landing Sticker Card Modal & Map Focus */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setDetailTripModal(trip)}
                    className="py-1.5 px-2 bg-white dark:bg-slate-800 hover:bg-red-50 text-slate-700 dark:text-slate-200 hover:text-[#E63946] border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer font-serif-jp"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>상륙 스탬프 요약</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTrip(isSelected ? null : trip.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer font-serif-jp ${
                      isSelected
                        ? "bg-[#E63946] text-white shadow-2xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#E63946] hover:text-[#E63946]"
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>{isSelected ? "강조 해제" : "지도 강조"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dedicated Trip Detail & Landing Permission Lightbox Modal */}
      <TripDetailModal
        trip={detailTripModal}
        isOpen={Boolean(detailTripModal)}
        onClose={() => setDetailTripModal(null)}
        onSelectTrip={onSelectTrip}
        isSelected={selectedTripId === detailTripModal?.id}
        onEditTrip={onEditTrip}
        onDeleteTrip={onDeleteTrip}
      />
    </div>
  );
};
