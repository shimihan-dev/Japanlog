import React, { useState } from "react";
import type { PrefectureRecord, VisitStatus, CityVisit } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { StatusSelector } from "./StatusSelector";
import { CityVisitList } from "./CityVisitList";
import { CityVisitForm } from "./CityVisitForm";
import { ConfirmModal } from "./ConfirmModal";
import { MapPin, Plus, Calendar, Hash, FileText } from "lucide-react";

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
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px] h-full space-y-2">
        <MapPin className="w-8 h-8 text-slate-300" />
        <p className="text-xs font-medium">지도에서 도도부현을 선택하거나 목록에서 클릭해주세요.</p>
      </div>
    );
  }

  const prefMeta = PREFECTURE_MAP_BY_CODE.get(selectedCode);
  if (!prefMeta) return null;

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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900">{prefMeta.nameKo}</h2>
            <span className="text-xs text-slate-400 font-medium">{prefMeta.nameJa}</span>
          </div>
          <span className="text-[11px] text-slate-500">{prefMeta.region} 지방 (No.{prefMeta.code})</span>
        </div>

        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
            currentStatus === "visited"
              ? "bg-blue-100 text-blue-800"
              : currentStatus === "transit"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {currentStatus === "visited" ? "방문" : currentStatus === "transit" ? "경유" : "미방문"}
        </span>
      </div>

      {/* Status Selector */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">방문 상태 변경</label>
        <StatusSelector status={currentStatus} onChangeStatus={handleStatusChangeRequest} />
      </div>

      {/* Visited Status Specific UI */}
      {currentStatus === "visited" && (
        <div className="space-y-4 pt-1">
          {/* Cities Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                <span>방문 도시</span>
                <span className="text-blue-600">({cities.length}개)</span>
              </span>
              {!showAddForm && !editingCity && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
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

          {/* Visit Metadata Section */}
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 space-y-2.5 text-xs">
            <span className="font-semibold text-slate-700 block">추가 정보 (선택)</span>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 flex items-center space-x-1 mb-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>최초 방문일</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 2026.08.02"
                  value={record?.firstVisitedAt || ""}
                  onChange={(e) => onUpdateDetails(selectedCode, { firstVisitedAt: e.target.value })}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 flex items-center space-x-1 mb-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>최근 방문일</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 2026.08.05"
                  value={record?.lastVisitedAt || ""}
                  onChange={(e) => onUpdateDetails(selectedCode, { lastVisitedAt: e.target.value })}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 flex items-center space-x-1 mb-0.5">
                  <Hash className="w-3 h-3" />
                  <span>방문 횟수</span>
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="예: 1"
                  value={record?.visitCount || ""}
                  onChange={(e) => onUpdateDetails(selectedCode, { visitCount: Number(e.target.value) || undefined })}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 flex items-center space-x-1 mb-0.5">
                  <FileText className="w-3 h-3" />
                  <span>특이사항 / 메모</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 가족 여행, 식도락"
                  value={record?.notes || ""}
                  onChange={(e) => onUpdateDetails(selectedCode, { notes: e.target.value })}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transit Status Specific UI */}
      {currentStatus === "transit" && (
        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60 space-y-2.5 text-xs pt-1">
          <span className="font-bold text-emerald-900 block">경유 정보</span>
          <p className="text-[11px] text-emerald-700">열차, 자동차 등으로 통과만 하고 하차 관광 활동을 하지 않은 도도부현입니다.</p>
          
          <div>
            <label className="text-[11px] font-semibold text-emerald-800 mb-1 block">경유 시기 및 메모</label>
            <input
              type="text"
              placeholder="예: 신칸센으로 다카마쓰 이동 중 통과"
              value={record?.notes || ""}
              onChange={(e) => onUpdateDetails(selectedCode, { notes: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Unvisited UI */}
      {currentStatus === "unvisited" && (
        <div className="text-center py-6 text-slate-400 text-xs">
          아직 방문한 적 없는 지역입니다. 방문 또는 경유로 상태를 변경해보세요!
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
