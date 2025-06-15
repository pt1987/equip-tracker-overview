
import { supabase } from "@/integrations/supabase/client";
import { AssetBooking, BookingStatus, BookingReturnCondition } from "@/lib/types";
import { addAssetHistoryEntry } from "../assets/history";
import { getUserId } from "@/hooks/use-auth";
import { getBookingById, isAssetAvailableForBooking } from "./index";
import { mapDbBookingToBooking } from "./mappers";
import { formatDateRange } from "./utils";

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
    
    // IMPORTANT: For pool devices, do NOT change asset status back to pool
    // Pool devices should ALWAYS remain pool devices regardless of booking status
    // Only add history entry for status change
    
    if (status === 'completed' || status === 'canceled') {
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
    
    // IMPORTANT: Do NOT change asset status for pool devices
    // Pool devices should remain pool devices and should not have employee assignments changed
    
    // If condition is damaged, we can update the asset status regardless of type
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
