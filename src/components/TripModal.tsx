import React, { useState, useEffect, useMemo, useRef } from "react";
import type { Trip, TravelRecordsMap, CityVisit } from "../types/travel";
import { PREFECTURES, PREFECTURE_MAP_BY_CODE } from "../data/prefectures";
import { X, Calendar, MapPin, Sparkles, Plus, CheckCircle2 } from "lucide-react";

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">, autoSyncMap: boolean) => void;
  editingTrip?: Trip | null;
  records?: TravelRecordsMap;
  initialMode?: "existing" | "new";
}

const EMOJI_OPTIONS = [
  "🧳", "🌸", "🍜", "🚄", "⛩️", "❄️", "🍻", "✈️", "🌊", "温泉",
  "🏔️", "🎡", "🍣", "🍱", "🏯", "🗼", "🍡", "🍶", "🎏", "🛍️",
  "📸", "🗺️", "🎋", "🏮", "🍢", "🍵", "🍦", "🎆", "⛷️", "🎮",
  "🎒", "🚅", "🚗", "🍙", "🥟", "🍤", "🌷", "☀️", "🍁", "☃️"
];

export function formatSmartDateInput(input: string): string {
  if (!input) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input.replace(/-/g, ".");
  }

  const cleaned = input.replace(/\D/g, "");

  if (cleaned.length === 8) {
    const yyyy = cleaned.slice(0, 4);
    const mm = cleaned.slice(4, 6);
    const dd = cleaned.slice(6, 8);
    return `${yyyy}.${mm}.${dd}`;
  }

  if (cleaned.length === 6) {
    const yyyy = cleaned.slice(0, 4);
    const mm = cleaned.slice(4, 6);
    return `${yyyy}.${mm}`;
  }

  return input;
}

