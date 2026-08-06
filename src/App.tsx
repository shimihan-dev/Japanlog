import React, { useState } from "react";
import { useTravelRecords } from "./hooks/useTravelRecords";
import { calculateTravelStats } from "./utils/statistics";
import { Header } from "./components/Header";
import { StatsCards } from "./components/StatsCards";
import { JapanMap } from "./components/JapanMap";
import { PrefectureList } from "./components/PrefectureList";
import { RecentVisits } from "./components/RecentVisits";
import { PrefectureDetailPanel } from "./components/PrefectureDetailPanel";
import { ConfirmModal } from "./components/ConfirmModal";

export const App: React.FC = () => {
  const {
    records,
    selectedCode,
    setSelectedCode,
    updateStatus,
    addCity,
    updateCity,
    deleteCity,
    updatePrefectureDetails,
    loadSample,
    resetAll,
    recentVisits,
  } = useTravelRecords();

  const [showResetModal, setShowResetModal] = useState(false);

  const stats = calculateTravelStats(records);

  const handleSelectPrefecture = (code: number) => {
    setSelectedCode(code);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA] text-slate-800 font-sans">
      {/* App Header */}
      <Header
        onLoadSample={loadSample}
        onReset={() => setShowResetModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Prefecture List & Recent Visits (3 cols) */}
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col">
            <PrefectureList
              records={records}
              selectedCode={selectedCode}
              onSelectPrefecture={handleSelectPrefecture}
            />
            <RecentVisits
              recentVisits={recentVisits}
              onSelectPrefecture={handleSelectPrefecture}
            />
          </div>

          {/* Center Column: Japan Map (6 cols) */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
            <JapanMap
              records={records}
              selectedCode={selectedCode}
              onSelectPrefecture={handleSelectPrefecture}
            />
          </div>

          {/* Right Column: Prefecture Detail Panel (3 cols) */}
          <div className="lg:col-span-3 order-3 lg:order-3">
            <PrefectureDetailPanel
              selectedCode={selectedCode}
              record={selectedCode ? records[selectedCode] : undefined}
              onUpdateStatus={updateStatus}
              onAddCity={addCity}
              onUpdateCity={updateCity}
              onDeleteCity={deleteCity}
              onUpdateDetails={updatePrefectureDetails}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          <p>© 2026 Japanlog — 일본 47개 도도부현 여행 방문 및 경유 시각화 웹앱</p>
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        title="전체 기록 초기화"
        message="저장된 모든 도도부현 방문 상태 및 도시 기록이 삭제됩니다. 초기화하시겠습니까?"
        confirmLabel="전체 초기화"
        cancelLabel="취소"
        onConfirm={() => {
          resetAll();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
};

export default App;
