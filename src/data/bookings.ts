import { supabase } from "@/integrations/supabase/client";
import { AssetBooking, BookingReturnCondition, BookingStatus } from "@/lib/types";
import { getEmployeeById } from "./employees";
import { getAssetById } from "./assets";
import { format } from "date-fns";
import { Json } from "@/integrations/supabase/types";
import { addAssetHistoryEntry } from "@/data/assets/history";
import { getUserId } from "@/hooks/use-auth";

// Define the raw booking type from the database
type RawBooking = {
  id: string;
  asset_id: string;
  employee_id: string | null;
  start_date: string;
  end_date: string;
  purpose: string | null;
  status: string;
  created_at: string;
  return_info: Json | null;
};

// Get all bookings with proper error handling and validation
export const getAllBookings = async (): Promise<AssetBooking[]> => {
  try {
    console.log("=== getAllBookings Debug ===");
    
    const { data, error } = await supabase
      .from('asset_bookings')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }

    console.log("Raw booking data from database:", data);
    console.log("Number of bookings found:", data?.length || 0);

    if (!data || data.length === 0) {
      console.log("No bookings found in database");
      return [];
    }

    // Simply map all bookings - don't filter here, let the UI decide what to show
    const allBookings = data.map(mapDbBookingToBooking);
    
    console.log("All mapped bookings:", allBookings.length);
    console.log("Mapped bookings data:", allBookings);
    
    return allBookings;
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    return [];
  }
};

