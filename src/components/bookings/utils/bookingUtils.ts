
import { Asset, AssetBooking } from "@/lib/types";
import { doDateRangesOverlap } from "@/data/bookings";

/**
 * Find bookings for a specific asset on the selected date
 */
export const getBookingsForAssetOnDate = (
  asset: Asset, 
  date: Date | undefined, 
  bookings: AssetBooking[]
): AssetBooking[] => {
  if (!date) return [];
  
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  return bookings.filter(booking => 
    booking.assetId === asset.id && 
    doDateRangesOverlap(
      booking.startDate, 
      booking.endDate, 
      dayStart.toISOString(), 
      dayEnd.toISOString()
    )
  );
};

/**
 * Get status of an asset on a specific date
 */
export const getAssetStatusOnDate = (
  asset: Asset, 
  date: Date | undefined, 
  bookings: AssetBooking[]
): "available" | "booked" | "available-partial" => {
  const assetBookings = getBookingsForAssetOnDate(asset, date, bookings);
  
  if (!assetBookings.length) {
    return "available";
  }
  
  // Check if any booking covers the full day
  const fullDayBooking = assetBookings.some(booking => {
    const bookingStart = new Date(booking.startDate);
    const bookingEnd = new Date(booking.endDate);
    
    bookingStart.setHours(0, 0, 0, 0);
    bookingEnd.setHours(23, 59, 59, 999);
    
    return bookingStart <= date! && date! <= bookingEnd;
  });
  
  return fullDayBooking ? "booked" : "available-partial";
};
