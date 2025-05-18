
import { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { getCurrentOrUpcomingBooking } from "@/data/bookings";

export function useAssetBookingStatus(asset: Asset) {
  const [bookingStatus, setBookingStatus] = useState<"available" | "booked" | "available-partial">("available");
  const [loadingBookingStatus, setLoadingBookingStatus] = useState(false);
  
  useEffect(() => {
    // Fetch booking status for pool devices
    const fetchBookingStatus = async () => {
      if (asset.isPoolDevice || asset.status === 'pool') {
        setLoadingBookingStatus(true);
        try {
          const currentBooking = await getCurrentOrUpcomingBooking(asset.id);
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
      }
    };
    
    fetchBookingStatus();
  }, [asset.id, asset.isPoolDevice, asset.status]);

  return { bookingStatus, loadingBookingStatus };
}