// Get bookings by asset ID
export const getBookingsByAssetId = async (assetId: string): Promise<AssetBooking[]> => {
  try {
    const { data, error } = await supabase
      .from('asset_bookings')
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
    const { data, error } = await supabase
      .from('asset_bookings')
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
    const { data, error } = await supabase
      .from('asset_bookings')
      .select('*')
      .eq('id', bookingId)
      .maybeSingle();

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
    console.log("Checking availability for dates:", { startDate, endDate });
    
    // First, query existing bookings that overlap with the requested period
    let query = supabase
      .from('asset_bookings')
      .select('id')
      .eq('asset_id', assetId)
      .neq('status', 'canceled');
    
    // Check for date range overlap using individual conditions
    query = query
      .or(`and(end_date.gte.${startDate},start_date.lte.${endDate})`);
    
    // Exclude the current booking if we're updating
    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error checking asset availability:", error);
      throw error;
    }

    console.log("Overlapping bookings found:", data?.length || 0, data);
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
    console.log("Creating booking with params:", {
      assetId, employeeId, startDate, endDate, purpose
    });
    
    // Verify asset exists
    const asset = await getAssetById(assetId);
    if (!asset) {
      throw new Error("Asset nicht gefunden");
    }
    
    console.log("Asset found for booking:", asset.name, "Status:", asset.status, "isPoolDevice:", asset.isPoolDevice);
    
    // Check if asset is available for this period
    const isAvailable = await isAssetAvailableForBooking(assetId, startDate, endDate);
    if (!isAvailable) {
      throw new Error("Asset ist für den angegebenen Zeitraum nicht verfügbar");
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

    console.log("Creating booking with status:", status);

    // Create the booking record
    const bookingData = {
      asset_id: assetId,
      employee_id: employeeId,
      start_date: startDate,
      end_date: endDate,
      purpose: purpose || null,
      status: status,
    };

    const { data, error } = await supabase
      .from('asset_bookings')
      .insert(bookingData)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Keine Daten nach dem Einfügen zurückgegeben");
    }

    console.log("Booking created successfully:", data);

    // Update asset status if booking is active and it's a pool device
    if (status === 'active' && (asset.isPoolDevice || asset.status === 'pool')) {
      await supabase
        .from('assets')
        .update({ status: 'in_use', employee_id: employeeId })
        .eq('id', assetId);
      
      console.log("Updated asset status to in_use");
    }
    
    // Add entry to asset history for ISO 27001 compliance
    try {
      const employee = await getEmployeeById(employeeId);
      const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : employeeId;
      const formattedDates = formatDateRange(startDate, endDate);
      const userId = await getUserId();
      
      const historyNote = `${status === 'active' ? 'Aktive' : 'Geplante'} Buchung: ${formattedDates}${purpose ? ` - ${purpose}` : ''}`;
      
      await addAssetHistoryEntry(
        assetId,
        "booking",
        employeeId,
        historyNote,
        userId
      );
      
      console.log("Added booking entry to asset history");
    } catch (historyError) {
      console.error("Error adding booking to history:", historyError);
      // Continue despite history error
    }

    return mapDbBookingToBooking(data);
  } catch (error) {
    console.error("Error in createBooking:", error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus
): Promise<AssetBooking | null> => {
  try {
    const { data, error } = await supabase
      .from('asset_bookings')
      .update({ status: status })
      .eq('id', bookingId)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`Error updating booking status for ${bookingId}:`, error);
      throw error;
    }

    if (!data) {
      return null;
    }
    
    const booking = mapDbBookingToBooking(data);
    
    // If changing to completed, we might need to update the asset status
    if (status === 'completed' || status === 'canceled') {
      const asset = await getAssetById(booking.assetId);
      
      if (asset && (asset.isPoolDevice || asset.status === 'pool')) {
        await supabase
          .from('assets')
          .update({ 
            status: 'pool', 
            employee_id: null 
          })
          .eq('id', booking.assetId);
      }
      
      // Add history entry for booking status change
      try {
        const userId = await getUserId();
        const statusLabel = status === 'completed' ? 'abgeschlossen' : 'storniert';
        
        await addAssetHistoryEntry(
          booking.assetId,
          "booking",
          booking.employeeId,
          `Buchung ${statusLabel}: ${formatDateRange(booking.startDate, booking.endDate)}`,
          userId
        );
        
        console.log("Added booking status change to asset history");
      } catch (historyError) {
        console.error("Error adding booking status change to history:", historyError);
      }
    }

    return booking;
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

    const { data, error } = await supabase
      .from('asset_bookings')
      .update({
        return_info: returnInfo,
        status: 'completed'
      })
      .eq('id', bookingId)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`Error recording return for booking ${bookingId}:`, error);
      throw error;
    }

    if (!data) {
      throw new Error(`No booking found with ID ${bookingId}`);
    }

    const booking = mapDbBookingToBooking(data);
    
    // Reset the asset status to pool
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
    
    // Add history entry for asset return
    try {
      const userId = await getUserId();
      const conditionText = {
        'good': 'in gutem Zustand',
        'damaged': 'beschädigt',
        'incomplete': 'unvollständig',
        'lost': 'verloren'
      }[condition];
      
      await addAssetHistoryEntry(
        booking.assetId,
        "return",
        booking.employeeId,
        `Rückgabe nach Buchung: ${conditionText}${comments ? ` - ${comments}` : ''}`,
        userId
      );
      
      console.log("Added return entry to asset history");
    } catch (historyError) {
      console.error("Error adding return to history:", historyError);
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

    const { data, error } = await supabase
      .from('asset_bookings')
      .update({
        start_date: startDate,
        end_date: endDate
      })
      .eq('id', bookingId)
      .select()
      .maybeSingle();

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

// Update booking statuses based on current time
export const updateBookingStatuses = async (): Promise<void> => {
  try {
    const now = new Date().toISOString();
    
    console.log("=== updateBookingStatuses Debug ===");
    console.log("Updating booking statuses at:", now);
    
    // Get all non-canceled/completed bookings to check
    const { data: allBookings, error: fetchError } = await supabase
      .from('asset_bookings')
      .select('*')
      .not('status', 'in', '(canceled,completed)');

    if (fetchError) {
      console.error("Error fetching bookings for status update:", fetchError);
      return;
    }

    console.log("Bookings to check for status updates:", allBookings?.length || 0);

    if (!allBookings || allBookings.length === 0) {
      console.log("No bookings to update");
      return;
    }

    // Check each booking individually and update if needed
    for (const booking of allBookings) {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const nowDate = new Date(now);
      
      console.log(`Checking booking ${booking.id}:`, {
        current_status: booking.status,
        start_date: booking.start_date,
        end_date: booking.end_date,
        now: now,
        startDate_before_now: startDate <= nowDate,
        endDate_after_now: endDate >= nowDate,
        endDate_before_now: endDate < nowDate
      });

      let newStatus = booking.status;

      // Update reserved -> active (bookings that have started and haven't ended)
      if (booking.status === 'reserved' && startDate <= nowDate && endDate >= nowDate) {
        newStatus = 'active';
        console.log(`Updating booking ${booking.id} from reserved to active`);
      }
      
      // Update active -> completed (bookings that have ended)
      else if (booking.status === 'active' && endDate < nowDate) {
        newStatus = 'completed';
        console.log(`Updating booking ${booking.id} from active to completed`);
      }

      // Apply the update if status changed
      if (newStatus !== booking.status) {
        const { error: updateError } = await supabase
          .from('asset_bookings')
          .update({ status: newStatus })
          .eq('id', booking.id);

        if (updateError) {
          console.error(`Error updating booking ${booking.id}:`, updateError);
        } else {
          console.log(`Successfully updated booking ${booking.id} to ${newStatus}`);
        }
      }
    }
    
  } catch (error) {
    console.error("Error in updateBookingStatuses:", error);
  }
};

// Get current or upcoming booking for an asset
export const getCurrentOrUpcomingBooking = async (assetId: string): Promise<AssetBooking | null> => {
  try {
    const now = new Date().toISOString();
    
    // First check for active booking
    const { data: activeBookings, error: activeError } = await supabase
      .from('asset_bookings')
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
    const { data: upcomingBookings, error: upcomingError } = await supabase
      .from('asset_bookings')
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
    // Safely cast the Json type to our expected structure
    const returnInfoData = dbBooking.return_info as any;
    returnInfo = {
      returned: returnInfoData.returned || false,
      returnedAt: returnInfoData.returned_at,
      condition: returnInfoData.condition as BookingReturnCondition,
      comments: returnInfoData.comments,
      checkedById: returnInfoData.checked_by_id,
      checkedAt: returnInfoData.checked_at
    };
  }

  return {
    id: dbBooking.id,
    assetId: dbBooking.asset_id,
    employeeId: dbBooking.employee_id || "",
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
