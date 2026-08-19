import React, { useState, useRef, useEffect } from "react";
import { findMatchingCity, searchCitySuggestions, type CityMatchResult } from "../utils/cityMatcher";
import { Sparkles, MapPin, Plus, CheckCircle2, ArrowRight } from "lucide-react";

interface SmartQuickAddBarProps {
  onAddCity: (prefectureCode: number, cityData: { cityNameKo: string; cityNameJa?: string; notes?: string }) => void;
  onSelectPrefecture: (code: number) => void;
}

export const SmartQuickAddBar: React.FC<SmartQuickAddBarProps> = ({
  onAddCity,
  onSelectPrefecture,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityMatchResult[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update suggestions on query change
  useEffect(() => {
    if (query.trim().length >= 1) {
      const matched = searchCitySuggestions(query, 5);
      setSuggestions(matched);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (result: CityMatchResult) => {
    // 1. Add city to prefecture
    onAddCity(result.prefectureCode, {
      cityNameKo: result.cityNameKo,
      cityNameJa: result.cityNameJa || undefined,
      notes: result.category ? `${result.category} (${result.matchedName})` : undefined,
    });

    // 2. Select prefecture on map
    onSelectPrefecture(result.prefectureCode);

    // 3. Show Toast notification
    setToastMessage(`✨ '${result.cityNameKo}' ➔ ${result.prefectureNameKo} 방문 완료로 자동 등록되었습니다!`);
    setTimeout(() => setToastMessage(null), 3500);

    // Reset input
    setQuery("");
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const matched = findMatchingCity(query);
    if (matched) {
      handleSelectResult(matched);
    } else {
      // Fallback: If no direct match found, prompt toast alert
      setToastMessage(`⚠️ '${query}'에 해당하는 도도부현을 자동 매칭하지 못했습니다. 왼쪽 목록에서 현을 먼저 선택해주세요.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full mb-6 z-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-3 p-3 bg-[#E63946] text-white rounded-xl shadow-md flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white text-xs underline font-normal ml-2 cursor-pointer"
          >
            닫기
          </button>
        </div>
      )}

      {/* AI Smart Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#E63946] dark:text-[#FF5A65]">
            <Sparkles className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 1 && setIsDropdownOpen(true)}
            placeholder="✨ 장소/도시 스마트 등록: (예: 신주쿠, 유후인, 하카타, 지브리, 도톤보리, 디즈니랜드...)"
            className="w-full pl-10 pr-28 py-3 bg-[#FBF9F5] dark:bg-[#0C1017] text-slate-800 dark:text-slate-100 rounded-2xl border border-[#E8E3D8] dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E63946]/40 text-xs sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-all font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-1.5 px-3.5 py-2 bg-[#E63946] hover:bg-[#D92534] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">스마트 등록</span>
        </button>
      </form>

      {/* AI Live Suggestions Dropdown */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-xl overflow-hidden z-30 divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in duration-100">
          <div className="px-3 py-1.5 bg-slate-100/70 dark:bg-slate-900/60 text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-[#E63946]" />
            <span>자동 스마트 매칭 결과</span>
          </div>

          {suggestions.map((item, idx) => (
            <button
              key={`${item.prefectureCode}-${item.cityNameKo}-${idx}`}
              type="button"
              onClick={() => handleSelectResult(item)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-red-50/50 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950 text-[#E63946] dark:text-[#FF5A65] group-hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
                      {item.cityNameKo}
                    </span>
                    {item.cityNameJa && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-serif-jp">
                        ({item.cityNameJa})
                      </span>
                    )}
                    {item.category && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5">
                    <span>자동 배정:</span>
                    <span className="font-semibold text-[#E63946] dark:text-[#FF5A65]">
                      {item.prefectureNameKo} ({item.prefectureNameJa})
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-xs font-medium text-[#E63946] dark:text-[#FF5A65] group-hover:translate-x-1 transition-transform">
                <span>등록</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