const DateInputField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}> = ({ label, value, onChange, placeholder }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const formatted = formatSmartDateInput(val);
    onChange(formatted);
  };

  const handleBlur = () => {
    onChange(formatSmartDateInput(value));
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          <span>{label}</span>
        </span>
        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">YYYYMMDD 입력 가능</span>
      </label>

      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full pl-3.5 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
        />

        <input
          ref={dateInputRef}
          type="date"
          onChange={(e) => {
            if (e.target.value) {
              onChange(formatSmartDateInput(e.target.value));
            }
          }}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => dateInputRef.current?.showPicker?.()}
          className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTrip,
  records = {},
  initialMode = "new",
}) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emoji, setEmoji] = useState("🧳");
  const [description, setDescription] = useState("");
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [cities, setCities] = useState<{ prefectureCode: number; cityNameKo: string }[]>([]);
  const [mode, setMode] = useState<"existing" | "new">(initialMode);

  // New City Input States
  const [newCityName, setNewCityName] = useState("");
  const [selectedCityPrefCode, setSelectedCityPrefCode] = useState<number | null>(null);

  const existingVisitedCities = useMemo(() => {
    const list: { prefectureCode: number; prefectureNameKo: string; city: CityVisit }[] = [];
    Object.values(records).forEach((rec) => {
      if (rec.status === "visited" && rec.cities.length > 0) {
        const pref = PREFECTURE_MAP_BY_CODE.get(rec.prefectureCode);
        rec.cities.forEach((c: CityVisit) => {
          list.push({
            prefectureCode: rec.prefectureCode,
            prefectureNameKo: pref?.nameKo || "",
            city: c,
          });
        });
      }
    });
    return list;
  }, [records]);

  useEffect(() => {
    setMode(initialMode);
    if (editingTrip) {
      setTitle(editingTrip.title || "");
      setStartDate(editingTrip.startDate || "");
      setEndDate(editingTrip.endDate || "");
      setEmoji(editingTrip.emoji || "🧳");
      setDescription(editingTrip.description || "");
      setSelectedPrefectures(editingTrip.prefectures || []);
      setCities(editingTrip.cities || []);
    } else {
      setTitle("");
      setStartDate("");
      setEndDate("");
      setEmoji("🧳");
      setDescription("");
      setSelectedPrefectures([]);
      setCities([]);
    }
  }, [editingTrip, isOpen, initialMode]);

  if (!isOpen) return null;

  const togglePrefecture = (code: number) => {
    setSelectedPrefectures((prev) => {
      const isSelected = prev.includes(code);
      if (isSelected) {
        return prev.filter((c) => c !== code);
      } else {
        if (selectedCityPrefCode === null) {
          setSelectedCityPrefCode(code);
        }
        return [...prev, code];
      }
    });
  };

  const handleAddCustomCity = () => {
    if (!newCityName.trim()) return;
    const prefCode = selectedCityPrefCode || (selectedPrefectures.length > 0 ? selectedPrefectures[0] : 27);

    const isDuplicate = cities.some(
      (c) => c.prefectureCode === prefCode && c.cityNameKo.trim().toLowerCase() === newCityName.trim().toLowerCase()
    );

    if (!isDuplicate) {
      setCities((prev) => [...prev, { prefectureCode: prefCode, cityNameKo: newCityName.trim() }]);
      if (!selectedPrefectures.includes(prefCode)) {
        setSelectedPrefectures((prev) => [...prev, prefCode]);
      }
    }

    setNewCityName("");
  };

  const toggleExistingCity = (prefCode: number, cityNameKo: string) => {
    const exists = cities.some(
      (c) => c.prefectureCode === prefCode && c.cityNameKo === cityNameKo
    );

    if (exists) {
      setCities((prev) =>
        prev.filter((c) => !(c.prefectureCode === prefCode && c.cityNameKo === cityNameKo))
      );
    } else {
      setCities((prev) => [...prev, { prefectureCode: prefCode, cityNameKo }]);
      if (!selectedPrefectures.includes(prefCode)) {
        setSelectedPrefectures((prev) => [...prev, prefCode]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const autoSyncMap = true;

    onSave(
      {
        title: title.trim(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        emoji,
        description: description.trim() || undefined,
        prefectures: selectedPrefectures,
        cities,
      },
      autoSyncMap
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{emoji}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif-jp">
              {editingTrip ? "여행 회차 수정" : mode === "existing" ? "기존 방문 기록으로 여행 묶기" : "신규 여행 등록 (지도 자동 색칠 연동)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto Sync Banner for New Mode */}
        <div className="mx-6 mt-3 p-3 bg-blue-50 dark:bg-cyan-950/60 rounded-2xl border border-blue-200/80 dark:border-cyan-800/80 text-xs font-semibold text-blue-900 dark:text-cyan-200 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0" />
          <span>이 여행을 등록하면 선택한 도도부현이 <strong>지도 상에서 방문 완료(파란색)로 즉시 색칠되고 도시 핀(📍)이 자동 생성</strong>됩니다!</span>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Emoji & Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              여행 테마 이모지 & 제목 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto space-x-1">
                {EMOJI_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEmoji(item)}
                    className={`p-2 rounded-xl text-lg transition-transform cursor-pointer ${
                      emoji === item ? "bg-white dark:bg-slate-700 scale-110 shadow-xs" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              required
              placeholder="예: 2017 오사카 나라 여행"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <DateInputField
              label="시작일"
              placeholder="2017.07.23 (또는 20170723)"
              value={startDate}
              onChange={setStartDate}
            />
            <DateInputField
              label="종료일"
              placeholder="2017.07.26 (또는 20170726)"
              value={endDate}
              onChange={setEndDate}
            />
          </div>

          {/* Visited Prefectures Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>방문 도도부현 선택 ({selectedPrefectures.length}개 선택됨 - 클릭 시 지도 자동 색칠)</span>
              </span>
            </label>
            <div className="max-h-36 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {PREFECTURES.map((pref) => {
                const isSelected = selectedPrefectures.includes(pref.code);
                return (
                  <button
                    key={pref.code}
                    type="button"
                    onClick={() => togglePrefecture(pref.code)}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                      isSelected
                        ? "bg-[#E63946] text-white font-extrabold shadow-2xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pref.nameKo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visited Cities Input (NEW FEATURE) */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>방문 도시 추가 (선택 사항 - 지도에 📍 핀 자동 꽂힘)</span>
              </span>
            </label>

            <div className="flex gap-2">
              {selectedPrefectures.length > 0 && (
                <select
                  value={selectedCityPrefCode || selectedPrefectures[0]}
                  onChange={(e) => setSelectedCityPrefCode(Number(e.target.value))}
                  className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {selectedPrefectures.map((code) => {
                    const p = PREFECTURE_MAP_BY_CODE.get(code);
                    return (
                      <option key={code} value={code}>
                        {p?.nameKo || `도도부현 ${code}`}
                      </option>
                    );
                  })}
                </select>
              )}

              <input
                type="text"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomCity();
                  }
                }}
                placeholder="예: 오사카, 난바, 나라, 우메다"
                className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={handleAddCustomCity}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer transition-all shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>도시 추가</span>
              </button>
            </div>

            {/* Added Cities List Badges */}
            {cities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cities.map((c, idx) => {
                  const p = PREFECTURE_MAP_BY_CODE.get(c.prefectureCode);
                  return (
                    <span
                      key={`${c.prefectureCode}-${c.cityNameKo}-${idx}`}
                      className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-cyan-200 border border-blue-200 dark:border-cyan-800 rounded-xl text-xs font-bold flex items-center space-x-1"
                    >
                      <span>📍 [{p?.nameKo || ""}] {c.cityNameKo}</span>
                      <button
                        type="button"
                        onClick={() => setCities((prev) => prev.filter((_, i) => i !== idx))}
                        className="hover:text-red-500 font-bold ml-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Picker for Existing Visited Cities (if existing mode) */}
          {existingVisitedCities.length > 0 && (
            <div className="p-3 bg-blue-50/70 dark:bg-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-700/80 space-y-2">
              <label className="block text-xs font-extrabold text-blue-900 dark:text-cyan-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span>내 지도 기존 등록 도시에서 바로 선택하기</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {existingVisitedCities.map((item, idx) => {
                  const isChecked = cities.some(
                    (c) => c.prefectureCode === item.prefectureCode && c.cityNameKo === item.city.cityNameKo
                  );
                  return (
                    <button
                      key={`${item.prefectureCode}-${item.city.cityNameKo}-${idx}`}
                      type="button"
                      onClick={() => toggleExistingCity(item.prefectureCode, item.city.cityNameKo)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
                        isChecked
                          ? "bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-900 shadow-2xs font-extrabold"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-600"
                      }`}
                    >
                      <span className="text-[10px] opacity-75">[{item.prefectureNameKo}]</span>
                      <span>{item.city.cityNameKo}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Combined Travel Highlights & Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>여행 하이라이트 & 메모 / 기억나는 순간</span>
            </label>
            <textarea
              rows={3}
              placeholder="예: 도톤보리 타코야키 맛집, 나라 사슴공원 산책, 도톤보리 야경 등 여행의 기억나는 순간이나 후기를 작성하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-cyan-400"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E63946] hover:bg-[#D92534] text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer"
            >
              {editingTrip ? "저장하기" : "여행 등록 및 지도 자동 색칠하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
