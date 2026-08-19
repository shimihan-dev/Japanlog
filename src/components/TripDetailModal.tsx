import React from "react";
import type { Trip } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { LandingSticker } from "./LandingSticker";
import { X, Calendar, MapPin, Sparkles, Crosshair, Edit2, Trash2 } from "lucide-react";

interface TripDetailModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTrip: (tripId: string | null) => void;
  isSelected: boolean;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (tripId: string) => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  isOpen,
  onClose,
  onSelectTrip,
  isSelected,
  onEditTrip,
  onDeleteTrip,
}) => {
  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FBF9F5] dark:bg-[#0C1017] border border-[#E8E3D8] dark:border-slate-800 rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E3D8] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="text-2xl select-none">{trip.emoji || "🧳"}</span>
            <div className="min-w-0">
              <h3 className="text-base font-bold font-serif-jp text-slate-900 dark:text-slate-100 truncate">
                {trip.title}
              </h3>
              {(trip.startDate || trip.endDate) && (
                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400 font-sans-outfit">
                  <Calendar className="w-3.5 h-3.5 text-[#E63946]" />
                  <span>
                    {trip.startDate || "시작일 미정"} {trip.endDate ? `~ ${trip.endDate}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {onEditTrip && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditTrip(trip);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#E63946] hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="여행 수정"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDeleteTrip && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDeleteTrip(trip.id);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="여행 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Left Info & Right Landing Passport Sticker */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Authentic Landing Permission Sticker */}
          <div className="transform -rotate-1 shadow-md">
            <LandingSticker trip={trip} />
          </div>

          {/* Prefectures Visited */}
          {trip.prefectures.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold font-serif-jp text-slate-700 dark:text-slate-300 block">
                🗺️ 탐색 도도부현 ({trip.prefectures.length}개)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {trip.prefectures.map((code) => {
                  const pref = PREFECTURE_MAP_BY_CODE.get(code);
                  if (!pref) return null;
                  return (
                    <span
                      key={code}
                      className="px-2.5 py-1 bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] rounded-lg text-xs font-bold font-serif-jp border border-red-200/60 dark:border-red-900/60"
                    >
                      {pref.nameKo} ({pref.nameJa})
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cities Visited */}
          {trip.cities.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold font-serif-jp text-slate-700 dark:text-slate-300 block">
                📍 탐색 도시 목록 ({trip.cities.length}개)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {trip.cities.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 font-serif-jp border border-slate-200/80 dark:border-slate-700"
                  >
                    <MapPin className="w-3 h-3 text-[#E63946]" />
                    <span>{c.cityNameKo}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {trip.highlights && trip.highlights.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#E8E3D8] dark:border-slate-800">
              <span className="text-xs font-bold font-serif-jp text-slate-700 dark:text-slate-300 block">
                ✨ 여행 하이라이트
              </span>
              <div className="space-y-1">
                {trip.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-300 font-serif-jp">
                    <Sparkles className="w-3 h-3 text-[#E63946] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {trip.description && (
            <div className="pt-2 border-t border-[#E8E3D8] dark:border-slate-800">
              <span className="text-xs font-bold font-serif-jp text-slate-700 dark:text-slate-300 block mb-1">
                📝 여정 메모
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-[#E8E3D8] dark:border-slate-800 font-sans">
                "{trip.description}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer: Map Focus Toggle Button */}
        <div className="px-6 py-4 bg-white dark:bg-[#0C1017] border-t border-[#E8E3D8] dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onSelectTrip(isSelected ? null : trip.id);
            }}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer font-serif-jp ${
              isSelected
                ? "bg-[#E63946] text-white shadow-2xs"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#E63946] hover:text-[#E63946]"
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>{isSelected ? "지도 강조 해제 (Clear Focus)" : "📍 지도에서 이 여행만 강조하기"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
