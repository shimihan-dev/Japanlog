import { useState, useEffect, useCallback } from "react";
import type { Trip } from "../types/travel";
import { getSampleTrips } from "../utils/storage";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

// Comprehensive recovery helper to find user's trips across all legacy & local storage keys
function recoverLocalTrips(user: User | null): Trip[] {
  const keysToTry = [
    "japan-travel-map-trips", // Original primary storage key
    "japan-travel-map-trips-guest",
    user ? `japan-travel-map-trips-${user.id}` : null,
  ].filter(Boolean) as string[];

  // 1. Try explicit keys
  for (const key of keysToTry) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const nonSample = parsed.filter((t: Trip) => !t.id.startsWith("trip-sample-"));
          if (nonSample.length > 0) return parsed;
        }
      }
    } catch {
      // Continue to next key
    }
  }

  // 2. Exhaustive scan across all localStorage keys in browser
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes("trips") || key.includes("japan"))) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const nonSample = parsed.filter((t: Trip) => !t.id.startsWith("trip-sample-"));
            if (nonSample.length > 0) return parsed;
          }
        }
      }
    }
  } catch {
    // Fallthrough to sample
  }

  return getSampleTrips();
}

export function useTrips(user: User | null = null) {
  const storageKey = user ? `japan-travel-map-trips-${user.id}` : "japan-travel-map-trips-guest";

  const [trips, setTrips] = useState<Trip[]>(() => recoverLocalTrips(user));
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Sync state whenever user session changes (login/logout) & fetch from Supabase Cloud
  useEffect(() => {
    let isMounted = true;

    async function fetchCloudTrips() {
      // 1. First recover local trips immediately so user never sees empty state
      const localTrips = recoverLocalTrips(user);
      if (isMounted && localTrips.length > 0) {
        setTrips(localTrips);
      }

      if (!user || !isSupabaseConfigured) return;

      try {
        const { data, error } = await supabase
          .from("user_travel_records")
          .select("trips")
          .eq("user_id", user.id)
          .single();

        if (!error && data?.trips && Array.isArray(data.trips) && data.trips.length > 0) {
          const cloudTrips: Trip[] = data.trips;
          const localNonSample = localTrips.filter((t) => !t.id.startsWith("trip-sample-"));

          // Merge local and cloud trips by ID to ensure zero data loss
          const tripMap = new Map<string, Trip>();
          cloudTrips.forEach((t) => tripMap.set(t.id, t));
          localNonSample.forEach((t) => {
            if (!tripMap.has(t.id)) {
              tripMap.set(t.id, t);
            }
          });

          const mergedTrips = Array.from(tripMap.values());
          if (isMounted && mergedTrips.length > 0) {
            setTrips(mergedTrips);
          }
        } else if (localTrips.length > 0) {
          // Push local trips to cloud if cloud is currently empty
          await supabase.from("user_travel_records").upsert({
            user_id: user.id,
            records: {},
            trips: localTrips,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Cloud trips fetch error:", err);
      }
    }

    fetchCloudTrips();

    return () => {
      isMounted = false;
    };
  }, [user, storageKey]);

  // Persist to localStorage & Supabase Cloud
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(trips));
      localStorage.setItem("japan-travel-map-trips", JSON.stringify(trips)); // Also save to original key for safety
    } catch (err) {
      console.error("Failed to save trips to localStorage", err);
    }

    if (isSupabaseConfigured && user) {
      const timer = setTimeout(async () => {
        try {
          const { data } = await supabase
            .from("user_travel_records")
            .select("records")
            .eq("user_id", user.id)
            .single();

          await supabase.from("user_travel_records").upsert({
            user_id: user.id,
            records: data?.records || {},
            trips: trips,
            updated_at: new Date().toISOString(),
          });
        } catch (err) {
          console.error("Failed to save trips to Supabase cloud:", err);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [trips, user, storageKey]);

  const addTrip = useCallback((tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: now,
      updatedAt: now,
    };

    setTrips((prev) => [newTrip, ...prev.filter((t) => !t.id.startsWith("trip-sample-"))]);
    return newTrip;
  }, []);

  const updateTrip = useCallback((tripId: string, updatedFields: Partial<Omit<Trip, "id" | "createdAt">>) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              ...updatedFields,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    setSelectedTripId((prev) => (prev === tripId ? null : prev));
  }, []);

  const resetTripsToSample = useCallback(() => {
    const samples = getSampleTrips();
    setTrips(samples);
  }, []);

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || null;

  return {
    trips,
    selectedTripId,
    selectedTrip,
    setSelectedTripId,
    addTrip,
    updateTrip,
    deleteTrip,
    resetTripsToSample,
  };
}
