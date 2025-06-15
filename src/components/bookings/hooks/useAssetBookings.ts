
import { useState, useEffect } from "react";
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
  
  // Load current booking and recent bookings
  const loadBookings = async () => {
    setIsLoading(true);
    try {
      // Get current or upcoming booking
      const current = await getCurrentOrUpcomingBooking(asset.id);
      setCurrentBooking(current);
      
      // If there's a current booking, get employee details
      if (current) {
        const employee = await getEmployeeById(current.employeeId);
        setBookedEmployee(employee || null);
      }
      
      // Get recent bookings
      const recent = await getBookingsByAssetId(asset.id);
      setBookings(recent);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (asset?.id) {
      loadBookings();
    }
  }, [asset?.id]);
  
  return {
    currentBooking,
    bookings,
    isLoading,
    bookedEmployee,
    loadBookings,
    isBookingExpired,
    getAvailabilityStatus: () => getAvailabilityStatus(currentBooking, bookings),
    countUpcomingBookings: () => countUpcomingBookings(bookings)
  };
}
