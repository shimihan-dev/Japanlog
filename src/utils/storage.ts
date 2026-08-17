import type { TravelRecordsMap, Trip } from "../types/travel";
import { PREFECTURES } from "../data/prefectures";

const STORAGE_KEY = "japan-travel-map-records";

export function loadTravelRecords(): TravelRecordsMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load travel records from localStorage", error);
    return {};
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
    if (!raw) return getSampleTrips();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getSampleTrips();
  } catch (error) {
    console.error("Failed to load trips from localStorage", error);
    return getSampleTrips();
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
  const now = new Date().toISOString();
  return [
    {
      id: "trip-sample-1",
      title: "2024 여름 홋카이도 4박 5일 힐링 여행",
      startDate: "2024.08.10",
      endDate: "2024.08.14",
      emoji: "❄️",
      description: "삿포로 맥주 박물관, 오타루 운하 야경, 후라노 라벤더 밭 투어",
      prefectures: [1], // Hokkaido
      cities: [
        { prefectureCode: 1, cityNameKo: "삿포로" },
        { prefectureCode: 1, cityNameKo: "오타루" },
        { prefectureCode: 1, cityNameKo: "후라노" },
        { prefectureCode: 1, cityNameKo: "하코다테" },
      ],
      highlights: ["오타루 운하 미니 크루즈", "삿포로 징기스칸 숯불구이", "후라노 팜 토미타 라벤더"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "trip-sample-2",
      title: "2025 봄 도쿄 & 디즈니랜드 벚꽃 여행",
      startDate: "2025.04.01",
      endDate: "2025.04.05",
      emoji: "🌸",
      description: "도쿄 신주쿠 미구엔 벚꽃 구경, 디즈니랜드 및 요코하마 야경 투어",
      prefectures: [13, 14, 12], // Tokyo, Kanagawa, Chiba
      cities: [
        { prefectureCode: 13, cityNameKo: "신주쿠구" },
        { prefectureCode: 13, cityNameKo: "시부야구" },
        { prefectureCode: 14, cityNameKo: "요코하마" },
        { prefectureCode: 14, cityNameKo: "가마쿠라" },
      ],
      highlights: ["신주쿠 교엔 벚꽃 피크닉", "요코하마 미나토미라이 야경", "가마쿠라 에노덴 에노시마"],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "trip-sample-3",
      title: "2023 가을 간사이 식도락 탐방 여행",
      startDate: "2023.11.15",
      endDate: "2023.11.19",
      emoji: "🍡",
      description: "오사카 도톤보리 타코야키, 교토 아라시야마 단풍, 나라 사슴 공원",
      prefectures: [27, 26, 29], // Osaka, Kyoto, Nara
      cities: [
        { prefectureCode: 27, cityNameKo: "오사카" },
        { prefectureCode: 26, cityNameKo: "교토" },
        { prefectureCode: 29, cityNameKo: "나라" },
      ],
      highlights: ["교토 청수사(키요미즈데라) 단풍", "도톤보리 먹방 로드", "나라 사슴센베 주기"],
      createdAt: now,
      updatedAt: now,
    },
  ];
}
