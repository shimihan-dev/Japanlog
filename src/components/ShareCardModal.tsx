import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import type { TravelStats } from "../utils/statistics";
import type { TravelRecordsMap } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";
import { X, Download, Share2, Sparkles, MapPin, Navigation, Trophy, Copy, Check } from "lucide-react";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TravelStats;
  records: TravelRecordsMap;
  userName?: string;
}

type CardTheme = "midnight" | "sunset" | "light";

const REGION_ORDER = [
  "홋카이도",
  "도호쿠",
  "간토",
  "주부",
  "간사이",
  "주고쿠",
  "시코쿠",
  "큐슈",
  "오키나와",
];

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  stats,
  records,
  userName = "여행가",
}) => {
  const [theme, setTheme] = useState<CardTheme>("midnight");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Calculate per-region progress
  const regionProgress = REGION_ORDER.map((regionName) => {
    const prefsInRegion = PREFECTURES.filter((p) => p.region === regionName);
    const visitedInRegion = prefsInRegion.filter(
      (p) => records[p.code]?.status === "visited"
    ).length;
    const transitInRegion = prefsInRegion.filter(
      (p) => records[p.code]?.status === "transit"
    ).length;
    const totalInRegion = prefsInRegion.length;
    const pct = totalInRegion > 0 ? Math.round((visitedInRegion / totalInRegion) * 100) : 0;

    return {
      name: regionName,
      visited: visitedInRegion,
      transit: transitInRegion,
      total: totalInRegion,
      pct,
    };
  });

  // Get visited prefecture names list
  const visitedPrefNames = PREFECTURES.filter(
    (p) => records[p.code]?.status === "visited"
  ).map((p) => p.nameKo);

  const todayStr = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High DPI HD output
        useCORS: true,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `Japan_Travel_Log_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image card:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    const summaryText = `🇯🇵 나의 일본 여행 성취도: ${stats.achievementRate}% 달성!\n📍 방문: ${stats.visitedCount}/47개 현 (${visitedPrefNames.slice(0, 5).join(", ")}${visitedPrefNames.length > 5 ? " 외..." : ""})\n🚗 경유: ${stats.transitCount}개 현 | 🏙️ 도시: ${stats.totalCitiesCount}개 탐방\n#일본여행 #JapanTravelMap #도도부현`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0E1628] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                여행 성취 인포그래픽 카드 생성
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                나의 일본 탐방 기록을 예쁜 이미지 카드로 SNS에 공유해보세요!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls & Theme Switcher */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>카드 테마 선택:</span>
          </span>

          <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl gap-1">
            {[
              { id: "midnight", label: "🌙 딥 다크" },
              { id: "sunset", label: "🌅 후지산 노을" },
              { id: "light", label: "🌸 클린 라이트" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as CardTheme)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  theme === t.id
                    ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 font-extrabold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Live Preview Container */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center items-center bg-slate-100 dark:bg-[#070B14]">
          {/* Real Infographic Card Element captured by html2canvas */}
          <div
            ref={cardRef}
            className={`w-[420px] rounded-3xl p-6 shadow-2xl transition-all relative overflow-hidden text-slate-100 font-sans border ${
              theme === "midnight"
                ? "bg-gradient-to-br from-[#0B1120] via-[#0E1628] to-[#151D2A] text-slate-100 border-slate-800"
                : theme === "sunset"
                ? "bg-gradient-to-br from-[#2D1B36] via-[#4A1525] to-[#7C2D12] text-slate-100 border-amber-950/40"
                : "bg-gradient-to-br from-white via-slate-50 to-blue-50/40 text-slate-800 border-slate-200 shadow-xl"
            }`}
          >
            {/* Background Decorative Accents */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md font-extrabold text-sm">
                  日
                </div>
                <div>
                  <h3 className={`text-base font-extrabold tracking-tight ${theme === "light" ? "text-slate-900" : "text-white"}`}>
                    {userName}의 일본 여행 지도
                  </h3>
                  <span className={`text-[11px] font-medium opacity-80 ${theme === "light" ? "text-slate-500" : "text-slate-300"}`}>
                    Japan Travel Log • {todayStr}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                  theme === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                }`}>
                  EXPLORER
                </span>
              </div>
            </div>

            {/* Main Achievement Metric Hero */}
            <div className={`p-4 rounded-2xl mb-4 border flex items-center justify-between ${
              theme === "light"
                ? "bg-white border-slate-200/80 shadow-xs"
                : "bg-white/5 border-white/10 backdrop-blur-xs"
            }`}>
              <div className="space-y-1">
                <span className={`text-[11px] font-bold block ${theme === "light" ? "text-slate-500" : "text-slate-300"}`}>
                  전국 47개 도도부현 달성률
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black tracking-tight text-blue-500 dark:text-blue-400">
                    {stats.achievementRate}%
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1 justify-end text-xs font-bold">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>방문 {stats.visitedCount}현</span>
                  </div>
                  <div className={`flex items-center space-x-1 justify-end text-[11px] opacity-80 ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                    <Navigation className="w-3 h-3 text-emerald-400" />
                    <span>경유 {stats.transitCount}현</span>
                  </div>
                  <div className={`flex items-center space-x-1 justify-end text-[10px] opacity-75 ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>
                    <span>기록 도시 {stats.totalCitiesCount}개</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Progress Grid */}
            <div className="space-y-2 mb-4">
              <span className={`text-[11px] font-bold block ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                🗺️ 권역/지방별 탐방 현황
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                {regionProgress.map((r) => (
                  <div
                    key={r.name}
                    className={`p-2 rounded-xl border flex flex-col justify-between text-[10px] ${
                      r.visited > 0
                        ? theme === "light"
                          ? "bg-blue-50/80 border-blue-200 text-blue-950"
                          : "bg-blue-950/40 border-blue-500/40 text-blue-200"
                        : theme === "light"
                        ? "bg-slate-50 border-slate-200 text-slate-400"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{r.name}</span>
                      <span>{r.pct}%</span>
                    </div>
                    <div className="w-full bg-black/10 rounded-full h-1 mt-1 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visited Top Prefectures Badges */}
            {visitedPrefNames.length > 0 && (
              <div className="space-y-1.5 mb-4">
                <span className={`text-[11px] font-bold block ${theme === "light" ? "text-slate-600" : "text-slate-300"}`}>
                  📍 다녀온 정복 지역 ({visitedPrefNames.length}개)
                </span>
                <div className="flex flex-wrap gap-1 max-h-[85px] overflow-hidden">
                  {visitedPrefNames.slice(0, 12).map((name) => (
                    <span
                      key={name}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                        theme === "light"
                          ? "bg-white border-slate-200 text-slate-800 shadow-2xs"
                          : "bg-white/10 border-white/15 text-slate-200"
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                  {visitedPrefNames.length > 12 && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-600 text-white">
                      +{visitedPrefNames.length - 12}개 더보기
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Card Footer Stamp */}
            <div className={`pt-3 border-t flex items-center justify-between text-[10px] opacity-75 ${
              theme === "light" ? "border-slate-200 text-slate-500" : "border-white/10 text-slate-400"
            }`}>
              <div className="flex items-center space-x-1 font-semibold">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Japan Travel Map Achievements</span>
              </div>
              <span className="font-mono">japan-travel-map.app</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white dark:bg-[#0E1628] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "요약 텍스트 복사됨!" : "요약 텍스트 복사"}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`} />
            <span>{isExporting ? "카드 생성 중..." : "PNG 이미지 저장"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
