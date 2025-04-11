
import { supabase } from "@/integrations/supabase/client";
import { AssetBooking, BookingReturnCondition, BookingStatus } from "@/lib/types";
import { getEmployeeById } from "./employees";
import { getAssetById } from "./assets";
import { format } from "date-fns";

// Define the raw booking type from the database
type RawBooking = {
  id: string;
  asset_id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  purpose: string | null;
  status: string;
  created_at: string;
  return_info: {
    returned?: boolean;
    returned_at?: string;
    condition?: string;
    comments?: string;
    checked_by_id?: string;
    checked_at?: string;
  } | null;
};

// Helper function to safely access the asset_bookings table
// This is a temporary fix until the Supabase types are updated
const bookingsTable = () => {
  // Use any type to bypass TypeScript checks
  return supabase.from('asset_bookings') as any;
};

// Get all bookings
export const getAllBookings = async (): Promise<AssetBooking[]> => {
  try {
    const { data, error } = await bookingsTable()
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }

    return (data || []).map(mapDbBookingToBooking);
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    return [];
  }
};

// Get bookings by asset ID
export const getBookingsByAssetId = async (assetId: string): Promise<AssetBooking[]> => {
  try {
    const { data, error } = await bookingsTable()
      .select('*')
      .eq('asset_id', assetId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error(`Error fetching bookings for asset ${assetId}:`, error);
      throw error;
    }

    return (data || []).map(mapDbBookingToBooking);
  } catch (error) {
    console.error(`Error in getBookingsByAssetId for ${assetId}:`, error);
    return [];
  }
};

// Get bookings by employee ID
export const getBookingsByEmployeeId = async (employeeId: string): Promise<AssetBooking[]> => {
  try {
    const { data, error } = await bookingsTable()
      .select('*')
      .eq('employee_id', employeeId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error(`Error fetching bookings for employee ${employeeId}:`, error);
      throw error;
    }

    return (data || []).map(mapDbBookingToBooking);
  } catch (error) {
    console.error(`Error in getBookingsByEmployeeId for ${employeeId}:`, error);
    return [];
  }
};

// Get a booking by ID
export const getBookingById = async (bookingId: string): Promise<AssetBooking | null> => {
  try {
    const { data, error } = await bookingsTable()
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) {
      console.error(`Error fetching booking ${bookingId}:`, error);
      throw error;
    }

    return data ? mapDbBookingToBooking(data) : null;
  } catch (error) {
    console.error(`Error in getBookingById for ${bookingId}:`, error);
    return null;
  }
};

// Check if an asset is available for booking in a specific period
export const isAssetAvailableForBooking = async (
  assetId: string,
  startDate: string,
  endDate: string,
  excludeBookingId?: string
): Promise<boolean> => {
  try {
    // Query to find any overlapping bookings
    let query = bookingsTable()
      .select('id')
      .eq('asset_id', assetId)
      .not('status', 'eq', 'canceled');
    
    // Add the date range overlap condition
    query = query.or(`start_date,end_date.overlaps.[${startDate},${endDate}]`);

    // Exclude the current booking if we're updating
    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking asset availability:", error);
      throw error;
    }

    // If there are no overlapping bookings, the asset is available
    return (data || []).length === 0;
  } catch (error) {
    console.error(`Error in isAssetAvailableForBooking for ${assetId}:`, error);
    return false;
  }
};

