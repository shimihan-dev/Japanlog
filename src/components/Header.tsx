import React from "react";
import { RotateCcw, Sparkles, Sun, Moon, User as UserIcon, LogOut, Cloud, Share2, Calendar } from "lucide-react";
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
  return (
    <header className="bg-[#FBF9F5]/90 dark:bg-[#0C1017]/90 border-b border-[#E8E3D8] dark:border-slate-800/80 sticky top-0 z-30 backdrop-blur-md transition-colors duration-250">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Editorial Brand Header */}
        <div className="flex items-center space-x-3">
          {/* Japanese Stamp Red Seal Logo Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#E63946] dark:bg-[#FF5A65] flex items-center justify-center text-white shadow-sm shrink-0 font-serif-jp text-lg font-bold">
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

        {/* Editorial Action Buttons & Auth & Theme Toggle */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Share Achievement Card Button */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#E63946] hover:bg-[#D92534] dark:bg-[#E63946] dark:hover:bg-[#FF5A65] rounded-xl transition-all shadow-2xs cursor-pointer"
              title="여행 성취 인포그래픽 카드 생성 & PNG 저장"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>성취 카드 공유</span>
            </button>
          )}

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 pl-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <Cloud className="w-3.5 h-3.5 text-[#E63946] dark:text-cyan-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] sm:max-w-[140px] truncate" title={user.email}>
                {user.email}
              </span>
              <button
                onClick={onSignOut}
                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>로그인 / 동기화</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200/80 dark:border-slate-700 cursor-pointer"
            title={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">라이트 모드</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden sm:inline">다크 모드</span>
              </>
            )}
          </button>

          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">샘플 데이터</span>
          </button>

          {onClearDates && (
            <button
              onClick={onClearDates}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/80 rounded-xl transition-colors border border-amber-200/70 dark:border-amber-800/70 cursor-pointer"
              title="도시 핀과 기록은 유지하고, 다녀온 날짜 기록만 초기화합니다."
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">날짜만 초기화</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">전체 초기화</span>
          </button>
        </div>
      </div>
    </header>
  );
};
