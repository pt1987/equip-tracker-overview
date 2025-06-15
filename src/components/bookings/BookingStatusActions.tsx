
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { AssetBooking } from "@/lib/types";

interface BookingStatusActionsProps {
  booking: AssetBooking;
  onViewDetails: (booking: AssetBooking) => void;
  onReturn: (booking: AssetBooking) => void;
  onCancel: (booking: AssetBooking) => void;
}

export default function BookingStatusActions({
  booking,
  onViewDetails,
  onReturn,
  onCancel
}: BookingStatusActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewDetails(booking)}
        title="Details anzeigen"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      {booking.status === 'active' && !booking.returnInfo?.returned && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onReturn(booking)}
          title="Gerät zurückgeben"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
      
      {(booking.status === 'reserved' || booking.status === 'active') && !booking.returnInfo?.returned && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCancel(booking)}
          title="Buchung stornieren"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
