import { useState, useEffect, useCallback } from "react";
import type { Trip } from "../types/travel";
import { getSampleTrips } from "../utils/storage";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

export function useTrips(user: User | null = null) {
  const storageKey = user ? `japan-travel-map-trips-${user.id}` : "japan-travel-map-trips-guest";

  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
      return user ? [] : getSampleTrips();
    } catch {
      return user ? [] : getSampleTrips();
    }
  });

  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  // Sync state whenever user session changes (login/logout) & fetch from Supabase Cloud
  useEffect(() => {
    let isMounted = true;

    async function fetchCloudTrips() {
      if (!user || !isSupabaseConfigured) {
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            setTrips(JSON.parse(raw));
          } else {
            setTrips(getSampleTrips());
          }
        } catch {
          setTrips(getSampleTrips());
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_travel_records")
          .select("trips")
          .eq("user_id", user.id)
          .single();

        if (!error && data?.trips && Array.isArray(data.trips)) {
          // Filter out any leftover sample trips for logged-in users if user has custom trips
          const realTrips = data.trips.filter((t: Trip) => !t.id.startsWith("trip-sample-"));
          if (isMounted) {
            setTrips(realTrips.length > 0 ? realTrips : data.trips);
          }
        } else {
          // If cloud has no trips, load local user trips or empty array (never sample trips for logged in users)
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const localTrips: Trip[] = JSON.parse(raw);
            const userTrips = localTrips.filter((t) => !t.id.startsWith("trip-sample-"));
            if (isMounted) setTrips(userTrips);
          } else {
            if (isMounted) setTrips([]);
          }
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
