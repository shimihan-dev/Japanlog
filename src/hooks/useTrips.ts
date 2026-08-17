import { useState, useEffect, useCallback } from "react";
import type { Trip } from "../types/travel";
import { getSampleTrips } from "../utils/storage";
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

  // Sync state whenever user session changes (login/logout)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setTrips(JSON.parse(raw));
      } else {
        setTrips(user ? [] : getSampleTrips());
      }
    } catch {
      setTrips(user ? [] : getSampleTrips());
    }
  }, [user, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(trips));
    } catch (err) {
      console.error("Failed to save trips", err);
    }
  }, [trips, storageKey]);

  const addTrip = useCallback((tripData: Omit<Trip, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: now,
      updatedAt: now,
    };

    setTrips((prev) => [newTrip, ...prev]);
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
