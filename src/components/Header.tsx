import React, { useState, useRef, useEffect } from "react";
import { RotateCcw, Sparkles, Sun, Moon, User as UserIcon, LogOut, Cloud, Share2, Calendar, Settings, ChevronDown } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  isDarkMode: boolean;
  user: User | null;
  onToggleDarkMode: () => void;
  onLoadSample: () => void;
  onReset: () => void;
  onClearDates?: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onOpenShareModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  user,
  onToggleDarkMode,
  onLoadSample,
  onReset,
  onClearDates,
  onOpenAuthModal,
  onSignOut,
  onOpenShareModal,
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close tools dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#FBF9F5]/90 dark:bg-[#0C1017]/90 border-b border-[#E8E3D8] dark:border-slate-800/80 sticky top-0 z-30 backdrop-blur-md transition-colors duration-250">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Editorial Brand Header */}
        <div className="flex items-center space-x-3">
          {/* Japanese Stamp Red Seal Logo Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#E63946] dark:bg-[#FF5A65] flex items-center justify-center text-white shadow-2xs shrink-0 font-serif-jp text-lg font-bold">
            旅
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif-jp text-xs px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950/60 text-[#E63946] dark:text-[#FF5A65] font-extrabold border border-red-200/60 dark:border-red-900/60">
                日本旅録
              </span>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans-outfit">
                Japanlog <span className="text-xs font-normal text-slate-400 font-serif-jp">｜ 일본 여행 지도</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
              47개 도도부현 방문 기록과 추억을 수집하는 나만의 여행 에디토리얼
            </p>
          </div>
        </div>

        {/* Clean Editorial Action Controls */}
        <div className="flex items-center gap-2">
          {/* Primary CTA: Share Achievement Card */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#E63946] hover:bg-[#D92534] rounded-xl transition-all shadow-2xs cursor-pointer font-sans"
              title="여행 성취 인포그래픽 카드 생성 & PNG 저장"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>성취 카드 공유</span>
            </button>
          )}

          {/* User Auth */}
          {user ? (
            <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 p-1 pl-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <Cloud className="w-3.5 h-3.5 text-[#E63946] dark:text-cyan-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] sm:max-w-[130px] truncate font-sans" title={user.email}>
                {user.email}
              </span>
              <button
                onClick={onSignOut}
                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200/80 dark:border-slate-800 cursor-pointer font-sans"
            >
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>동기화</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200/80 dark:border-slate-800 cursor-pointer"
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Unified Tools & Management Dropdown Menu */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsToolsOpen((prev) => !prev)}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200/80 dark:border-slate-800 cursor-pointer font-sans"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">도구</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isToolsOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-xl py-1.5 z-40 space-y-0.5 animate-in fade-in duration-100 font-sans">
                <button
                  onClick={() => {
                    onLoadSample();
                    setIsToolsOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-red-50/60 dark:hover:bg-slate-800 text-left cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>샘플 데이터 로드</span>
                </button>

                {onClearDates && (
                  <button
                    onClick={() => {
                      onClearDates();
                      setIsToolsOpen(false);
                    }}
                    className="w-full px-3 py-2 flex items-center space-x-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>날짜만 초기화</span>
                  </button>
                )}

                <div className="border-t border-slate-200/60 dark:border-slate-800 my-1" />

                <button
                  onClick={() => {
                    onReset();
                    setIsToolsOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center space-x-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>전체 초기화</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
