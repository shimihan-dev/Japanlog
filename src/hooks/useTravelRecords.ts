import { useState, useEffect, useCallback, useMemo } from "react";
import type { TravelRecordsMap, VisitStatus, CityVisit, PrefectureRecord } from "../types/travel";
import { loadTravelRecords, saveTravelRecords, getSampleTravelRecords, clearTravelRecords } from "../utils/storage";
import { PREFECTURES } from "../data/prefectures";

export function useTravelRecords() {
  const [records, setRecords] = useState<TravelRecordsMap>(() => loadTravelRecords());
  const [selectedCode, setSelectedCode] = useState<number | null>(40); // default selection: Fukuoka (40)

  // Ensure all 47 prefectures exist in the record map with default unvisited status if not set
  const completeRecords = useMemo(() => {
    const map: TravelRecordsMap = {};
    PREFECTURES.forEach((pref) => {
      if (records[pref.code]) {
        map[pref.code] = records[pref.code];
      } else {
        map[pref.code] = {
          prefectureCode: pref.code,
          status: "unvisited",
          cities: [],
          updatedAt: new Date(0).toISOString(),
        };
      }
    });
    return map;
  }, [records]);

  // Persist to localStorage
  useEffect(() => {
    saveTravelRecords(records);
  }, [records]);

  const updateStatus = useCallback((code: number, status: VisitStatus) => {
    setRecords((prev) => {
      const existing = prev[code] || {
        prefectureCode: code,
        status: "unvisited",
        cities: [],
        updatedAt: new Date().toISOString(),
      };

      let updatedCities = existing.cities;
      if (status === "unvisited") {
        updatedCities = [];
      }

      return {
        ...prev,
        [code]: {
          ...existing,
          status,
          cities: updatedCities,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const addCity = useCallback((code: number, cityData: Omit<CityVisit, "id">) => {
    setRecords((prev) => {
      const existing = prev[code] || {
        prefectureCode: code,
        status: "visited",
        cities: [],
        updatedAt: new Date().toISOString(),
      };

      const newCity: CityVisit = {
        id: `city-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        ...cityData,
      };

      return {
        ...prev,
        [code]: {
          ...existing,
          status: "visited",
          cities: [...existing.cities, newCity],
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const updateCity = useCallback((code: number, cityId: string, updatedFields: Partial<CityVisit>) => {
    setRecords((prev) => {
      const existing = prev[code];
      if (!existing) return prev;

      const updatedCities = existing.cities.map((c: CityVisit) => (c.id === cityId ? { ...c, ...updatedFields } : c));

      return {
        ...prev,
        [code]: {
          ...existing,
          cities: updatedCities,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const deleteCity = useCallback((code: number, cityId: string) => {
    setRecords((prev) => {
      const existing = prev[code];
      if (!existing) return prev;

      const updatedCities = existing.cities.filter((c: CityVisit) => c.id !== cityId);

      return {
        ...prev,
        [code]: {
          ...existing,
          cities: updatedCities,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const updatePrefectureDetails = useCallback(
    (code: number, details: Partial<Omit<PrefectureRecord, "prefectureCode" | "cities">>) => {
      setRecords((prev) => {
        const existing = prev[code] || {
          prefectureCode: code,
          status: "unvisited",
          cities: [],
          updatedAt: new Date().toISOString(),
        };

        return {
          ...prev,
          [code]: {
            ...existing,
            ...details,
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const loadSample = useCallback(() => {
    const sample = getSampleTravelRecords();
    setRecords(sample);
  }, []);

  const resetAll = useCallback(() => {
    clearTravelRecords();
    setRecords({});
  }, []);

  // Compute recent additions/modifications (last 5)
  const recentVisits = useMemo(() => {
    const list: { cityName: string; prefectureCode: number; visitedAt?: string; updatedAt: string }[] = [];

    Object.values(completeRecords).forEach((rec) => {
      if (rec.status === "visited" && rec.cities.length > 0) {
        rec.cities.forEach((c: CityVisit) => {
          list.push({
            cityName: c.cityNameKo,
            prefectureCode: rec.prefectureCode,
            visitedAt: c.visitedAt || rec.lastVisitedAt || "최근",
            updatedAt: rec.updatedAt,
          });
        });
      }
    });

    return list
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [completeRecords]);

  return {
    records: completeRecords,
    selectedCode,
    setSelectedCode,
    updateStatus,
    addCity,
    updateCity,
    deleteCity,
    updatePrefectureDetails,
    loadSample,
    resetAll,
    recentVisits,
  };
}
