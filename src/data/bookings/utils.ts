
import { format } from "date-fns";
import { getAssetById } from "../assets/fetch";
import { getEmployeeById } from "../employees";
import { getBookingById } from "./fetch";

// Format date ranges nicely
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = format(start, 'dd.MM.yyyy HH:mm');
  const endFormatted = format(end, 'dd.MM.yyyy HH:mm');
  
  return `${startFormatted} - ${endFormatted}`;
};

// Get booking with extended information (asset and employee details)
export const getBookingWithDetails = async (bookingId: string): Promise<any | null> => {
  try {
    const booking = await getBookingById(bookingId);
    if (!booking) return null;
    
    const asset = await getAssetById(booking.assetId);
    const employee = await getEmployeeById(booking.employeeId);
    
    return {
      ...booking,
      asset: asset,
      employee: employee
    };
  } catch (error) {
    console.error(`Error in getBookingWithDetails for ${bookingId}:`, error);
    return null;
  }
};
