import { useState, useEffect, useCallback } from "react";
import type { Trip } from "../types/travel";
import { loadTrips, saveTrips, getSampleTrips } from "../utils/storage";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>(() => loadTrips());
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    saveTrips(trips);
  }, [trips]);

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
