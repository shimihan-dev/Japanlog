import { useState, useEffect, useCallback, useMemo } from "react";
import type { TravelRecordsMap, VisitStatus, CityVisit } from "../types/travel";
import { loadTravelRecords, saveTravelRecords, getSampleTravelRecords, clearTravelRecords } from "../utils/storage";
import { PREFECTURES } from "../data/prefectures";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { normalizeCityKey } from "../utils/cityMatcher";
import type { User } from "@supabase/supabase-js";

function mergeRecords(local: TravelRecordsMap, cloud: TravelRecordsMap): TravelRecordsMap {
  const merged: TravelRecordsMap = { ...cloud };

  Object.values(local).forEach((localPref) => {
    const code = localPref.prefectureCode;
    const cloudPref = merged[code];

    if (!cloudPref) {
      merged[code] = localPref;
      return;
    }

    // Status Priority: visited > transit > unvisited
    let status = cloudPref.status;
    if (localPref.status === "visited" || cloudPref.status === "visited") {
      status = "visited";
    } else if (localPref.status === "transit" || cloudPref.status === "transit") {
      status = "transit";
    }

    // Merge cities by city name
    const cityMap = new Map<string, CityVisit>();
    (cloudPref.cities || []).forEach((c: CityVisit) => cityMap.set(c.cityNameKo, c));
    (localPref.cities || []).forEach((c: CityVisit) => {
      if (!cityMap.has(c.cityNameKo)) {
        cityMap.set(c.cityNameKo, c);
      }
    });

    merged[code] = {
      ...cloudPref,
      status,
      cities: Array.from(cityMap.values()),
      notes: cloudPref.notes || localPref.notes,
      updatedAt: new Date().toISOString(),
    };
  });

  return merged;
}

export function sanitizeDeduplicatedRecords(rawRecords: TravelRecordsMap): TravelRecordsMap {
  const sanitized: TravelRecordsMap = {};

  Object.entries(rawRecords).forEach(([codeStr, prefRecord]) => {
    if (!prefRecord || !Array.isArray(prefRecord.cities)) {
      sanitized[Number(codeStr)] = prefRecord;
      return;
    }

    const seenNames = new Set<string>();
    const uniqueCities: CityVisit[] = [];

    prefRecord.cities.forEach((c: CityVisit) => {
      const key = normalizeCityKey(c.cityNameKo);
      if (key && !seenNames.has(key)) {
        seenNames.add(key);
        uniqueCities.push(c);
      }
    });

    sanitized[Number(codeStr)] = {
      ...prefRecord,
      cities: uniqueCities,
    };
  });

  return sanitized;
}

