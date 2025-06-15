
import { supabase } from "@/integrations/supabase/client";
import { AssetBooking } from "@/lib/types";
import { mapDbBookingToBooking } from "./mappers";

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

    // Map all bookings without filtering - let the UI decide what to show
    const allBookings = data.map(mapDbBookingToBooking);
    
    console.log("All mapped bookings:", allBookings.length);
    
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
