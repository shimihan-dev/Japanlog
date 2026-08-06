export type VisitStatus = "unvisited" | "transit" | "visited";

export interface CityVisit {
  id: string;
  cityNameKo: string;
  cityNameJa?: string;
  visitedAt?: string; // free text or YYYY.MM format
  notes?: string;
}

export interface PrefectureMeta {
  code: number;        // 1 to 47
  slug: string;        // e.g. "hokkaido", "fukuoka"
  nameKo: string;      // e.g. "후쿠오카현"
  nameJa: string;      // e.g. "福岡県"
  region: string;      // e.g. "큐슈"
}

export interface PrefectureRecord {
  prefectureCode: number;
  status: VisitStatus;
  cities: CityVisit[];
  firstVisitedAt?: string;
  lastVisitedAt?: string;
  visitCount?: number;
  notes?: string;
  updatedAt: string;
}

export interface TravelRecordsMap {
  [prefectureCode: number]: PrefectureRecord;
}

export type SortOption = "code" | "name" | "recent" | "cities";
