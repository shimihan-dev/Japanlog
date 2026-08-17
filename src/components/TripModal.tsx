import React, { useState, useEffect } from "react";
import type { Trip } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";
import { X, Calendar, MapPin, Sparkles, Plus, Trash2 } from "lucide-react";

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">) => void;
  editingTrip?: Trip | null;
}

const EMOJI_OPTIONS = ["🧳", "🌸", "🍜", "🚄", "⛩️", "❄️", "🍻", "✈️", "🌊", "♨️", "🏔️", "🎡"];

export const TripModal: React.FC<TripModalProps> = ({ isOpen, onClose, onSave, editingTrip }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emoji, setEmoji] = useState("🧳");
  const [description, setDescription] = useState("");
  const [selectedPrefectures, setSelectedPrefectures] = useState<number[]>([]);
  const [cityInput, setCityInput] = useState("");
  const [cities, setCities] = useState<{ prefectureCode: number; cityNameKo: string }[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");

  useEffect(() => {
    if (editingTrip) {
      setTitle(editingTrip.title || "");
      setStartDate(editingTrip.startDate || "");
      setEndDate(editingTrip.endDate || "");
      setEmoji(editingTrip.emoji || "🧳");
      setDescription(editingTrip.description || "");
      setSelectedPrefectures(editingTrip.prefectures || []);
      setCities(editingTrip.cities || []);
      setHighlights(editingTrip.highlights || []);
    } else {
      setTitle("");
      setStartDate("");
      setEndDate("");
      setEmoji("🧳");
      setDescription("");
      setSelectedPrefectures([]);
      setCities([]);
      setHighlights([]);
    }
  }, [editingTrip, isOpen]);

  if (!isOpen) return null;

  const togglePrefecture = (code: number) => {
    setSelectedPrefectures((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleAddCity = () => {
    if (!cityInput.trim()) return;
    const prefCode = selectedPrefectures[0] || 13; // default to first selected or Tokyo
    setCities((prev) => [...prev, { prefectureCode: prefCode, cityNameKo: cityInput.trim() }]);
    setCityInput("");
  };

  const handleRemoveCity = (index: number) => {
    setCities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights((prev) => [...prev, highlightInput.trim()]);
    setHighlightInput("");
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      emoji,
      description: description.trim() || undefined,
      prefectures: selectedPrefectures,
      cities,
      highlights: highlights.length > 0 ? highlights : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{emoji}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingTrip ? "여행 회차 수정" : "새 여행 추가 (Trip Log)"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
                    className={`p-2 rounded-xl text-lg transition-transform ${
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
              placeholder="예: 2024 여름 홋카이도 4박 5일 힐링 여행"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>시작일</span>
              </label>
              <input
                type="text"
                placeholder="2024.08.10"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>종료일</span>
              </label>
              <input
                type="text"
                placeholder="2024.08.14"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Visited Prefectures Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>방문 도도부현 선택 ({selectedPrefectures.length}개 선택됨)</span>
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
                    className={`px-2 py-1 rounded-xl text-xs font-semibold transition-all text-left truncate ${
                      isSelected
                        ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-900 shadow-2xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {pref.nameKo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cities Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              방문 도시 Tag 추가
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="예: 삿포로, 오타루, 신주쿠"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCity();
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCity}
                className="px-3.5 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {cities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {cities.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-lg text-[11px] font-semibold"
                  >
                    <span>📍 {c.cityNameKo}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(idx)}
                      className="hover:text-red-900 dark:hover:text-red-100 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>여행 하이라이트 / 기억나는 순간</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="예: 오타루 운하 야경 투어, 징기스칸 로컬 맛집"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-3.5 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {highlights.length > 0 && (
              <ul className="mt-2 space-y-1">
                {highlights.map((h, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300"
                  >
                    <span>✨ {h}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              여행 한줄 메모
            </label>
            <textarea
              rows={2}
              placeholder="자유롭게 여행에 관한 총평이나 후기를 입력하세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-400 text-white dark:text-slate-900 text-xs font-bold rounded-2xl shadow-md shadow-blue-500/20 transition-all"
            >
              {editingTrip ? "저장하기" : "여행 등록하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
