
import { AssetBooking, BookingReturnCondition } from "@/lib/types";
import { RawBooking } from "./types";

// Helper function to map database booking to our type
export const mapDbBookingToBooking = (dbBooking: RawBooking): AssetBooking => {
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
    status: dbBooking.status as any,
    createdAt: dbBooking.created_at,
    returnInfo: returnInfo
  };
};
