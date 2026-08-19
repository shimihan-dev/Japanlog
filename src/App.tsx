import React, { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { StatsCards } from "./components/StatsCards";
import { JapanMap } from "./components/JapanMap";
import { LeftSidebarTabs } from "./components/LeftSidebarTabs";
import { PrefectureDetailPanel } from "./components/PrefectureDetailPanel";
import { RegionOverview } from "./components/RegionOverview";
import { TravelInsights } from "./components/TravelInsights";
import { TravelUtilityWidget } from "./components/TravelUtilityWidget";
import { SmartQuickAddBar } from "./components/SmartQuickAddBar";
import { TripModal } from "./components/TripModal";
import { AuthModal } from "./components/AuthModal";
import { ShareCardModal } from "./components/ShareCardModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { DataSyncModal } from "./components/DataSyncModal";
import { useTravelRecords } from "./hooks/useTravelRecords";
import { useTrips } from "./hooks/useTrips";
import { calculateTravelStats } from "./utils/statistics";
import { useAuth } from "./hooks/useAuth";
import type { Trip } from "./types/travel";

export const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("japan-travel-map-theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const { user, isConfigured, signInWithEmail, signUpWithEmail, sendMagicLink, signOut } = useAuth();

  const {
    records,
    selectedCode,
    setSelectedCode,
    updateStatus,
    addCity,
    updateCity,
    deleteCity,
    updatePrefectureDetails,
    clearAllCityVisitDates,
    loadSample,
    resetAll,
  } = useTravelRecords(user);

  const { trips, addTrip, updateTrip, deleteTrip } = useTrips(user);

  const stats = useMemo(() => calculateTravelStats(records), [records]);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"integrated" | "map" | "list">("integrated");

  const [showTripModal, setShowTripModal] = useState<boolean>(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [tripModalMode, setTripModalMode] = useState<"existing" | "new">("new");

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showDataSyncModal, setShowDataSyncModal] = useState<boolean>(false);
  const [showSampleModal, setShowSampleModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showClearDatesModal, setShowClearDatesModal] = useState<boolean>(false);

  // Sync dark mode class with <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("japan-travel-map-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("japan-travel-map-theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || null;

  const handleSelectPrefecture = (code: number) => {
    setSelectedCode(code);
  };

  const handleSelectRegion = (regionName: string | null) => {
    setSelectedRegion(regionName);
  };

  const handleSaveTrip = (tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">) => {
    if (editingTrip) {
      updateTrip(editingTrip.id, tripData);
    } else {
      addTrip(tripData);
    }

    // Auto-color map prefectures as "visited" (파란색 색칠) for selected trip prefectures
    if (tripData.prefectures && tripData.prefectures.length > 0) {
      tripData.prefectures.forEach((prefCode) => {
        updateStatus(prefCode, "visited");
      });
    }

    // Auto-pin cities on the map
    if (tripData.cities && tripData.cities.length > 0) {
      tripData.cities.forEach((c) => {
        addCity(c.prefectureCode, { cityNameKo: c.cityNameKo });
      });
    }
  };

  const handleDataRestored = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0C1017] text-slate-900 dark:text-slate-100 transition-colors duration-250 font-sans selection:bg-[#E63946] selection:text-white">
      {/* Editorial Header */}
      <Header
        isDarkMode={isDarkMode}
        user={user}
        onToggleDarkMode={toggleDarkMode}
        onLoadSample={() => setShowSampleModal(true)}
        onReset={() => setShowResetModal(true)}
        onClearDates={() => setShowClearDatesModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onSignOut={signOut}
        onOpenShareModal={() => setShowShareModal(true)}
        onOpenDataSyncModal={() => setShowDataSyncModal(true)}
      />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
        {/* Smart Quick Search & Add Bar */}
        <SmartQuickAddBar
          onSelectPrefecture={handleSelectPrefecture}
          onAddCity={addCity}
        />

        {/* Integrated Editorial Travel Metrics Ribbon */}
        <StatsCards stats={stats} />

        {/* Mobile View Switcher Tabs (< lg screens) */}
        <div className="lg:hidden flex bg-white dark:bg-slate-900 p-1 rounded-2xl text-xs font-bold shadow-2xs border border-[#E8E3D8] dark:border-slate-800 mb-2">
          <button
            type="button"
            onClick={() => setMobileTab("integrated")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1 font-serif-jp ${
              mobileTab === "integrated"
                ? "bg-[#E63946] text-white font-extrabold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <span>📱 지도+목록 한눈에</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab("map")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1 font-serif-jp ${
              mobileTab === "map"
                ? "bg-[#E63946] text-white font-extrabold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <span>🗾 지도 중심</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab("list")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center space-x-1 font-serif-jp ${
              mobileTab === "list"
                ? "bg-[#E63946] text-white font-extrabold shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <span>📋 목록 중심</span>
          </button>
        </div>

        {/* Responsive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Integrated Sidebar Sub-tabs & Travel Utility Toolkit (3 cols on desktop) */}
          <div className={`lg:col-span-3 order-2 lg:order-1 flex-col space-y-4 ${
            mobileTab === "integrated" || mobileTab === "list" ? "flex" : "hidden lg:flex"
          }`}>
            <TravelUtilityWidget selectedCode={selectedCode} />
            <LeftSidebarTabs
              records={records}
              trips={trips}
              selectedTripId={selectedTripId}
              selectedCode={selectedCode}
              selectedRegion={selectedRegion}
              onSelectPrefecture={handleSelectPrefecture}
              onSelectTrip={(id) => setSelectedTripId(id)}
              onOpenCreateTripModal={(mode) => {
                setEditingTrip(null);
                setTripModalMode(mode);
                setShowTripModal(true);
              }}
              onEditTrip={(trip) => {
                setEditingTrip(trip);
                setShowTripModal(true);
              }}
              onDeleteTrip={(id) => deleteTrip(id)}
              onClearRegion={() => setSelectedRegion(null)}
            />
          </div>

          {/* Center Column: Japan Map & Region Overview (6 cols on desktop) */}
          <div className={`lg:col-span-6 order-1 lg:order-2 flex-col items-center space-y-4 ${
            mobileTab === "integrated" || mobileTab === "map" ? "flex" : "hidden lg:flex"
          }`}>
            <JapanMap
              records={records}
              selectedCode={selectedCode}
              selectedRegion={selectedRegion}
              selectedTrip={selectedTrip}
              trips={trips}
              onSelectPrefecture={handleSelectPrefecture}
              onClearRegion={() => setSelectedRegion(null)}
              onClearTrip={() => setSelectedTripId(null)}
              isDarkMode={isDarkMode}
            />
            <RegionOverview
              records={records}
              selectedRegion={selectedRegion}
              onSelectRegion={handleSelectRegion}
            />
          </div>

          {/* Right Column: Prefecture Detail Panel & Travel Insights (3 cols) */}
          <div className={`lg:col-span-3 order-3 lg:order-3 flex-col space-y-4 ${
            mobileTab === "integrated" || mobileTab === "map" ? "flex" : "hidden lg:flex"
          }`}>
            <PrefectureDetailPanel
              selectedCode={selectedCode}
              record={selectedCode ? records[selectedCode] : undefined}
              trips={trips}
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
      <footer className="border-t border-[#E8E3D8] dark:border-slate-800 bg-[#FFFFFF] dark:bg-[#111827] py-4 mt-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 dark:text-slate-500 font-serif-jp">
          <p>© 2026 Japanlog — 일본 47개 도도부현 여행 방문 및 경유 시각화 에디토리얼 웹앱</p>
        </div>
      </footer>

      {/* Trip Modal */}
      <TripModal
        isOpen={showTripModal}
        onClose={() => {
          setShowTripModal(false);
          setEditingTrip(null);
        }}
        onSave={handleSaveTrip}
        editingTrip={editingTrip}
        records={records}
        initialMode={tripModalMode}
      />

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
        userName="여행가"
      />

      {/* Data Sync & JSON Backup Modal */}
      <DataSyncModal
        isOpen={showDataSyncModal}
        onClose={() => setShowDataSyncModal(false)}
        records={records}
        trips={trips}
        onDataRestored={handleDataRestored}
      />

      {/* Sample Load Confirmation Modal */}
      <ConfirmModal
        isOpen={showSampleModal}
        title="샘플 데이터 불러오기 ⚠️"
        message="현재 작성 중인 내 여행 기록이 샘플 데이터로 교체됩니다. 계속하시겠습니까?"
        confirmLabel="샘플 불러오기"
        cancelLabel="취소 (내 기록 유지)"
        onConfirm={() => {
          loadSample();
          setShowSampleModal(false);
        }}
        onCancel={() => setShowSampleModal(false)}
      />

      {/* Clear Dates Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearDatesModal}
        title="도시별 방문 날짜만 초기화"
        message="지도 위의 방문 현 상태와 도시 핀은 그대로 유지하고, 도시별 다녀온 날짜 기록만 초기화하시겠습니까?"
        confirmLabel="날짜만 초기화"
        cancelLabel="취소"
        onConfirm={() => {
          clearAllCityVisitDates();
          setShowClearDatesModal(false);
        }}
        onCancel={() => setShowClearDatesModal(false)}
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