// Create a new booking
export const createBooking = async (
  assetId: string,
  employeeId: string,
  startDate: string,
  endDate: string,
  purpose?: string
): Promise<AssetBooking | null> => {
  try {
    // Check if asset is available for this period
    const isAvailable = await isAssetAvailableForBooking(assetId, startDate, endDate);
    if (!isAvailable) {
      throw new Error("Asset is not available for the requested period");
    }

    // Determine booking status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    let status: BookingStatus = 'reserved';
    if (start <= now && now <= end) {
      status = 'active';
    } else if (now > end) {
      status = 'completed';
    }

    // Create the booking record using a more direct approach
    const bookingData = {
      asset_id: assetId,
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      purpose: purpose || null,
      status: status,
      created_at: new Date().toISOString()
    };

    const { data, error } = await bookingsTable()
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }

    // Update asset status if booking is active
    if (status === 'active') {
      const asset = await getAssetById(assetId);
      if (asset && asset.status === 'pool') {
        await supabase
          .from('assets')
          .update({ status: 'in_use', employee_id: employeeId })
          .eq('id', assetId);
      }
    }

    return data ? mapDbBookingToBooking(data) : null;
  } catch (error) {
    console.error("Error in createBooking:", error);
    return null;
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
): Promise<AssetBooking | null> => {
  try {
    const { data, error } = await bookingsTable()
      .update({ status: status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating booking status for ${bookingId}:`, error);
      throw error;
    }

    // If changing to completed, we might need to update the asset status
    if ((status === 'completed' || status === 'canceled') && data) {
      const booking = mapDbBookingToBooking(data);
      const asset = await getAssetById(booking.assetId);
      
      if (asset && asset.isPoolDevice) {
        await supabase
          .from('assets')
          .update({ 
            status: 'pool', 
            employee_id: null 
          })
          .eq('id', booking.assetId);
      }
    }

    return data ? mapDbBookingToBooking(data) : null;
  } catch (error) {
    console.error(`Error in updateBookingStatus for ${bookingId}:`, error);
    return null;
  }
};

// Record return of a booked asset
export const recordAssetReturn = async (
  bookingId: string,
  condition: BookingReturnCondition,
  comments?: string,
  checkedById?: string
): Promise<AssetBooking | null> => {
  try {
    const returnInfo = {
      returned: true,
      returned_at: new Date().toISOString(),
      condition: condition,
      comments: comments || null,
      checked_by_id: checkedById || null,
      checked_at: checkedById ? new Date().toISOString() : null
    };

    const { data, error } = await bookingsTable()
      .update({
        return_info: returnInfo,
        status: 'completed'
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error(`Error recording return for booking ${bookingId}:`, error);
      throw error;
    }

    if (!data) {
      throw new Error(`No booking found with ID ${bookingId}`);
    }

    // Reset the asset status to pool
    const booking = mapDbBookingToBooking(data);
    await supabase
      .from('assets')
      .update({ 
        status: 'pool', 
        employee_id: null
      })
      .eq('id', booking.assetId);

    // If condition is damaged, update the asset status
    if (condition === 'damaged') {
      await supabase
        .from('assets')
        .update({ status: 'defective' })
        .eq('id', booking.assetId);
    }

    return booking;
  } catch (error) {
    console.error(`Error in recordAssetReturn for ${bookingId}:`, error);
    return null;
  }
};

// Update booking dates
export const updateBookingDates = async (
  bookingId: string,
  startDate: string,
  endDate: string
): Promise<AssetBooking | null> => {
  try {
    // Get the current booking to check availability excluding this booking
    const currentBooking = await getBookingById(bookingId);
    if (!currentBooking) {
      throw new Error("Booking not found");
    }

    // Check if asset is available for the new period
    const isAvailable = await isAssetAvailableForBooking(
      currentBooking.assetId, 
      startDate, 
      endDate,
      bookingId
    );
    
    if (!isAvailable) {
      throw new Error("Asset is not available for the requested period");
    }

    const { data, error } = await bookingsTable()
      .update({
        start_date: startDate,
        end_date: endDate
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating booking dates for ${bookingId}:`, error);
      throw error;
    }

    return data ? mapDbBookingToBooking(data) : null;
  } catch (error) {
    console.error(`Error in updateBookingDates for ${bookingId}:`, error);
    return null;
  }
};

// Check for bookings that need status updates
export const updateBookingStatuses = async (): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    // Update reserved -> active
    await bookingsTable()
      .update({ status: 'active' })
      .eq('status', 'reserved')
      .lte('start_date', now)
      .gt('end_date', now);
    
    // Update active -> completed
    await bookingsTable()
      .update({ status: 'completed' })
      .eq('status', 'active')
      .lte('end_date', now);

  } catch (error) {
    console.error("Error in updateBookingStatuses:", error);
  }
};

// Get current or upcoming booking for an asset
export const getCurrentOrUpcomingBooking = async (assetId: string): Promise<AssetBooking | null> => {
  try {
    const now = new Date().toISOString();
    
    // First check for active booking
    const { data: activeBookings, error: activeError } = await bookingsTable()
      .select('*')
      .eq('asset_id', assetId)
      .eq('status', 'active')
      .lte('start_date', now)
      .gt('end_date', now)
      .order('start_date', { ascending: true })
      .limit(1);
    
    if (activeError) {
      throw activeError;
    }
    
    if (activeBookings && activeBookings.length > 0) {
      return mapDbBookingToBooking(activeBookings[0]);
    }
    
    // If no active booking, check for upcoming booking
    const { data: upcomingBookings, error: upcomingError } = await bookingsTable()
      .select('*')
      .eq('asset_id', assetId)
      .eq('status', 'reserved')
      .gt('start_date', now)
      .order('start_date', { ascending: true })
      .limit(1);
    
    if (upcomingError) {
      throw upcomingError;
    }
    
    if (upcomingBookings && upcomingBookings.length > 0) {
      return mapDbBookingToBooking(upcomingBookings[0]);
    }
    
    return null;
  } catch (error) {
    console.error(`Error in getCurrentOrUpcomingBooking for ${assetId}:`, error);
    return null;
  }
};

// Helper function to map database booking to our type
const mapDbBookingToBooking = (dbBooking: RawBooking): AssetBooking => {
  let returnInfo = null;
  if (dbBooking.return_info) {
    returnInfo = {
      returned: dbBooking.return_info.returned || false,
      returnedAt: dbBooking.return_info.returned_at,
      condition: dbBooking.return_info.condition as BookingReturnCondition,
      comments: dbBooking.return_info.comments,
      checkedById: dbBooking.return_info.checked_by_id,
      checkedAt: dbBooking.return_info.checked_at
    };
  }

  return {
    id: dbBooking.id,
    assetId: dbBooking.asset_id,
    employeeId: dbBooking.employee_id,
    startDate: dbBooking.start_date,
    endDate: dbBooking.end_date,
    purpose: dbBooking.purpose || undefined,
    status: dbBooking.status as BookingStatus,
    createdAt: dbBooking.created_at,
    returnInfo: returnInfo
  };
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

// Format date ranges nicely
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const startFormatted = format(start, 'dd.MM.yyyy HH:mm');
  const endFormatted = format(end, 'dd.MM.yyyy HH:mm');
  
  return `${startFormatted} - ${endFormatted}`;
};

// Helper to check if a date range overlaps with another
export const doDateRangesOverlap = (
  start1: string, 
  end1: string, 
  start2: string, 
  end2: string
): boolean => {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  
  return s1 <= e2 && s2 <= e1;
};
