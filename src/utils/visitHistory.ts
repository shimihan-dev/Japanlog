import type { PrefectureRecord, Trip } from "../types/travel";
import { normalizeCityKey } from "./cityMatcher";

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
  const normTarget = normalizeCityKey(cityNameKo, prefectureCode);
  const history: CityVisitHistoryItem[] = [];

  // 1. Collect matching trips containing this prefecture & city
  trips.forEach((t) => {
    const hasCity =
      t.prefectures?.includes(prefectureCode) &&
      t.cities?.some(
        (tc) =>
          tc.prefectureCode === prefectureCode &&
          normalizeCityKey(tc.cityNameKo, prefectureCode) === normTarget
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

  // 2. Direct city record from map pins
  const directCity = record?.cities?.find(
    (c) => normalizeCityKey(c.cityNameKo, prefectureCode) === normTarget
  );

  // If there are ALREADY matching trips for this city, do NOT create a fake duplicate "개인 기록"
  // unless the direct record has unique custom notes
  if (directCity) {
    const hasTripsForThisCity = history.length > 0;

    if (!hasTripsForThisCity) {
      // Standalone city pin visit
      history.push({
        id: `direct-${directCity.id}`,
        source: "direct",
        title: directCity.notes || `${cityNameKo} 방문 기록`,
        dateRange: directCity.visitedAt,
        startDate: directCity.visitedAt,
        emoji: "📍",
        notes: directCity.notes,
      });
    } else if (directCity.notes && !history.some((h) => h.notes === directCity.notes)) {
      // Only add if there's distinct standalone notes not in the trip
      history.push({
        id: `direct-${directCity.id}`,
        source: "direct",
        title: directCity.notes,
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
