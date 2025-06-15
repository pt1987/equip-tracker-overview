
import { useState } from "react";
import { AssetBooking } from "@/lib/types";
import { updateBookingStatus, recordAssetReturn } from "@/data/bookings";
import { useToast } from "@/hooks/use-toast";

export function useBookingActions(onRefresh: () => void) {
  const [selectedBooking, setSelectedBooking] = useState<AssetBooking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<AssetBooking | null>(null);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = (booking: AssetBooking) => {
    setSelectedBooking(booking);
  };

  const handleReturnRequest = (booking: AssetBooking) => {
    setSelectedBooking(booking);
    setShowReturnDialog(true);
  };

  const handleCancelRequest = (booking: AssetBooking) => {
    setBookingToCancel(booking);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      await updateBookingStatus(bookingToCancel.id, 'canceled');
      toast({
        title: "Buchung storniert",
        description: "Die Buchung wurde erfolgreich storniert.",
      });
      setBookingToCancel(null);
      onRefresh();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Buchung konnte nicht storniert werden.",
      });
    }
  };

  const handleReturnAsset = async (condition: 'good' | 'damaged' | 'incomplete' | 'lost', comments?: string) => {
    if (!selectedBooking) return;

    try {
      await recordAssetReturn(selectedBooking.id, condition, comments);
      toast({
        title: "Gerät zurückgegeben",
        description: "Das Gerät wurde erfolgreich zurückgegeben.",
      });
      setSelectedBooking(null);
      setShowReturnDialog(false);
      onRefresh();
    } catch (error) {
      console.error("Error returning asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Das Gerät konnte nicht zurückgegeben werden.",
      });
    }
  };

  const closeDialogs = () => {
    setSelectedBooking(null);
    setShowReturnDialog(false);
    setBookingToCancel(null);
  };

  return {
    selectedBooking,
    bookingToCancel,
    showReturnDialog,
    handleViewDetails,
    handleReturnRequest,
    handleCancelRequest,
    handleCancelBooking,
    handleReturnAsset,
    closeDialogs,
    setShowReturnDialog
  };
}
