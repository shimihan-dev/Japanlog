import React, { useState, useEffect } from "react";
import type { CityVisit } from "../types/travel";
import { Check, X } from "lucide-react";

interface CityVisitFormProps {
  initialData?: CityVisit | null;
  onSave: (data: Omit<CityVisit, "id">) => void;
  onCancel: () => void;
}

export const CityVisitForm: React.FC<CityVisitFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [cityNameKo, setCityNameKo] = useState("");
  const [cityNameJa, setCityNameJa] = useState("");
  const [visitedAt, setVisitedAt] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      setCityNameKo(initialData.cityNameKo || "");
      setCityNameJa(initialData.cityNameJa || "");
      setVisitedAt(initialData.visitedAt || "");
      setNotes(initialData.notes || "");
    } else {
      setCityNameKo("");
      setCityNameJa("");
      setVisitedAt("");
      setNotes("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityNameKo.trim()) return;

    onSave({
      cityNameKo: cityNameKo.trim(),
      cityNameJa: cityNameJa.trim() || undefined,
      visitedAt: visitedAt.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {initialData ? "도시 정보 수정" : "새 방문 도시 추가"}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            도시명 (한글) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="예: 후쿠오카시"
            value={cityNameKo}
            onChange={(e) => setCityNameKo(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            도시명 (일본어)
          </label>
          <input
            type="text"
            placeholder="예: 福岡市"
            value={cityNameJa}
            onChange={(e) => setCityNameJa(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Info notice: Dates are linked exclusively through Travel Trips */}
      <div className="p-2 rounded-lg bg-blue-50/80 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 text-[10px] text-blue-700 dark:text-cyan-300 leading-relaxed">
        💡 도시별 다녀온 날짜는 <b>[여행 회차 관리]</b>에서 해당 도시를 묶어 기록할 때 자동으로 부여되고 연동됩니다.
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
          간단한 메모 (선택)
        </label>
        <input
          type="text"
          placeholder="예: 하카타 라멘 먹음, 모모치 해변"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
        />
      </div>

      <div className="flex items-center justify-end space-x-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-500 rounded-lg shadow-sm"
        >
          <Check className="w-3.5 h-3.5" />
          <span>저장</span>
        </button>
      </div>
    </form>
  );
};
