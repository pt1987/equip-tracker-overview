
import { useState, useEffect } from "react";
import { isAfter, isBefore } from "date-fns";
import { Asset, AssetBooking, Employee, BookingStatus } from "@/lib/types";
import { getCurrentOrUpcomingBooking, getBookingsByAssetId } from "@/data/bookings";
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
  
  // Check if a booking should be marked as expired
  const isBookingExpired = (booking: AssetBooking): boolean => {
    const now = new Date();
    const endDate = new Date(booking.endDate);
    return isBefore(endDate, now);
  };
  
  // Determine the availability status
  const getAvailabilityStatus = () => {
    if (currentBooking && currentBooking.status === 'active' && !isBookingExpired(currentBooking)) {
      return "booked";
    } else if (bookings.length > 0 && bookings.some(b => b.status === 'reserved' && !isBookingExpired(b))) {
      return "available-partial";
    } else {
      return "available";
    }
  };
  
  // Count upcoming bookings (not expired)
  const countUpcomingBookings = () => {
    return bookings.filter(b => b.status === 'reserved' && !isBookingExpired(b)).length;
  };

  // Get display status for a booking
  const getBookingDisplayStatus = (booking: AssetBooking) => {
    if (isBookingExpired(booking)) {
      return "expired";
    }
    return booking.status;
  };

  // Get label for booking status
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "active": return "Aktiv";
      case "reserved": return "Reserviert";
      case "completed": return "Abgeschlossen";
      case "canceled": return "Storniert";
      case "expired": return "Abgelaufen";
      default: return status;
    }
  };

  // Get badge variant for booking status
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "active": return "default";
      case "reserved": return "secondary";
      case "completed": return "outline";
      case "canceled": return "destructive";
      case "expired": return "outline";
      default: return "outline";
    }
  };
  
  return {
    currentBooking,
    bookings,
    isLoading,
    bookedEmployee,
    loadBookings,
    isBookingExpired,
    getAvailabilityStatus,
    countUpcomingBookings,
    getBookingDisplayStatus,
    getStatusLabel,
    getStatusBadgeVariant
  };
}
