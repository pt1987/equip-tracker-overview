
import { useState, useEffect, useMemo, useCallback } from "react";
import { Asset, AssetBooking, Employee } from "@/lib/types";
import { 
  getCurrentOrUpcomingBooking, 
  getBookingsByAssetId,
  isBookingExpired,
  getAvailabilityStatus,
  countUpcomingBookings
} from "@/data/bookings";
import { getEmployeeById } from "@/data/employees";

export function useAssetBookings(asset: Asset) {
  const [currentBooking, setCurrentBooking] = useState<AssetBooking | null>(null);
  const [bookings, setBookings] = useState<AssetBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedEmployee, setBookedEmployee] = useState<Employee | null>(null);
  
  // Memoize the asset id to prevent unnecessary re-renders
  const assetId = useMemo(() => asset?.id, [asset?.id]);
  
  // Load current booking and recent bookings
  const loadBookings = useCallback(async () => {
    if (!assetId) return;
    
    setIsLoading(true);
    try {
      // Get current or upcoming booking
      const current = await getCurrentOrUpcomingBooking(assetId);
      setCurrentBooking(current);
      
      // If there's a current booking, get employee details
      if (current) {
        const employee = await getEmployeeById(current.employeeId);
        setBookedEmployee(employee || null);
      } else {
        setBookedEmployee(null);
      }
      
      // Get recent bookings
      const recent = await getBookingsByAssetId(assetId);
      setBookings(recent);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [assetId]);
  
  useEffect(() => {
    loadBookings();
  }, [loadBookings]);
  
  // Memoize computed values to prevent re-renders
  const availabilityStatus = useMemo(() => {
    return getAvailabilityStatus(currentBooking, bookings);
  }, [currentBooking, bookings]);
  
  const upcomingBookingsCount = useMemo(() => {
    return countUpcomingBookings(bookings);
  }, [bookings]);
  
  return {
    currentBooking,
    bookings,
    isLoading,
    bookedEmployee,
    loadBookings,
    isBookingExpired,
    getAvailabilityStatus: () => availabilityStatus,
    countUpcomingBookings: () => upcomingBookingsCount
  };
}
