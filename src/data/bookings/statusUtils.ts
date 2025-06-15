
import { isBefore } from "date-fns";
import { AssetBooking, BookingStatus } from "@/lib/types";

/**
 * Check if a booking should be marked as expired
 */
export const isBookingExpired = (booking: AssetBooking): boolean => {
  const now = new Date();
  const endDate = new Date(booking.endDate);
  return isBefore(endDate, now);
};

/**
 * Determine the availability status based on current and upcoming bookings
 */
export const getAvailabilityStatus = (
  currentBooking: AssetBooking | null,
  allBookings: AssetBooking[]
): "available" | "booked" | "available-partial" => {
  if (currentBooking && currentBooking.status === 'active' && !isBookingExpired(currentBooking)) {
    return "booked";
  } else if (allBookings.length > 0 && allBookings.some(b => b.status === 'reserved' && !isBookingExpired(b))) {
    return "available-partial";
  } else {
    return "available";
  }
};

/**
 * Count upcoming bookings (not expired)
 */
export const countUpcomingBookings = (bookings: AssetBooking[]): number => {
  return bookings.filter(b => b.status === 'reserved' && !isBookingExpired(b)).length;
};

/**
 * Get display status for a booking (including expired state)
 */
export const getBookingDisplayStatus = (booking: AssetBooking): string => {
  if (isBookingExpired(booking)) {
    return "expired";
  }
  return booking.status;
};

/**
 * Get label for booking status
 */
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "active": return "Aktiv";
    case "reserved": return "Reserviert";
    case "completed": return "Abgeschlossen";
    case "canceled": return "Storniert";
    case "expired": return "Abgelaufen";
    default: return status;
  }
};

/**
 * Get badge variant for booking status
 */
export const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active": return "default";
    case "reserved": return "secondary";
    case "completed": return "outline";
    case "canceled": return "destructive";
    case "expired": return "outline";
    default: return "outline";
  }
};

/**
 * Calculate booking statistics for a list of bookings
 */
export const calculateBookingStats = (bookings: AssetBooking[], assetIds?: string[]) => {
  const now = new Date();
  
  // Filter bookings by asset IDs if provided
  const filteredBookings = assetIds 
    ? bookings.filter(booking => assetIds.includes(booking.assetId))
    : bookings;
  
  const activeBookings = filteredBookings.filter(booking => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const isTimeActive = startDate <= now && now <= endDate;
    const isStatusActive = booking.status === 'active';
    
    return isStatusActive || (isTimeActive && booking.status !== 'canceled' && booking.status !== 'completed');
  });
  
  const reservedBookings = filteredBookings.filter(booking => {
    const startDate = new Date(booking.startDate);
    const isStatusReserved = booking.status === 'reserved';
    const isFutureBooking = startDate > now;
    
    return isStatusReserved && isFutureBooking;
  });
  
  return {
    active: activeBookings.length,
    reserved: reservedBookings.length,
    total: filteredBookings.length
  };
};
