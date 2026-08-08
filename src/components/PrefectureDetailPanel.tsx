import React, { useState } from "react";
import type { PrefectureRecord, VisitStatus, CityVisit } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { PREFECTURE_ACCESS_INFO } from "../data/transitRoutes";
import { StatusSelector } from "./StatusSelector";
import { CityVisitList } from "./CityVisitList";
import { CityVisitForm } from "./CityVisitForm";
import { ConfirmModal } from "./ConfirmModal";
import { MapPin, Plus, Plane, Train, Building2 } from "lucide-react";

interface PrefectureDetailPanelProps {
  selectedCode: number | null;
  record?: PrefectureRecord;
  onUpdateStatus: (code: number, status: VisitStatus) => void;
  onAddCity: (code: number, city: Omit<CityVisit, "id">) => void;
  onUpdateCity: (code: number, cityId: string, city: Partial<CityVisit>) => void;
  onDeleteCity: (code: number, cityId: string) => void;
  onUpdateDetails: (code: number, details: Partial<Omit<PrefectureRecord, "prefectureCode" | "cities">>) => void;
}

export const PrefectureDetailPanel: React.FC<PrefectureDetailPanelProps> = ({
  selectedCode,
  record,
  onUpdateStatus,
  onAddCity,
  onUpdateCity,
  onDeleteCity,
  onUpdateDetails,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCity, setEditingCity] = useState<CityVisit | null>(null);
  const [confirmStatusModal, setConfirmStatusModal] = useState<VisitStatus | null>(null);

  if (!selectedCode) {
    return (
      <div className="bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center min-h-[300px] h-full space-y-2 transition-colors duration-200">
        <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        <p className="text-xs font-medium">지도에서 도도부현을 선택하거나 목록에서 클릭해주세요.</p>
      </div>
    );
  }

  const prefMeta = PREFECTURE_MAP_BY_CODE.get(selectedCode);
  if (!prefMeta) return null;

  const accessInfo = PREFECTURE_ACCESS_INFO[selectedCode];
  const currentStatus = record?.status || "unvisited";
  const cities = record?.cities || [];

  const handleStatusChangeRequest = (newStatus: VisitStatus) => {
    if (newStatus === currentStatus) return;

    if (newStatus === "unvisited" && (cities.length > 0 || record?.notes)) {
      setConfirmStatusModal(newStatus);
    } else {
      onUpdateStatus(selectedCode, newStatus);
    }
  };

  const handleConfirmUnvisited = () => {
    if (confirmStatusModal) {
      onUpdateStatus(selectedCode, confirmStatusModal);
      setConfirmStatusModal(null);
    }
  };

  return (
    <div className="bg-white dark:bg-[#151D2A] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 flex flex-col space-y-4 transition-colors duration-200">
      {/* Header Info */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{prefMeta.nameKo}</h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{prefMeta.nameJa}</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{prefMeta.region} 지방 (No.{prefMeta.code})</span>
        </div>

        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            currentStatus === "visited"
              ? "bg-blue-100 dark:bg-cyan-950 text-blue-800 dark:text-cyan-300 border border-blue-200/50 dark:border-cyan-800/50"
              : currentStatus === "transit"
              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          {currentStatus === "visited" ? "방문" : currentStatus === "transit" ? "경유" : "미방문"}
        </span>
      </div>

      {/* Status Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">방문 상태 변경</label>
        <StatusSelector status={currentStatus} onChangeStatus={handleStatusChangeRequest} />
      </div>

      {/* Visited Status Specific UI */}
      {currentStatus === "visited" && (
        <div className="space-y-4 pt-1">
          {/* Cities Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                <span>방문 도시</span>
                <span className="text-blue-600 dark:text-cyan-400">({cities.length}개)</span>
              </span>
              {!showAddForm && !editingCity && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-1 text-xs text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 font-semibold hover:bg-blue-50 dark:hover:bg-cyan-950/50 px-2 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>도시 추가</span>
                </button>
              )}
            </div>

            {showAddForm && (
              <CityVisitForm
                onSave={(data) => {
                  onAddCity(selectedCode, data);
                  setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {editingCity && (
              <CityVisitForm
                initialData={editingCity}
                onSave={(data) => {
                  onUpdateCity(selectedCode, editingCity.id, data);
                  setEditingCity(null);
                }}
                onCancel={() => setEditingCity(null)}
              />
            )}

            {!showAddForm && !editingCity && (
              <CityVisitList
                cities={cities}
                onEdit={(c) => setEditingCity(c)}
                onDelete={(cityId) => onDeleteCity(selectedCode, cityId)}
              />
            )}
          </div>
        </div>
      )}

      {/* Transit Status Specific UI */}
      {currentStatus === "transit" && (
        <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 space-y-2.5 text-xs pt-1">
          <span className="font-bold text-emerald-900 dark:text-emerald-300 block">경유 정보</span>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">열차, 자동차 등으로 통과만 하고 하차 관광 활동을 하지 않은 도도부현입니다.</p>
          
          <div>
            <label className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 mb-1 block">경유 시기 및 메모</label>
            <input
              type="text"
              placeholder="예: 신칸센으로 다카마쓰 이동 중 통과"
              value={record?.notes || ""}
              onChange={(e) => onUpdateDetails(selectedCode, { notes: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Traffic & Airport Access Information Card */}
      {accessInfo && (
        <div className="p-3 bg-slate-50/80 dark:bg-[#1A2332] rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
              <Plane className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>교통 & 공항 접근 가이드</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
              accessInfo.hasDirectFlight
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
            }`}>
              {accessInfo.hasDirectFlight ? "✈️ 한국 직항 유" : "🚄 신칸센/철도 연계"}
            </span>
          </div>

          {/* Airport Details */}
          {accessInfo.airportName && (
            <div className="text-[11px] text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-500 dark:text-slate-400">주요 공항: </span>
              <span>{accessInfo.airportName}</span>
            </div>
          )}

          {accessInfo.nearestAirport && (
            <div className="text-[11px] text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-500 dark:text-slate-400">가까운 공항: </span>
              <span>{accessInfo.nearestAirport}</span>
            </div>
          )}

          {/* Shinkansen Stations */}
          {accessInfo.shinkansenStations && accessInfo.shinkansenStations.length > 0 && (
            <div className="flex items-center space-x-1 text-[11px]">
              <Train className="w-3 h-3 text-red-500 shrink-0" />
              <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">신칸센: </span>
              <div className="flex flex-wrap gap-1">
                {accessInfo.shinkansenStations.map((st) => (
                  <span key={st} className="px-1.5 py-0.2 bg-red-50 dark:bg-red-950/60 border border-red-200/60 dark:border-red-800 text-red-700 dark:text-red-300 rounded text-[10px]">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Access Description */}
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60">
            {accessInfo.accessGuide}
          </p>

          {/* Major Representative Cities */}
          {accessInfo.representativeCities.length > 0 && (
            <div className="pt-0.5">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1 mb-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>권역 대표 주요 도시:</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {accessInfo.representativeCities.map((c) => (
                  <span key={c} className="px-2 py-0.5 bg-blue-50 dark:bg-cyan-950 text-blue-700 dark:text-cyan-300 rounded-md text-[10px] font-medium border border-blue-100 dark:border-cyan-800/60">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Flight Schedules List Component */}
          <FlightSchedulesSection prefCode={selectedCode} />
        </div>
      )}

      {/* Warning Confirm Modal for reset status */}
      <ConfirmModal
        isOpen={confirmStatusModal !== null}
        title="기록 삭제 확인"
        message={`${prefMeta.nameKo}의 기존 방문 도시 및 메모 기록이 모두 삭제됩니다. 계속하시겠습니까?`}
        confirmLabel="삭제 후 미방문 처리"
        cancelLabel="취소"
        onConfirm={handleConfirmUnvisited}
        onCancel={() => setConfirmStatusModal(null)}
      />
    </div>
  );
};

// Sub-component for Direct Flight Schedules
import { getFlightSchedules } from "../services/flightService";
import type { FlightSchedule } from "../services/flightService";
import { Clock, Calendar } from "lucide-react";

const FlightSchedulesSection: React.FC<{ prefCode: number }> = ({ prefCode }) => {
  const [depFilter, setDepFilter] = useState<string>("ALL");
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);

  React.useEffect(() => {
    getFlightSchedules(prefCode, depFilter).then(setSchedules);
  }, [prefCode, depFilter]);

  if (schedules.length === 0 && depFilter === "ALL") return null;

  return (
    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
          <Plane className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
          <span>한국 출발 직항 운항 스케줄</span>
          <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-extrabold">({schedules.length}개)</span>
        </span>
      </div>

      {/* Departure Airport Filter Tabs */}
      <div className="flex bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-semibold">
        {[
          { code: "ALL", label: "전체" },
          { code: "ICN", label: "인천" },
          { code: "PUS", label: "부산" },
          { code: "GMP", label: "김포" },
          { code: "CJJ", label: "청주/기타" },
        ].map((tab) => (
          <button
            key={tab.code}
            type="button"
            onClick={() => setDepFilter(tab.code)}
            className={`flex-1 py-1 rounded transition-all ${
              depFilter === tab.code
                ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-cyan-300 shadow-xs font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flight Cards List */}
      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
        {schedules.length === 0 ? (
          <div className="text-center py-3 text-[10px] text-slate-400">
            선택한 출발 공항에서 직항 노선 정보가 없습니다.
          </div>
        ) : (
          schedules.map((flight, idx) => (
            <div
              key={`${flight.flightNo}-${idx}`}
              className="p-2 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px]"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100">
                  <span className="text-blue-600 dark:text-cyan-400">{flight.airline}</span>
                  <span className="px-1 py-0.2 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">{flight.flightNo}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <span>{flight.depAirport} ({flight.depAirportCode})</span>
                  <span>➔</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{flight.arrAirport} ({flight.arrAirportCode})</span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="font-extrabold text-blue-700 dark:text-cyan-300 flex items-center justify-end space-x-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{flight.departureTime} ~ {flight.arrivalTime}</span>
                </div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-end space-x-0.5">
                  <Calendar className="w-2.5 h-2.5" />
                  <span>{flight.days}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