export function useTravelRecords(user: User | null = null) {
  const [records, setRecords] = useState<TravelRecordsMap>(() => sanitizeDeduplicatedRecords(loadTravelRecords()));
  const [selectedCode, setSelectedCode] = useState<number | null>(40); // default selection: Fukuoka (40)

  // Sync & Merge with Supabase Cloud on User Login / Session Change
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    let isMounted = true;

    async function fetchCloudRecords() {
      try {
        const { data, error } = await supabase
          .from("user_travel_records")
          .select("records")
          .eq("user_id", user!.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Failed to fetch cloud records:", error);
        }

        const cloudData = (data?.records || {}) as TravelRecordsMap;
        const localData = loadTravelRecords();

        if (data && Object.keys(cloudData).length > 0) {
          // Existing User Account: Load cloud records and merge local non-sample edits
          const merged = mergeRecords(localData, cloudData);
          if (isMounted) setRecords(merged);
        } else {
          // Brand New User Account: Start at clean ZERO state (0% visited, 0 cities)
          const hasRealUserEdits = Object.values(localData).some((pref) =>
            pref.status !== "unvisited" && !pref.cities?.some((c: CityVisit) => c.id.startsWith("sample-"))
          );

          const initialRecords = hasRealUserEdits ? localData : {};
          if (isMounted) setRecords(initialRecords);

          await supabase.from("user_travel_records").upsert({
            user_id: user!.id,
            records: initialRecords,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Cloud sync error:", err);
      }
    }

    fetchCloudRecords();

    return () => {
      isMounted = false;
    };
  }, [user]);

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

  // Persist to localStorage & Supabase Cloud
  useEffect(() => {
    saveTravelRecords(records);

    if (isSupabaseConfigured && user) {
      const timer = setTimeout(async () => {
        try {
          const { data } = await supabase
            .from("user_travel_records")
            .select("trips")
            .eq("user_id", user.id)
            .single();

          await supabase.from("user_travel_records").upsert({
            user_id: user.id,
            records,
            trips: data?.trips || [],
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Failed to save to Supabase cloud:", err);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [records, user]);

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

  const addCity = useCallback(
    (prefectureCode: number, cityData: { cityNameKo: string; cityNameJa?: string; notes?: string }) => {
      setRecords((prev) => {
        const existing = prev[prefectureCode] || {
          prefectureCode,
          status: "visited",
          cities: [],
          updatedAt: new Date().toISOString(),
        };

        const existingCities = existing.cities || [];
        const newKey = normalizeCityKey(cityData.cityNameKo);
        const isDuplicate = existingCities.some(
          (c) => normalizeCityKey(c.cityNameKo) === newKey
        );

        if (isDuplicate) {
          return prev;
        }

        const newCity: CityVisit = {
          id: `city-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          cityNameKo: cityData.cityNameKo.trim(),
          cityNameJa: cityData.cityNameJa?.trim(),
          notes: cityData.notes?.trim(),
          visitedAt: new Date().toISOString().slice(0, 10),
        };

        return {
          ...prev,
          [prefectureCode]: {
            ...existing,
            status: "visited",
            cities: [...existingCities, newCity],
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const updateCity = useCallback(
    (prefectureCode: number, cityId: string, updatedFields: Partial<Omit<CityVisit, "id">>) => {
      setRecords((prev) => {
        const existing = prev[prefectureCode];
        if (!existing) return prev;

        const updatedCities = existing.cities.map((c) => (c.id === cityId ? { ...c, ...updatedFields } : c));

        return {
          ...prev,
          [prefectureCode]: {
            ...existing,
            cities: updatedCities,
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const deleteCity = useCallback((prefectureCode: number, cityId: string) => {
    setRecords((prev) => {
      const existing = prev[prefectureCode];
      if (!existing) return prev;

      const updatedCities = existing.cities.filter((c) => c.id !== cityId);

      return {
        ...prev,
        [prefectureCode]: {
          ...existing,
          cities: updatedCities,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }, []);

  const updatePrefectureDetails = useCallback(
    (prefectureCode: number, details: { notes?: string; rating?: number; isFavorite?: boolean }) => {
      setRecords((prev) => {
        const existing = prev[prefectureCode] || {
          prefectureCode,
          status: "unvisited",
          cities: [],
          updatedAt: new Date().toISOString(),
        };

        return {
          ...prev,
          [prefectureCode]: {
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
    const sampleData = getSampleTravelRecords();
    setRecords(sampleData);
    saveTravelRecords(sampleData);
  }, []);

  const resetAll = useCallback(() => {
    const cleared = clearTravelRecords();
    setRecords(cleared);
  }, []);

  const clearAllCityVisitDates = useCallback(() => {
    setRecords((prev) => {
      const updated: TravelRecordsMap = {};
      Object.entries(prev).forEach(([codeStr, pref]) => {
        const code = Number(codeStr);
        updated[code] = {
          ...pref,
          cities: pref.cities.map((c: CityVisit) => ({
            ...c,
            visitedAt: undefined,
          })),
          lastVisitedAt: undefined,
          updatedAt: new Date().toISOString(),
        };
      });
      return updated;
    });
  }, []);

  const cleanDuplicateCities = useCallback(() => {
    setRecords((prev) => sanitizeDeduplicatedRecords(prev));
  }, []);

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
    clearAllCityVisitDates,
    cleanDuplicateCities,
    recentVisits,
  };
}
