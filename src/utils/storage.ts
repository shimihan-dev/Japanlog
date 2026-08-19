import type { TravelRecordsMap, Trip } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";

const STORAGE_KEY = "japan-travel-map-records";

export function loadTravelRecords(): TravelRecordsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSampleTravelRecords();
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
      return parsed;
    }
    return getSampleTravelRecords();
  } catch (error) {
    console.error("Failed to load travel records from localStorage", error);
    return getSampleTravelRecords();
  }
}

export function saveTravelRecords(records: TravelRecordsMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Failed to save travel records to localStorage", error);
  }
}

export function clearTravelRecords(): TravelRecordsMap {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear travel records", error);
  }
  return {};
}

export function getSampleTravelRecords(): TravelRecordsMap {
  const records: TravelRecordsMap = {};
  const now = new Date().toISOString();

  // Create initial empty structure for all 47 prefectures
  PREFECTURES.forEach((pref) => {
    records[pref.code] = {
      prefectureCode: pref.code,
      status: "unvisited",
      cities: [],
      updatedAt: now,
    };
  });

  const sampleData: { slug: string; cities: string[] }[] = [
    { slug: "hokkaido", cities: ["삿포로", "후라노", "아사히카와", "하코다테"] },
    { slug: "tokyo", cities: ["도쿄"] },
    { slug: "kanagawa", cities: ["요코하마", "가마쿠라"] },
    { slug: "shiga", cities: ["오쓰"] },
    { slug: "kyoto", cities: ["교토"] },
    { slug: "nara", cities: ["나라"] },
    { slug: "osaka", cities: ["오사카"] },
    { slug: "kagawa", cities: ["다카마쓰"] },
    { slug: "okayama", cities: ["오카야마", "구라시키"] },
    { slug: "yamaguchi", cities: ["시모노세키"] },
    { slug: "fukuoka", cities: ["기타큐슈", "후쿠오카"] },
    { slug: "okinawa", cities: ["나하", "나고"] },
  ];

  sampleData.forEach(({ slug, cities }) => {
    const pref = PREFECTURES.find((p) => p.slug === slug);
    if (!pref) return;

    records[pref.code] = {
      prefectureCode: pref.code,
      status: "visited",
      cities: cities.map((cName, idx) => ({
        id: `sample-${pref.code}-${idx}`,
        cityNameKo: cName,
      })),
      notes: `${pref.nameKo} 주요 도시 여행`,
      updatedAt: now,
    };
  });

  return records;
}

const TRIPS_STORAGE_KEY = "japan-travel-map-trips";

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load trips from localStorage", error);
    return [];
  }
}

export function saveTrips(trips: Trip[]): void {
  try {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  } catch (error) {
    console.error("Failed to save trips to localStorage", error);
  }
}

export function getSampleTrips(): Trip[] {
  return [];
}
