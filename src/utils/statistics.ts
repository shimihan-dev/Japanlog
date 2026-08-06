import type { TravelRecordsMap, CityVisit } from "../types/travel";

export interface TravelStats {
  visitedCount: number;
  transitCount: number;
  unvisitedCount: number;
  totalCitiesCount: number;
  achievementRate: number; // percentage e.g. 25.5
}

export function calculateTravelStats(records: TravelRecordsMap): TravelStats {
  let visitedCount = 0;
  let transitCount = 0;
  const uniqueCitiesSet = new Set<string>();

  Object.values(records).forEach((record) => {
    if (record.status === "visited") {
      visitedCount++;
      record.cities.forEach((city: CityVisit) => {
        if (city.cityNameKo.trim()) {
          uniqueCitiesSet.add(`${record.prefectureCode}-${city.cityNameKo.trim().toLowerCase()}`);
        }
      });
    } else if (record.status === "transit") {
      transitCount++;
    }
  });

  const unvisitedCount = 47 - (visitedCount + transitCount);
  const achievementRate = Number(((visitedCount / 47) * 100).toFixed(1));

  return {
    visitedCount,
    transitCount,
    unvisitedCount,
    totalCitiesCount: uniqueCitiesSet.size,
    achievementRate,
  };
}
