import React, { useState } from "react";
import type { TravelRecordsMap, Trip } from "../types/travel";
import { saveTravelRecords, saveTrips } from "../utils/storage";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { X, Download, Upload, Copy, Check, RefreshCw, Database, Cloud } from "lucide-react";

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: TravelRecordsMap;
  trips: Trip[];
  onDataRestored: () => void;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({
  isOpen,
  onClose,
  records,
  trips,
  onDataRestored,
}) => {
  const [importJsonText, setImportJsonText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const exportDataObj = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    records,
    trips: trips.filter((t) => !t.id.startsWith("trip-sample-")),
  };

  const jsonString = JSON.stringify(exportDataObj, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJsonFile = () => {
    const dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const link = document.createElement("a");
    link.download = `Japanlog_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.href = dataUrl;
    link.click();
  };

  const handleCloudPush = async () => {
    if (!isSupabaseConfigured) {
      setStatusMessage({ type: "error", text: "Supabase 연동이 설정되지 않았습니다." });
      return;
    }

    try {
      setIsPushing(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (!currentUser) {
        setStatusMessage({ type: "error", text: "상단 '동기화' 버튼을 눌러 계정에 먼저 로그인해 주세요." });
        setIsPushing(false);
        return;
      }

      const userTrips = trips.filter((t) => !t.id.startsWith("trip-sample-"));
      await supabase.from("user_travel_records").upsert({
        user_id: currentUser.id,
        records: records,
        trips: userTrips,
        updated_at: new Date().toISOString(),
      });

      setStatusMessage({ type: "success", text: "☁️ 데스크톱 모든 기록이 클라우드로 전송되었습니다! 모바일에서 새로고침하세요." });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      console.error("Cloud push failed:", err);
      setStatusMessage({ type: "error", text: "클라우드 전송 중 오류가 발생했습니다." });
    } finally {
      setIsPushing(false);
    }
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      setStatusMessage({ type: "error", text: "가져올 JSON 데이터 코드를 붙여넣어 주세요." });
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText.trim());
      if (parsed.records) {
        saveTravelRecords(parsed.records);
      }
      if (parsed.trips && Array.isArray(parsed.trips)) {
        saveTrips(parsed.trips);
      }

      onDataRestored();
      setStatusMessage({ type: "success", text: "✅ 백업 데이터가 성공적으로 이식되었습니다!" });
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to parse imported JSON:", err);
      setStatusMessage({ type: "error", text: "올바르지 않은 JSON 데이터 형식을 붙여넣으셨습니다." });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FBF9F5] dark:bg-[#0C1017] border border-[#E8E3D8] dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E3D8] dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#192F52] text-white flex items-center justify-center shadow-2xs font-serif-jp text-lg font-bold">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif-jp text-slate-900 dark:text-slate-100">
                기기 간 데이터 백업 & 연동 (JSON Sync)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                데스크톱에서 작성한 여행 기록을 모바일로 1초 만에 가져오세요!
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

        {/* Status Message */}
        {statusMessage && (
          <div className={`px-6 py-2.5 text-xs font-bold text-center ${
            statusMessage.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Section 1: Cloud Force Push */}
          <div className="space-y-2.5 bg-red-50/60 dark:bg-red-950/30 p-4 rounded-2xl border border-red-200/60 dark:border-red-900/60">
            <div className="flex items-center justify-between">
              <span className="font-bold font-serif-jp text-[#E63946] dark:text-[#FF5A65] text-xs flex items-center gap-1.5">
                <Cloud className="w-4 h-4" />
                <span>1. 클라우드에 내 데스크톱 모든 데이터 즉시 전송</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              데스크톱에서 작성한 여행 회차({trips.filter((t) => !t.id.startsWith("trip-sample-")).length}개) 및 지도 현 기록을 계정 클라우드로 전송합니다.
            </p>

            <button
              type="button"
              onClick={handleCloudPush}
              disabled={isPushing}
              className="w-full py-2.5 px-3 bg-[#E63946] hover:bg-[#D92534] text-white rounded-xl font-bold font-serif-jp flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs text-xs disabled:opacity-50"
            >
              <Cloud className={`w-4 h-4 ${isPushing ? "animate-bounce" : ""}`} />
              <span>{isPushing ? "클라우드 전송 중..." : "☁️ 데스크톱 모든 기록 클라우드로 동기화"}</span>
            </button>
          </div>

          {/* Section 2: Export */}
          <div className="space-y-2.5 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E8E3D8] dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold font-serif-jp text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                <Download className="w-4 h-4 text-[#E63946]" />
                <span>2. 파일/텍스트 백업 코드</span>
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold font-serif-jp flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "백업 코드 복사됨!" : "백업 코드 복사"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJsonFile}
                className="flex-1 py-2 px-3 bg-[#192F52] hover:bg-[#11213B] text-white rounded-xl font-bold font-serif-jp flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>JSON 파일 다운로드</span>
              </button>
            </div>
          </div>

          {/* Section 3: Import */}
          <div className="space-y-2.5 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E8E3D8] dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold font-serif-jp text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#E63946]" />
                <span>3. 백업 수동 붙여넣기 (Import)</span>
              </span>
            </div>

            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="여기에 복사한 JSON 백업 코드를 붙여넣으세요..."
              className="w-full p-2.5 bg-[#FBF9F5] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-mono text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-[#E63946] outline-none"
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <label className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold font-serif-jp flex items-center space-x-1.5 cursor-pointer text-[11px]">
                <Upload className="w-3.5 h-3.5" />
                <span>.json 파일 선택</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                onClick={handleImportJson}
                className="py-2 px-4 bg-[#E63946] hover:bg-[#D92534] text-white rounded-xl font-bold font-serif-jp flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs text-[11px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>데이터 수동 복원하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
