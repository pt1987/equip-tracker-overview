
import { supabase } from "@/integrations/supabase/client";
import { AssetBooking, BookingStatus } from "@/lib/types";
import { getEmployeeById } from "../employees";
import { format } from "date-fns";
import { addAssetHistoryEntry } from "../assets/history";
import { getUserId } from "@/hooks/use-auth";
import { isAssetAvailableForBooking } from "./availability";
import { mapDbBookingToBooking } from "./mappers";
import { formatDateRange } from "./utils";

// Create a new booking
export const createBooking = async (
  assetId: string,
  employeeId: string,
  startDate: string,
  endDate: string,
  purpose?: string
): Promise<AssetBooking | null> => {
  try {
    console.log("=== createBooking Debug ===");
    console.log("Creating booking with params:", {
      assetId, employeeId, startDate, endDate, purpose
    });
    
    // Verify asset exists and get current state
    const { data: assetData, error: assetError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .single();
    
    if (assetError || !assetData) {
      console.error("Asset not found:", assetError);
      throw new Error("Asset nicht gefunden");
    }
    
    console.log("Asset found for booking:", {
      name: assetData.name,
      status: assetData.status,
      isPoolDevice: assetData.is_pool_device,
      currentEmployee: assetData.employee_id
    });
    
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
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }

    if (!data) {
      throw new Error("Keine Daten nach dem Einfügen zurückgegeben");
    }

    console.log("Booking created successfully:", data);

    // IMPORTANT: Do NOT change asset status or employee assignment for pool devices!
    // Pool devices should remain pool devices and should not be permanently assigned
    // The booking table already tracks who has the device temporarily
    
    console.log("Pool device booking created - asset status and assignment remain unchanged");
    
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
