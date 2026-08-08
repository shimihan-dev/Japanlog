import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useTravelRecords } from "./hooks/useTravelRecords";
import { calculateTravelStats } from "./utils/statistics";
import { Header } from "./components/Header";
import { SmartQuickAddBar } from "./components/SmartQuickAddBar";
import { StatsCards } from "./components/StatsCards";
import { JapanMap } from "./components/JapanMap";
import { PrefectureList } from "./components/PrefectureList";
import { TravelTimeline } from "./components/TravelTimeline";
import { PrefectureDetailPanel } from "./components/PrefectureDetailPanel";
import { ConfirmModal } from "./components/ConfirmModal";
import { AuthModal } from "./components/AuthModal";

export const App: React.FC = () => {
  const {
    user,
    isConfigured,
    signInWithEmail,
    signUpWithEmail,
    sendMagicLink,
    signOut,
  } = useAuth();

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
  } = useTravelRecords(user);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("japan-travel-map-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("japan-travel-map-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("japan-travel-map-theme", "light");
    }
  }, [isDarkMode]);

  const stats = calculateTravelStats(records);

  const handleSelectPrefecture = (code: number) => {
    setSelectedCode(code);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA] dark:bg-[#0B0F17] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* App Header */}
      <Header
        isDarkMode={isDarkMode}
        user={user}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onLoadSample={loadSample}
        onReset={() => setShowResetModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSignOut={signOut}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* AI Smart Quick City Add Bar */}
        <SmartQuickAddBar
          onAddCity={addCity}
          onSelectPrefecture={handleSelectPrefecture}
        />

        {/* Top Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Prefecture List & Travel Timeline (3 cols) */}
          <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col">
            <PrefectureList
              records={records}
              selectedCode={selectedCode}
              onSelectPrefecture={handleSelectPrefecture}
            />
            <TravelTimeline
              records={records}
              selectedCode={selectedCode}
              onSelectPrefecture={handleSelectPrefecture}
            />
          </div>

          {/* Center Column: Japan Map (6 cols) */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center">
            <JapanMap
              records={records}
              selectedCode={selectedCode}
              onSelectPrefecture={handleSelectPrefecture}
              isDarkMode={isDarkMode}
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
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#111827] py-4 mt-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>© 2026 Japanlog — 일본 47개 도도부현 여행 방문 및 경유 시각화 웹앱</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        isConfigured={isConfigured}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signInWithEmail}
        onSignUp={signUpWithEmail}
        onMagicLink={sendMagicLink}
      />

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
