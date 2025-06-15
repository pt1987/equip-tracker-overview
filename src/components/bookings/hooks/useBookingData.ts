
import { useState, useEffect } from "react";
import { AssetBooking } from "@/lib/types";
import { getAllBookings } from "@/data/bookings";

export function useBookingData() {
  const [bookings, setBookings] = useState<AssetBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Fehler beim Laden der Buchungen");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return {
    bookings,
    isLoading,
    error,
    refetch: loadBookings
  };
}
