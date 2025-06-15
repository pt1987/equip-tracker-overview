
import { supabase } from "@/integrations/supabase/client";

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
