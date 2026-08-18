import type { PrefectureRecord, Trip } from "../types/travel";

export interface CityVisitHistoryItem {
  id: string;
  source: "trip" | "direct";
  tripId?: string;
  title: string;
  dateRange?: string;
  startDate?: string;
  emoji?: string;
  notes?: string;
  visitRound?: number;
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
        startDate: t.startDate,
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
        startDate: directCity.visitedAt,
        emoji: "📍",
        notes: directCity.notes,
      });
    }
  }

  // 3. Sort history chronologically ASCENDING (oldest date first -> 1차, 2차, ...)
  const getSortKey = (item: CityVisitHistoryItem) => {
    const raw = item.startDate || item.dateRange || "";
    const digits = raw.replace(/\D/g, "");
    return digits || "00000000";
  };

  history.sort((a, b) => getSortKey(a).localeCompare(getSortKey(b)));

  // 4. Assign visit round numbers (1차, 2차, ...) chronologically
  history.forEach((item, index) => {
    item.visitRound = index + 1;
  });

  const visitCount = Math.max(1, history.length);
  const latestItem = history[history.length - 1];
  const lastVisitedAt = latestItem?.dateRange || directCity?.visitedAt || record?.lastVisitedAt;

  return { visitCount, history, lastVisitedAt };
}
