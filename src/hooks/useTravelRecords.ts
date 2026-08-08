import { useState, useEffect, useCallback, useMemo } from "react";
import type { TravelRecordsMap, VisitStatus, CityVisit, PrefectureRecord } from "../types/travel";
import { loadTravelRecords, saveTravelRecords, getSampleTravelRecords, clearTravelRecords } from "../utils/storage";
import { PREFECTURES } from "../data/prefectures";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useTravelRecords(user: User | null = null) {
  const [records, setRecords] = useState<TravelRecordsMap>(() => loadTravelRecords());
  const [selectedCode, setSelectedCode] = useState<number | null>(40); // default selection: Fukuoka (40)

  // Sync with Supabase Cloud on User Login / Session Change
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

        if (data && data.records && Object.keys(data.records).length > 0) {
          if (isMounted) {
            setRecords(data.records as TravelRecordsMap);
          }
        } else {
          // First time cloud sync for this user: Upload current local records
          const localData = loadTravelRecords();
          if (Object.keys(localData).length > 0) {
            await supabase.from("user_travel_records").upsert({
              user_id: user!.id,
              records: localData,
              updated_at: new Date().toISOString(),
            });
          }
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
          await supabase.from("user_travel_records").upsert({
            user_id: user.id,
            records,
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
