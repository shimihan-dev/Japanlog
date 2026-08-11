import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useTravelRecords } from "./hooks/useTravelRecords";
import { calculateTravelStats } from "./utils/statistics";
import { Header } from "./components/Header";
import { SmartQuickAddBar } from "./components/SmartQuickAddBar";
import { StatsCards } from "./components/StatsCards";
import { JapanMap } from "./components/JapanMap";
import { LeftSidebarTabs } from "./components/LeftSidebarTabs";
import { RegionOverview } from "./components/RegionOverview";
import { TravelInsights } from "./components/TravelInsights";
import { PrefectureDetailPanel } from "./components/PrefectureDetailPanel";
import { ConfirmModal } from "./components/ConfirmModal";
import { AuthModal } from "./components/AuthModal";
import { ShareCardModal } from "./components/ShareCardModal";

import { PREFECTURES } from "./data/prefectures";

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("japan-travel-map-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("japan-travel-map-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("japan-travel-map-theme", "light");
    }
  }, [isDarkMode]);

  const stats = calculateTravelStats(records);

  const handleSelectPrefecture = (code: number) => {
    setSelectedCode(code);
  };

  const handleSelectRegion = (regionName: string) => {
    if (selectedRegion === regionName) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(regionName);
      const firstPref = PREFECTURES.find((p) => p.region === regionName);
      if (firstPref) setSelectedCode(firstPref.code);
    }
  };

  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

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
        onOpenShareModal={() => setShowShareModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* AI Smart Quick City Add Bar */}
        <SmartQuickAddBar
          onAddCity={addCity}
          onSelectPrefecture={handleSelectPrefecture}
        />

        {/* Top Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Mobile View Switcher Tabs (< lg screens) */}
        <div className="lg:hidden flex bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-bold shadow-xs mb-2">
          <button
            type="button"
            onClick={() => setMobileTab("map")}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
              mobileTab === "map"
                ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-900 shadow-sm font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <span>🗾 일본 지도 & 상세</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
              mobileTab === "list"
                ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-900 shadow-sm font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <span>📋 도도부현 리스트 & 타임라인</span>
          </button>
        </div>

        {/* Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Integrated Sidebar Sub-tabs (3 cols on desktop, visible on mobile when mobileTab === 'list') */}
          <div className={`lg:col-span-3 order-2 lg:order-1 flex-col ${mobileTab === "list" ? "flex" : "hidden lg:flex"}`}>
            <LeftSidebarTabs
              records={records}
              selectedCode={selectedCode}
              selectedRegion={selectedRegion}
              onSelectPrefecture={handleSelectPrefecture}
              onClearRegion={() => setSelectedRegion(null)}
            />
          </div>

          {/* Center Column: Japan Map & Region Overview (6 cols on desktop, visible on mobile when mobileTab === 'map') */}
          <div className={`lg:col-span-6 order-1 lg:order-2 flex-col items-center ${mobileTab === "map" ? "flex" : "hidden lg:flex"}`}>
            <JapanMap
              records={records}
              selectedCode={selectedCode}
              selectedRegion={selectedRegion}
              onSelectPrefecture={handleSelectPrefecture}
              onClearRegion={() => setSelectedRegion(null)}
              isDarkMode={isDarkMode}
            />
            <RegionOverview
              records={records}
              selectedRegion={selectedRegion}
              onSelectRegion={handleSelectRegion}
            />
          </div>

          {/* Right Column: Prefecture Detail Panel & Travel Insights (3 cols) */}
          <div className={`lg:col-span-3 order-3 lg:order-3 flex-col ${mobileTab === "map" ? "flex" : "hidden lg:flex"}`}>
            <PrefectureDetailPanel
              selectedCode={selectedCode}
              record={selectedCode ? records[selectedCode] : undefined}
              onUpdateStatus={updateStatus}
              onAddCity={addCity}
              onUpdateCity={updateCity}
              onDeleteCity={deleteCity}
              onUpdateDetails={updatePrefectureDetails}
            />
            <TravelInsights
              records={records}
              onSelectPrefecture={handleSelectPrefecture}
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

      {/* Share Infographic Card Modal */}
      <ShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        stats={stats}
        records={records}
        userName={user?.email ? user.email.split("@")[0] : "여행가"}
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
