import React from "react";
import { Map, RotateCcw, Sparkles, Sun, Moon } from "lucide-react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLoadSample: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onLoadSample,
  onReset,
}) => {
  return (
    <header className="bg-white dark:bg-[#111827]/90 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 shadow-sm backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Title Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 dark:shadow-cyan-500/20">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-4 h-3 bg-red-500 rounded-sm shadow-sm relative overflow-hidden border border-slate-200 dark:border-slate-700" title="Japan Flag">
                <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-red-600 rounded-full" />
              </span>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">일본 여행 지도</h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">내가 방문하고 경유한 일본 47개 도도부현 기록</p>
          </div>
        </div>

        {/* Quick Actions & Theme Toggle */}
        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all border border-slate-200/80 dark:border-slate-700 shadow-xs"
            title={isDarkMode ? "라이트 모드로 전환" : "네온 다크 모드로 전환"}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>라이트 모드</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-500" />
                <span>네온 다크 모드</span>
              </>
            )}
          </button>

          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/40 hover:bg-blue-100 dark:hover:bg-cyan-950/80 rounded-lg transition-colors border border-blue-200/60 dark:border-cyan-800/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>샘플 데이터</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        </div>
      </div>
    </header>
  );
};

