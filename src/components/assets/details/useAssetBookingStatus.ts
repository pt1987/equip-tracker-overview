
import { useState, useEffect, useMemo, useCallback } from "react";
import { Asset } from "@/lib/types";
import { getCurrentOrUpcomingBooking } from "@/data/bookings";

export function useAssetBookingStatus(asset: Asset) {
  const [bookingStatus, setBookingStatus] = useState<"available" | "booked" | "available-partial">("available");
  const [loadingBookingStatus, setLoadingBookingStatus] = useState(false);
  
  // Memoize values to prevent unnecessary re-renders
  const isPoolDevice = useMemo(() => 
    asset.isPoolDevice === true || asset.status === 'pool', 
    [asset.isPoolDevice, asset.status]
  );
  
  const assetId = useMemo(() => asset.id, [asset.id]);
  
  const fetchBookingStatus = useCallback(async () => {
    if (!isPoolDevice) return;
    
    setLoadingBookingStatus(true);
    try {
      const currentBooking = await getCurrentOrUpcomingBooking(assetId);
      if (currentBooking && currentBooking.status === 'active') {
        setBookingStatus("booked");
      } else if (currentBooking && currentBooking.status === 'reserved') {
        setBookingStatus("available-partial");
      } else {
        setBookingStatus("available");
      }
    } catch (error) {
      console.error("Error fetching booking status:", error);
    } finally {
      setLoadingBookingStatus(false);
    }
  }, [isPoolDevice, assetId]);
  
  useEffect(() => {
    fetchBookingStatus();
  }, [fetchBookingStatus]);

  return { bookingStatus, loadingBookingStatus };
}
