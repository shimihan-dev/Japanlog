import React from "react";
import { Map, RotateCcw, Sparkles } from "lucide-react";

interface HeaderProps {
  onLoadSample: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoadSample, onReset }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Title Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-4 h-3 bg-red-500 rounded-sm shadow-sm relative overflow-hidden border border-slate-200" title="Japan Flag">
                <span className="absolute inset-0 m-auto w-1.5 h-1.5 bg-red-600 rounded-full" />
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">일본 여행 지도</h1>
            </div>
            <p className="text-xs text-slate-500">내가 방문하고 경유한 일본 47개 도도부현 기록</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>샘플 데이터 불러오기</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기록 초기화</span>
          </button>
        </div>
      </div>
    </header>
  );
};
