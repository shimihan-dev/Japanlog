import React, { useState } from "react";
import type { PrefectureRecord, VisitStatus, CityVisit, Trip } from "../types/travel";
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
  trips?: Trip[];
  onUpdateStatus: (code: number, status: VisitStatus) => void;
  onAddCity: (code: number, city: Omit<CityVisit, "id">) => void;
  onUpdateCity: (code: number, cityId: string, city: Partial<CityVisit>) => void;
  onDeleteCity: (code: number, cityId: string) => void;
  onUpdateDetails: (code: number, details: Partial<Omit<PrefectureRecord, "prefectureCode" | "cities">>) => void;
}

export const PrefectureDetailPanel: React.FC<PrefectureDetailPanelProps> = ({
  selectedCode,
  record,
  trips = [],
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
      <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800/80 shadow-2xs p-6 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center min-h-[300px] h-full space-y-3 transition-colors duration-250">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-amber-600 dark:text-slate-400 border border-amber-200/60 dark:border-slate-700">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-serif-jp text-sm font-bold text-slate-700 dark:text-slate-300">도도부현 선택</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">지도에서 탐색할 현을 선택하여 감성 다이어리를 확인하세요.</p>
        </div>
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
    <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800/80 shadow-xs p-5 flex flex-col space-y-4 transition-all duration-250 relative overflow-hidden">
      {/* Header Info */}
      <div className="flex items-start justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold font-serif-jp text-slate-900 dark:text-slate-100">{prefMeta.nameKo}</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-serif-jp">{prefMeta.nameJa}</span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-sans tracking-wide">
            {prefMeta.region} 지방 · Region No.{prefMeta.code}
          </span>
        </div>

        {/* Hanko Stamp for Visited Status or Regular Badge */}
        {currentStatus === "visited" ? (
          <div className="hanko-stamp w-11 h-11 text-xs shrink-0" title="御朱印 (Goshuin) - 방문 완료 직인">
            済
          </div>
        ) : (
          <span
            className={`px-3 py-1 rounded-xl text-xs font-bold ${
              currentStatus === "transit"
                ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}
          >
            {currentStatus === "transit" ? "경유 완료" : "미방문"}
          </span>
        )}
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
                prefectureCode={selectedCode}
                record={record}
                trips={trips}
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
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1 font-serif-jp">
              <Plane className="w-3.5 h-3.5 text-[#E63946]" />
              <span>교통 & 공항 접근 가이드</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold font-sans ${
              accessInfo.hasDirectFlight
                ? "bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] border border-red-200/60 dark:border-red-900/60"
                : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60"
            }`}>
              {accessInfo.hasDirectFlight ? "✈️ 한국 직항 유" : "🚄 신칸센/철도 연계"}
            </span>
          </div>

          {/* Airport Details */}
          {accessInfo.airportName && (
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans">
              <span className="font-semibold text-slate-400 dark:text-slate-500">주요 공항: </span>
              <span>{accessInfo.airportName}</span>
            </div>
          )}

          {accessInfo.nearestAirport && (
            <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans">
              <span className="font-semibold text-slate-400 dark:text-slate-500">가까운 공항: </span>
              <span>{accessInfo.nearestAirport}</span>
            </div>
          )}

          {/* Shinkansen Stations */}
          {accessInfo.shinkansenStations && accessInfo.shinkansenStations.length > 0 && (
            <div className="flex items-center space-x-1 text-[11px] font-serif-jp">
              <Train className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
              <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">신칸센: </span>
              <div className="flex flex-wrap gap-1">
                {accessInfo.shinkansenStations.map((st) => (
                  <span key={st} className="px-2 py-0.5 bg-red-50 dark:bg-red-950/60 border border-red-200/60 dark:border-red-900/60 text-[#E63946] dark:text-[#FF5A65] rounded-md text-[10px] font-bold">
                    {st}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Access Description */}
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-[#FBF9F5] dark:bg-slate-950 p-2.5 rounded-lg border border-[#E8E3D8] dark:border-slate-800 font-sans">
            {accessInfo.accessGuide}
          </p>

          {/* Major Representative Cities */}
          {accessInfo.representativeCities.length > 0 && (
            <div className="pt-0.5">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center space-x-1 mb-1 font-serif-jp">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>권역 대표 주요 도시:</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {accessInfo.representativeCities.map((c) => (
                  <span key={c} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-medium border border-slate-200/80 dark:border-slate-700 font-serif-jp">
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
import { fetchLiveAirportFlights, hasGimpoFlightsForAirport, getAerotypeUrl, getAeroLopaUrl, PREFECTURE_AIRPORTS_MAP } from "../services/flightService";
import type { FlightSchedule } from "../services/flightService";
import { Clock, Calendar, RefreshCw, AlertCircle, ArrowLeftRight, PlaneTakeoff, PlaneLanding, ExternalLink } from "lucide-react";

const FlightSchedulesSection: React.FC<{ prefCode: number }> = ({ prefCode }) => {
  const airportConfig = PREFECTURE_AIRPORTS_MAP[prefCode] || {
    hasDirectFlight: false,
    airports: [{ code: "KIX", name: "오사카 간사이 (관문)", isGateway: true }],
  };

  const [selectedAirportCode, setSelectedAirportCode] = useState<string>(
    airportConfig.airports[0]?.code || "KIX"
  );
  const [directionFilter, setDirectionFilter] = useState<"ALL" | "OUTBOUND" | "INBOUND">("ALL");
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

  // Check if selected airport has Gimpo flights
  const hasGimpo = React.useMemo(() => {
    return hasGimpoFlightsForAirport(selectedAirportCode);
  }, [selectedAirportCode]);

  // Reset depFilter if GMP was selected but this airport has no Gimpo flights
  React.useEffect(() => {
    if (depFilter === "GMP" && !hasGimpo) {
      setDepFilter("ALL");
    }
  }, [selectedAirportCode, hasGimpo, depFilter]);

  const koreanAirportTabs = React.useMemo(() => {
    const tabs = [
      { code: "ALL", label: "전체 공항" },
      { code: "ICN", label: "인천" },
      { code: "PUS", label: "부산" },
    ];
    if (hasGimpo) {
      tabs.push({ code: "GMP", label: "김포" });
    }
    tabs.push({ code: "CJJ", label: "청주/대구/기타" });
    return tabs;
  }, [hasGimpo]);

  // Fetch live flight data whenever selected airport, direction filter, or Korean airport filter changes
  const loadFlights = React.useCallback(() => {
    setLoading(true);
    fetchLiveAirportFlights(selectedAirportCode, depFilter, directionFilter)
      .then((data) => {
        setSchedules(data);
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        setLastFetchedTime(timeStr);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedAirportCode, depFilter, directionFilter]);

  React.useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  const activeAirportObj = airportConfig.airports.find((a) => a.code === selectedAirportCode) || airportConfig.airports[0];

  return (
    <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800 space-y-2.5">
      {/* 1. Direct vs Gateway Airport Selection Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
            <Plane className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              {airportConfig.hasDirectFlight ? "직항 공항 선택 & 실시간 왕복 운항 정보" : "관문 공항 선택 & 실시간 왕복 운항 정보"}
            </span>
          </span>

          <button
            onClick={loadFlights}
            disabled={loading}
            className="flex items-center space-x-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 shrink-0 whitespace-nowrap ml-1"
            title="실시간 새로고침"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>{lastFetchedTime ? `${lastFetchedTime} 기준` : "실시간 조회"}</span>
          </button>
        </div>

        {!airportConfig.hasDirectFlight && (
          <p className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-1.5 rounded-lg border border-amber-200/60 dark:border-amber-800/60 flex items-start space-x-1">
            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>직항 미보유 지역입니다. 아래 **가장 가까운 관문 공항**을 클릭하여 실시간 왕복 항공편을 조회해보세요.</span>
          </p>
        )}
      </div>

      {/* 2. Multiple Airports Buttons Toggle */}
      {airportConfig.airports.length > 0 && (
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl font-sans">
          {airportConfig.airports.map((ap) => (
            <button
              key={ap.code}
              type="button"
              onClick={() => setSelectedAirportCode(ap.code)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center space-x-1 whitespace-nowrap cursor-pointer ${
                selectedAirportCode === ap.code
                  ? "bg-[#E63946] text-white shadow-2xs"
                  : "bg-white dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{ap.name}</span>
              <span className="opacity-75 font-sans-outfit">({ap.code})</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Direction Filter Tabs (Round-Trip vs Outbound vs Inbound) */}
      <div className="space-y-1 font-sans">
        <div className="flex bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-xl text-[10px] font-bold border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setDirectionFilter("ALL")}
            className={`flex-1 py-1 px-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 whitespace-nowrap cursor-pointer ${
              directionFilter === "ALL"
                ? "bg-[#E63946] text-white font-extrabold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700"
            }`}
          >
            <ArrowLeftRight className="w-3 h-3 shrink-0" />
            <span>왕복 전체</span>
          </button>
          <button
            type="button"
            onClick={() => setDirectionFilter("OUTBOUND")}
            className={`flex-1 py-1 px-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 whitespace-nowrap cursor-pointer ${
              directionFilter === "OUTBOUND"
                ? "bg-[#E63946] text-white font-extrabold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700"
            }`}
          >
            <PlaneTakeoff className="w-3 h-3 shrink-0" />
            <span>한국 ➔ 일본</span>
          </button>
          <button
            type="button"
            onClick={() => setDirectionFilter("INBOUND")}
            className={`flex-1 py-1 px-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 whitespace-nowrap cursor-pointer ${
              directionFilter === "INBOUND"
                ? "bg-[#192F52] text-white font-extrabold shadow-2xs"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700"
            }`}
          >
            <PlaneLanding className="w-3 h-3 shrink-0" />
            <span>일본 ➔ 한국</span>
          </button>
        </div>

        {/* 4. Korean Airport Filter Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-xl text-[10px] font-semibold">
          {koreanAirportTabs.map((tab) => (
            <button
              key={tab.code}
              type="button"
              onClick={() => setDepFilter(tab.code)}
              className={`flex-1 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                depFilter === tab.code
                  ? "bg-white dark:bg-slate-700 text-[#E63946] dark:text-[#FF5A65] font-bold shadow-2xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Live Flight Cards List */}
      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center py-6 text-[10px] text-[#E63946] dark:text-[#FF5A65] flex flex-col items-center justify-center space-y-1.5 font-sans">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="font-semibold">{activeAirportObj?.name} 실시간 운항 데이터 조회 중...</span>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-4 text-[10px] text-slate-400 font-sans">
            선택한 조건의 직항/왕복 노선 스케줄이 없습니다.
          </div>
        ) : (
          schedules.map((flight, idx) => {
            const isOutbound = flight.direction === "OUTBOUND" || flight.arrAirportCode === selectedAirportCode;

            return (
              <div
                key={`${flight.flightNo}-${idx}`}
                className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-[#E63946]/40 transition-colors space-y-1.5 font-sans"
              >
                <div className="flex items-center justify-between text-[10px] gap-2">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold shrink-0 whitespace-nowrap ${
                          isOutbound
                            ? "bg-red-50 dark:bg-red-950 text-[#E63946] dark:text-[#FF5A65] border border-red-200/60 dark:border-red-900/60"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {isOutbound ? "🛫 한국➔일본" : "🛬 일본➔한국"}
                      </span>
                      <span className="text-[#E63946] dark:text-[#FF5A65] font-bold font-serif-jp shrink-0 whitespace-nowrap">{flight.airline}</span>
                      <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 font-sans-outfit font-mono text-[9px] shrink-0 whitespace-nowrap">{flight.flightNo}</span>
                      {flight.isLive && (
                        <span className="px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200/60 rounded-md text-[9px] shrink-0 whitespace-nowrap font-bold">LIVE</span>
                      )}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 flex items-center space-x-1 font-medium text-[10px] whitespace-nowrap overflow-hidden text-ellipsis">
                      <span className={isOutbound ? "font-bold text-slate-800 dark:text-slate-200 font-serif-jp" : ""}>
                        {flight.depAirport} ({flight.depAirportCode})
                      </span>
                      <span>➔</span>
                      <span className={!isOutbound ? "font-bold text-slate-800 dark:text-slate-200 font-serif-jp" : ""}>
                        {flight.arrAirport} ({flight.arrAirportCode})
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5 shrink-0 whitespace-nowrap pl-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-end space-x-1 text-[11px] whitespace-nowrap font-sans-outfit">
                      <Clock className="w-3 h-3 text-[#E63946] shrink-0" />
                      <span className="whitespace-nowrap">{flight.departureTime} ~ {flight.arrivalTime}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium flex items-center justify-end space-x-0.5 whitespace-nowrap">
                      <Calendar className="w-2.5 h-2.5 shrink-0" />
                      <span className="whitespace-nowrap">{flight.days}</span>
                    </div>
                  </div>
                </div>

                {/* Aerotype Aircraft Spec & AeroLOPA Seat Map Badges */}
                {flight.aircraft && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[9px]">
                    <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 flex items-center gap-0.5">
                      ✈️ 기종:
                    </span>
                    {flight.aircraft.split("/").map((model, mIdx) => {
                      const trimmedModel = model.trim();
                      const aerotypeUrl = getAerotypeUrl(trimmedModel);
                      const aerolopaUrl = getAeroLopaUrl(flight.airline, trimmedModel);

                      return (
                        <React.Fragment key={mIdx}>
                          <a
                            href={aerotypeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Aerotype에서 ${trimmedModel} 기종 스펙 보기`}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 font-sans-outfit text-[9px] transition-all"
                          >
                            <span>{trimmedModel}</span>
                            <ExternalLink className="w-2 h-2 text-slate-400 shrink-0" />
                          </a>

                          <a
                            href={aerolopaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`AeroLOPA에서 ${flight.airline} ${trimmedModel} 초고화질 좌석배치도 보기`}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-950/70 dark:hover:bg-red-900/80 text-[#E63946] dark:text-[#FF5A65] border border-red-200/60 dark:border-red-900/60 font-bold text-[9px] transition-all"
                          >
                            <span>💺 AeroLOPA 좌석배치도</span>
                            <ExternalLink className="w-2 h-2 text-[#E63946] shrink-0" />
                          </a>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

