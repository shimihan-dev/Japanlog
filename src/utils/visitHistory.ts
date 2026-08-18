import type { PrefectureRecord, Trip } from "../types/travel";

export interface CityVisitHistoryItem {
  id: string;
  source: "trip" | "direct";
  tripId?: string;
  title: string;
  dateRange?: string;
  emoji?: string;
  notes?: string;
}

export interface CityVisitSummary {
  visitCount: number;
  history: CityVisitHistoryItem[];
  lastVisitedAt?: string;
}

export function getCityVisitHistory(
  prefectureCode: number,
  cityNameKo: string,
  record?: PrefectureRecord,
  trips: Trip[] = []
): CityVisitSummary {
  const cleanTargetName = cityNameKo.trim().toLowerCase();
  const history: CityVisitHistoryItem[] = [];

  // 1. Collect matching trips containing this prefecture & city
  trips.forEach((t) => {
    const hasCity = t.cities?.some(
      (tc) => tc.prefectureCode === prefectureCode && tc.cityNameKo.trim().toLowerCase() === cleanTargetName
    );

    if (hasCity) {
      const dateRange = t.startDate && t.endDate ? `${t.startDate} ~ ${t.endDate}` : t.startDate || t.endDate;
      history.push({
        id: `trip-${t.id}`,
        source: "trip",
        tripId: t.id,
        title: t.title,
        dateRange,
        emoji: t.emoji || "✈️",
        notes: t.description,
      });
    }
  });

  // 2. Check direct record city visit notes or date
  const directCity = record?.cities?.find((c) => c.cityNameKo.trim().toLowerCase() === cleanTargetName);
  if (directCity && (directCity.visitedAt || directCity.notes)) {
    const exists = history.some((h) => h.notes === directCity.notes || h.dateRange === directCity.visitedAt);
    if (!exists) {
      history.push({
        id: `direct-${directCity.id}`,
        source: "direct",
        title: directCity.notes || `${cityNameKo} 개인 기록`,
        dateRange: directCity.visitedAt,
        emoji: "📍",
        notes: directCity.notes,
      });
    }
  }

  const visitCount = Math.max(1, history.length);
  const lastVisitedAt = history[0]?.dateRange || directCity?.visitedAt || record?.lastVisitedAt;

  return { visitCount, history, lastVisitedAt };
}
