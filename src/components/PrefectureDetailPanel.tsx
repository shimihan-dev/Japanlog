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
      <div className="bg-white dark:bg-[#0E1628] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center min-h-[300px] h-full space-y-2 transition-colors duration-200">
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
    <div className="bg-white dark:bg-[#0E1628] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-5 flex flex-col space-y-4 transition-all duration-200">
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
              ? "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50"
              : currentStatus === "transit"
              ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
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
                <span className="text-blue-600 dark:text-blue-400">({cities.length}개)</span>
              </span>
              {!showAddForm && !editingCity && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors"
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
        <div className="p-3 bg-slate-50/80 dark:bg-[#151D2A] rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
              <Plane className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>교통 & 공항 접근 가이드</span>
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
              accessInfo.hasDirectFlight
                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
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
                  <span key={st} className="px-1.5 py-0.2 bg-red-50 dark:bg-red-950/60 border border-red-200/60 dark:border-red-800/80 text-red-700 dark:text-red-300 rounded text-[10px]">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Access Description */}
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
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
                  <span key={c} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-medium border border-slate-200 dark:border-slate-700">
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

// Sub-component for Direct Flight Schedules & Gateway Airport Real-time Fetcher
import { fetchLiveAirportFlights, PREFECTURE_AIRPORTS_MAP } from "../services/flightService";
import type { FlightSchedule } from "../services/flightService";
import { Clock, Calendar, RefreshCw, AlertCircle } from "lucide-react";

const FlightSchedulesSection: React.FC<{ prefCode: number }> = ({ prefCode }) => {
  const airportConfig = PREFECTURE_AIRPORTS_MAP[prefCode] || {
    hasDirectFlight: false,
    airports: [{ code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }],
  };

  const [selectedAirportCode, setSelectedAirportCode] = useState<string>(
    airportConfig.airports[0]?.code || "KIX"
  );
  const [depFilter, setDepFilter] = useState<string>("ALL");
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastFetchedTime, setLastFetchedTime] = useState<string>("");

  // Reset selected airport when prefecture changes
  React.useEffect(() => {
    if (airportConfig.airports.length > 0) {
      setSelectedAirportCode(airportConfig.airports[0].code);
    }
  }, [prefCode]);

  // Fetch live flight data whenever selected airport or departure airport filter changes
  const loadFlights = React.useCallback(() => {
    setLoading(true);
    fetchLiveAirportFlights(selectedAirportCode, depFilter)
      .then((data) => {
        setSchedules(data);
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        setLastFetchedTime(timeStr);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedAirportCode, depFilter]);

  React.useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  const activeAirportObj = airportConfig.airports.find((a) => a.code === selectedAirportCode) || airportConfig.airports[0];

  const isLiveApiActive = schedules.some((s) => s.isLive);

  return (
    <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800 space-y-2.5">
      {/* 1. Direct vs Gateway Airport Selection Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
            <Plane className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              {airportConfig.hasDirectFlight ? "직항 공항 선택 & 실시간 운항 정보" : "관문 공항 선택 & 실시간 운항 정보"}
            </span>
          </span>

          <div className="flex items-center space-x-1.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold flex items-center space-x-1 ${
              isLiveApiActive
                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveApiActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              <span>{isLiveApiActive ? "공공데이터 API 실시간 성공" : "정기 타임테이블"}</span>
            </span>

            <button
              onClick={loadFlights}
              disabled={loading}
              className="flex items-center space-x-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              title="실시간 조속 새로고침"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>{lastFetchedTime ? `${lastFetchedTime} 기준` : "실시간 조회"}</span>
            </button>
          </div>
        </div>

        {!airportConfig.hasDirectFlight && (
          <p className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-1.5 rounded-lg border border-amber-200/60 dark:border-amber-800/60 flex items-start space-x-1">
            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>직항 미보유 지역입니다. 아래 **가장 가까운 관문 공항**을 클릭하여 실시간 항공편을 조회해보세요.</span>
          </p>
        )}
      </div>

      {/* 2. Multiple Airports Buttons Toggle */}
      {airportConfig.airports.length > 0 && (
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {airportConfig.airports.map((ap) => (
            <button
              key={ap.code}
              type="button"
              onClick={() => setSelectedAirportCode(ap.code)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-extrabold transition-all flex items-center justify-center space-x-1 ${
                selectedAirportCode === ap.code
                  ? "bg-blue-600 dark:bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{ap.name}</span>
              <span className="opacity-75">({ap.code})</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Departure Airport Filter Tabs */}
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
                ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Live Flight Cards List */}
      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center py-6 text-[10px] text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center space-y-1.5">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-semibold">{activeAirportObj?.name} 실시간 최신 운항 데이터 가져오는 중...</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-4 text-[10px] text-slate-400">
            선택한 {activeAirportObj?.name} 공항에 대한 직항 노선 스케줄이 없습니다.
          </div>
        ) : (
          schedules.map((flight, idx) => (
            <div
              key={`${flight.flightNo}-${idx}`}
              className="p-2 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[10px] hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-slate-100">
                  <span className="text-blue-600 dark:text-blue-400">{flight.airline}</span>
                  <span className="px-1 py-0.2 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">{flight.flightNo}</span>
                  {flight.isLive && (
                    <span className="px-1 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-[9px]">LIVE</span>
                  )}
                </div>
                <div className="text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                  <span>{flight.depAirport} ({flight.depAirportCode})</span>
                  <span>➔</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{flight.arrAirport} ({flight.arrAirportCode})</span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <div className="font-extrabold text-blue-700 dark:text-blue-300 flex items-center justify-end space-x-1">
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
