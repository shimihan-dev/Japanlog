import React, { useMemo } from "react";
import type { TravelRecordsMap } from "../types/travel";
import { PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { Trophy, Award, MapPin, Sparkles, Compass } from "lucide-react";

interface TravelInsightsProps {
  records: TravelRecordsMap;
  onSelectPrefecture: (code: number) => void;
}

export const TravelInsights: React.FC<TravelInsightsProps> = ({
  records,
  onSelectPrefecture,
}) => {
  const insights = useMemo(() => {
    let visitedCount = 0;
    let transitCount = 0;
    let totalCities = 0;
    const regionVisitedCount = new Map<string, number>();

    Object.values(records).forEach((rec) => {
      const pref = PREFECTURE_MAP_BY_CODE.get(rec.prefectureCode);
      if (!pref) return;

      if (rec.status === "visited") {
        visitedCount += 1;
        totalCities += rec.cities.length;
        const current = regionVisitedCount.get(pref.region) || 0;
        regionVisitedCount.set(pref.region, current + 1);
      } else if (rec.status === "transit") {
        transitCount += 1;
      }
    });

    // Determine Title Badge
    let titleBadge = "새내기 일본 여행자 🌸";
    if (visitedCount >= 47) titleBadge = "일본 전역 정복 마스터 👑";
    else if (visitedCount >= 30) titleBadge = "열도 종단 탐험가 🗺️";
    else if (visitedCount >= 15) titleBadge = "일본 베테랑 유랑가 🗾";
    else if (visitedCount >= 5) titleBadge = "열정 여행자 ✈️";

    // Find top visited region
    let topRegion = "없음";
    let topRegionCount = 0;
    regionVisitedCount.forEach((cnt, r) => {
      if (cnt > topRegionCount) {
        topRegionCount = cnt;
        topRegion = r;
      }
    });

    // Unvisited Recommendations
    const unvisitedList = [
      { code: 17, name: "이시카와현", highlight: "가나자와 겐로쿠엔" },
      { code: 10, name: "군마현", highlight: "쿠사츠 온천" },
      { code: 37, name: "카가와현", highlight: "다카마쓰 우동" },
      { code: 44, name: "오이타현", highlight: "유후인 온천" },
      { code: 20, name: "나가노현", highlight: "카루이자와 휴양지" },
      { code: 21, name: "기후현", highlight: "시라카와고 마을" },
      { code: 14, name: "가나가와현", highlight: "하코네/카마쿠라" },
    ];

    const unvisitedRecs = unvisitedList.filter(
      (item) => records[item.code]?.status !== "visited"
    ).slice(0, 3);

    return {
      visitedCount,
      transitCount,
      totalCities,
      titleBadge,
      topRegion,
      topRegionCount,
      unvisitedRecs,
    };
  }, [records]);

  return (
    <div className="bg-[#FBF9F5] dark:bg-[#0C1017] rounded-2xl border border-[#E8E3D8] dark:border-slate-800 shadow-2xs p-4 mt-4 space-y-3.5 transition-colors duration-250">
      {/* Title Header */}
      <div className="flex items-center space-x-2 border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
        <Trophy className="w-4 h-4 text-[#E63946]" />
        <h3 className="text-xs font-bold font-serif-jp text-slate-900 dark:text-slate-100">여행 칭호 & 인사이트</h3>
      </div>

      {/* Title Badge Card */}
      <div className="p-3 bg-red-50/60 dark:bg-red-950/40 rounded-xl border border-red-200/60 dark:border-red-900/50 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#E63946] dark:text-[#FF5A65] block font-serif-jp">달성한 여행 칭호</span>
          <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block font-serif-jp">{insights.titleBadge}</span>
        </div>
        <Award className="w-6 h-6 text-[#E63946] shrink-0" />
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">최애 지방</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5 font-serif-jp">
            {insights.topRegion !== "없음" ? `${insights.topRegion} (${insights.topRegionCount}곳)` : "기록 없음"}
          </span>
        </div>
        <div className="p-2.5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">총 기록 도시</span>
          <span className="font-bold text-[#E63946] dark:text-[#FF5A65] block mt-0.5 font-sans-outfit">
            {insights.totalCities}개 도시
          </span>
        </div>
      </div>

      {/* Unvisited Recommendation */}
      {insights.unvisitedRecs.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1 font-serif-jp">
            <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
            <span>추천 미방문 핫플레이스</span>
          </span>

          <div className="space-y-1.5">
            {insights.unvisitedRecs.map((rec) => (
              <button
                key={rec.code}
                type="button"
                onClick={() => onSelectPrefecture(rec.code)}
                className="w-full p-2 bg-white dark:bg-slate-900/60 hover:bg-red-50/60 dark:hover:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-800 transition-colors flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#E63946] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover:text-[#E63946] transition-colors font-serif-jp">
                      {rec.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-sans">
                      {rec.highlight}
                    </span>
                  </div>
                </div>
                <Compass className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-[#E63946] transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
