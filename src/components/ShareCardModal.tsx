import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import type { TravelStats } from "../utils/statistics";
import type { TravelRecordsMap } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";
import { X, Download, MapPin, Navigation, Copy, Check, Sparkles } from "lucide-react";
import { LandingSticker } from "./LandingSticker";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: TravelStats;
  records: TravelRecordsMap;
  userName?: string;
}

type CardTheme = "midnight" | "sunset" | "washi";

const REGION_DATA: { name: string; kanji: string }[] = [
  { name: "홋카이도", kanji: "北海道" },
  { name: "도호쿠", kanji: "東北" },
  { name: "간토", kanji: "関東" },
  { name: "주부", kanji: "中部" },
  { name: "간사이", kanji: "関西" },
  { name: "주고쿠", kanji: "中国" },
  { name: "시코쿠", kanji: "四국" },
  { name: "큐슈", kanji: "九州" },
  { name: "오키나와", kanji: "沖縄" },
];

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  stats,
  records,
  userName = "여행가",
}) => {
  const [theme, setTheme] = useState<CardTheme>("washi");
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Calculate per-region progress
  const regionProgress = REGION_DATA.map((rData) => {
    const prefsInRegion = PREFECTURES.filter((p) => p.region === rData.name);
    const visitedInRegion = prefsInRegion.filter(
      (p) => records[p.code]?.status === "visited"
    ).length;
    const transitInRegion = prefsInRegion.filter(
      (p) => records[p.code]?.status === "transit"
    ).length;
    const totalInRegion = prefsInRegion.length;
    const pct = totalInRegion > 0 ? Math.round((visitedInRegion / totalInRegion) * 100) : 0;

    return {
      name: rData.name,
      kanji: rData.kanji,
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
      link.download = `Japanlog_Passport_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image card:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    const summaryText = `🗾 Japanlog 나의 일본 여정 성취도: ${stats.achievementRate}% 달성!\n📍 방문: ${stats.visitedCount}/47개 현 (${visitedPrefNames.slice(0, 5).join(", ")}${visitedPrefNames.length > 5 ? " 외..." : ""})\n🚄 경유: ${stats.transitCount}개 현 | 🏙️ 기록 도시: ${stats.totalCitiesCount}개 탐방\n#Japanlog #일본여행 #도도부현 #여행지도`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FBF9F5] dark:bg-[#0C1017] border border-[#E8E3D8] dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Editorial Header */}
        <div className="px-6 py-4 border-b border-[#E8E3D8] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E63946] text-white flex items-center justify-center shadow-2xs font-serif-jp text-lg font-bold">
              旅
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-jp text-slate-900 dark:text-slate-100">
                여행 성취 인포그래픽 여권 카드
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                나의 일본 탐방 기록을 에디토리얼 이미지 카드로 SNS에 공유해보세요!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls & Theme Switcher */}
        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-b border-[#E8E3D8] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400 flex items-center space-x-1 font-serif-jp">
            <Sparkles className="w-4 h-4 text-[#E63946]" />
            <span>여권 테마 선택:</span>
          </span>

          <div className="flex bg-[#FBF9F5] dark:bg-slate-800 p-1 rounded-xl gap-1 border border-[#E8E3D8] dark:border-slate-700">
            {[
              { id: "washi", label: "🍱 화시 크림 (Washi Paper)" },
              { id: "midnight", label: "🌌 스미 묵색 (Sumi Ink)" },
              { id: "sunset", label: "🌅 후지산 노을 (Red-Gold)" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as CardTheme)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-serif-jp ${
                  theme === t.id
                    ? "bg-[#E63946] text-white font-bold shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card Live Preview Container */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center items-center bg-slate-200/50 dark:bg-[#070B14]">
          {/* Real Infographic Card Element captured by html2canvas */}
          <div
            ref={cardRef}
            className={`w-[420px] rounded-3xl p-6 shadow-2xl transition-all relative overflow-hidden font-sans border ${
              theme === "washi"
                ? "bg-[#FBF9F5] text-slate-900 border-[#E8E3D8]"
                : theme === "midnight"
                ? "bg-gradient-to-br from-[#0C1017] via-[#111726] to-[#182238] text-slate-100 border-slate-800"
                : "bg-gradient-to-br from-[#2D1B36] via-[#4A1525] to-[#7C2D12] text-slate-100 border-amber-950/40"
            }`}
          >
            {/* Ticket Perforation Motif Top Bar */}
            <div className="flex items-center justify-between text-[9px] font-sans-outfit border-b border-dashed border-slate-300 dark:border-slate-700 pb-2 mb-3">
              <span className={`font-mono font-bold tracking-wider ${theme === "washi" ? "text-[#E63946]" : "text-[#FF5A65]"}`}>
                🎫 JPN-PASSPORT • RECORD NO. 47
              </span>
              <span className="font-serif-jp text-slate-400">日本旅録 Official Stamp</span>
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4 mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#E63946] text-white flex items-center justify-center shadow-md font-serif-jp text-lg font-bold">
                  旅
                </div>
                <div>
                  <h3 className={`text-base font-bold font-serif-jp tracking-tight ${theme === "washi" ? "text-slate-900" : "text-white"}`}>
                    {userName}의 일본 여행 지록
                  </h3>
                  <span className={`text-[11px] font-medium ${theme === "washi" ? "text-slate-500" : "text-slate-300"}`}>
                    Japanlog Passport • {todayStr}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[10px] font-bold font-serif-jp tracking-wider px-2.5 py-1 rounded-lg border ${
                  theme === "washi"
                    ? "bg-red-50 text-[#E63946] border-red-200"
                    : "bg-red-950/80 text-[#FF5A65] border-red-900"
                }`}>
                  済 ENTRY
                </span>
              </div>
            </div>

            {/* Official Japanese Passport Landing Permission Sticker Element */}
            <div className="mb-4 transform -rotate-1 shadow-sm">
              <LandingSticker portName="JAPAN IMMIGRATION" dateStr={todayStr} />
            </div>

            {/* Main Achievement Metric Hero */}
            <div className={`p-4 rounded-2xl mb-4 border flex items-center justify-between ${
              theme === "washi"
                ? "bg-white border-[#E8E3D8] shadow-2xs"
                : "bg-white/5 border-white/10"
            }`}>
              <div className="space-y-1">
                <span className={`text-[11px] font-bold font-serif-jp block ${theme === "washi" ? "text-slate-500" : "text-slate-300"}`}>
                  일본 열도 47개 도도부현 달성률
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black font-sans-outfit text-[#E63946] dark:text-[#FF5A65]">
                    {stats.achievementRate}%
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1 justify-end text-xs font-bold font-serif-jp">
                    <MapPin className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>방문 {stats.visitedCount}현</span>
                  </div>
                  <div className={`flex items-center space-x-1 justify-end text-[11px] font-serif-jp ${theme === "washi" ? "text-slate-600" : "text-slate-300"}`}>
                    <Navigation className="w-3 h-3 text-[#192F52]" />
                    <span>경유 {stats.transitCount}현</span>
                  </div>
                  <div className={`flex items-center space-x-1 justify-end text-[10px] ${theme === "washi" ? "text-slate-500" : "text-slate-400"}`}>
                    <span>기록 도시 {stats.totalCitiesCount}개</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Progress Grid */}
            <div className="space-y-2 mb-4">
              <span className={`text-[11px] font-bold font-serif-jp block ${theme === "washi" ? "text-slate-700" : "text-slate-200"}`}>
                🗺️ 권역/지방별 탐방 현황
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                {regionProgress.map((r) => (
                  <div
                    key={r.name}
                    className={`p-2 rounded-xl border flex flex-col justify-between text-[10px] ${
                      r.visited > 0
                        ? theme === "washi"
                          ? "bg-red-50/80 border-red-200 text-slate-900 font-bold"
                          : "bg-red-950/40 border-red-900/60 text-white font-bold"
                        : theme === "washi"
                        ? "bg-white border-slate-200/80 text-slate-400"
                        : "bg-white/5 border-white/5 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between font-serif-jp">
                      <span>{r.name}</span>
                      <span className="font-sans-outfit font-bold text-[#E63946]">{r.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div
                        className="bg-[#E63946] h-full rounded-full transition-all"
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
                <span className={`text-[11px] font-bold font-serif-jp block ${theme === "washi" ? "text-slate-700" : "text-slate-200"}`}>
                  📍 탐색 완료 도도부현 ({visitedPrefNames.length}개)
                </span>
                <div className="flex flex-wrap gap-1 max-h-[85px] overflow-hidden">
                  {visitedPrefNames.slice(0, 12).map((name) => (
                    <span
                      key={name}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-serif-jp border ${
                        theme === "washi"
                          ? "bg-red-50 border-red-200/80 text-[#E63946]"
                          : "bg-white/10 border-white/15 text-slate-200"
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                  {visitedPrefNames.length > 12 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E63946] text-white font-serif-jp">
                      +{visitedPrefNames.length - 12}개 더보기
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Card Footer Stamp */}
            <div className={`pt-3 border-t flex items-center justify-between text-[10px] font-serif-jp ${
              theme === "washi" ? "border-slate-200 text-slate-500" : "border-white/10 text-slate-400"
            }`}>
              <div className="flex items-center space-x-1.5 font-bold">
                <span className="text-[#E63946]">日本旅録</span>
                <span>•</span>
                <span>Japanlog Passport</span>
              </div>
              <span className="font-mono text-slate-400">japanlog.app</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#FBF9F5] dark:bg-[#0C1017] border-t border-[#E8E3D8] dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer font-serif-jp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "요약 텍스트 복사됨!" : "요약 텍스트 복사"}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#D92534] text-white font-bold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50 font-serif-jp"
          >
            <Download className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`} />
            <span>{isExporting ? "카드 생성 중..." : "PNG 카드 저장"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
