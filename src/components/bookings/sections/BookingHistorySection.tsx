
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { AssetBooking } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { addAssetHistoryEntry } from '@/data/assets/history';

interface BookingHistorySectionProps {
  bookings: AssetBooking[];
  getBookingDisplayStatus: (booking: AssetBooking) => string;
  getStatusLabel: (status: string) => string;
  getStatusBadgeVariant: (status: string) => "default" | "secondary" | "destructive" | "outline";
}

export default function BookingHistorySection({
  bookings,
  getBookingDisplayStatus,
  getStatusLabel,
  getStatusBadgeVariant
}: BookingHistorySectionProps) {
  const isMobile = useIsMobile();
  
  if (bookings.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h3 className={`text-md font-medium mb-2 ${isMobile ? 'text-sm' : ''}`}>Letzte Buchungen</h3>
      <div className="border rounded-md divide-y">
        {bookings.slice(0, 5).map(booking => (
          <div key={booking.id} className={`p-3 ${isMobile ? 'text-xs' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {format(parseISO(booking.startDate), "dd.MM.yyyy")} - 
                  {format(parseISO(booking.endDate), "dd.MM.yyyy")}
                </div>
                {booking.returnInfo?.returned && (
                  <Badge variant="outline" className={`mt-1 ${isMobile ? 'text-xs px-1 py-0' : ''}`}>
                    Zurückgegeben am {format(parseISO(booking.returnInfo.returnedAt!), "dd.MM.yyyy")}
                  </Badge>
                )}
              </div>
              <Badge 
                variant={getStatusBadgeVariant(getBookingDisplayStatus(booking))}
                className={isMobile ? 'text-xs px-1 py-0' : ''}
              >
                {getStatusLabel(getBookingDisplayStatus(booking))}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
