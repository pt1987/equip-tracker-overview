
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Asset, Employee, AssetBooking } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import AssetStatusIndicator from "@/components/bookings/AssetStatusIndicator";

interface BookingStatusSectionProps {
  currentBooking: AssetBooking | null;
  bookedEmployee: Employee | null;
  isLoading: boolean;
  getAvailabilityStatus: () => "available" | "booked" | "available-partial";
  countUpcomingBookings: () => number;
}

export default function BookingStatusSection({
  currentBooking,
  bookedEmployee,
  isLoading,
  getAvailabilityStatus,
  countUpcomingBookings
}: BookingStatusSectionProps) {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }
  
  const isBookingExpired = (booking: AssetBooking): boolean => {
    const now = new Date();
    const endDate = new Date(booking.endDate);
    return endDate < now;
  };

  return (
    <div>
      <h3 className={`text-md font-medium mb-2 ${isMobile ? 'text-sm' : ''}`}>Aktueller Status</h3>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {currentBooking && !isBookingExpired(currentBooking) ? (
            <div className="border p-3 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <Badge>{currentBooking.status === 'active' ? 'Aktuell gebucht' : 'Reserviert'}</Badge>
                  <div className="mt-1">
                    <div className="font-medium">
                      {bookedEmployee 
                        ? `${bookedEmployee.firstName} ${bookedEmployee.lastName}` 
                        : "Unbekannter Mitarbeiter"}
                    </div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      {format(parseISO(currentBooking.startDate), "dd.MM.yyyy HH:mm")} - 
                      {format(parseISO(currentBooking.endDate), "dd.MM.yyyy HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
              {currentBooking.purpose && (
                <div className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'} border-t pt-2`}>
                  <span className="font-medium">Zweck:</span> {currentBooking.purpose}
                </div>
              )}
            </div>
          ) : (
            <div className="border p-3 rounded-md bg-muted/20">
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800">
                Verfügbar
              </Badge>
              <div className={`mt-2 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Dieses Gerät ist aktuell nicht gebucht und kann reserviert werden.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
