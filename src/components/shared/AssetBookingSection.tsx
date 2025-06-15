
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset, Employee } from "@/lib/types";
import { useAssetBookings } from "@/components/bookings/hooks/useAssetBookings";
import BookingDialog from "@/components/bookings/BookingDialog";
import AssetStatusIndicator from "@/components/bookings/AssetStatusIndicator";
import BookingStatusSection from "@/components/bookings/sections/BookingStatusSection";
import BookingHistorySection from "@/components/bookings/sections/BookingHistorySection";
import BookingActionButtons from "@/components/bookings/sections/BookingActionButtons";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssetBookingSectionProps {
  asset: Asset;
  employees: Employee[];
  refetchAsset: () => void;
}

export default function AssetBookingSection({ asset, employees, refetchAsset }: AssetBookingSectionProps) {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    currentBooking,
    bookings,
    isLoading,
    bookedEmployee,
    loadBookings,
    isBookingExpired,
    getAvailabilityStatus,
    countUpcomingBookings,
    getBookingDisplayStatus,
    getStatusLabel,
    getStatusBadgeVariant
  } = useAssetBookings(asset);
  
  const handleRefresh = () => {
    loadBookings();
  };
  
  const handleBook = () => {
    setShowBookingDialog(true);
  };
  
  const handleCloseDialog = () => {
    setShowBookingDialog(false);
    loadBookings();
    refetchAsset();
  };
  
  // Check if there is an active booking
  const hasActiveBooking = currentBooking && 
                          currentBooking.status === 'active' && 
                          !isBookingExpired(currentBooking);

  return (
    <Card className="shadow-sm">
      <CardHeader className={`${isMobile ? 'pb-2 pt-4 px-3' : 'pb-3'}`}>
        <div className={`flex ${isMobile ? 'flex-col' : 'justify-between items-start'}`}>
          <div>
            <CardTitle className="flex items-center gap-2 text-xl mb-1">
              Buchungsstatus
              <AssetStatusIndicator 
                status={getAvailabilityStatus()} 
                bookingCount={countUpcomingBookings()}
              />
            </CardTitle>
            <CardDescription>
              Status des Poolgeräts und aktuelle Buchungen
            </CardDescription>
          </div>
          
          <BookingActionButtons
            asset={asset}
            isLoading={isLoading}
            isActive={hasActiveBooking}
            onRefresh={handleRefresh}
            onBook={handleBook}
          />
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'px-3 pt-0 pb-4' : 'pt-0'}`}>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : (
          <div className="space-y-5">
            <BookingStatusSection 
              currentBooking={currentBooking}
              bookedEmployee={bookedEmployee}
              isLoading={isLoading}
              getAvailabilityStatus={getAvailabilityStatus}
              countUpcomingBookings={countUpcomingBookings}
            />
            
            {bookings.length > 0 && (
              <BookingHistorySection 
                bookings={bookings}
                getBookingDisplayStatus={getBookingDisplayStatus}
                getStatusLabel={getStatusLabel}
                getStatusBadgeVariant={getStatusBadgeVariant}
                assetId={asset.id}
              />
            )}
          </div>
        )}
      </CardContent>

      {showBookingDialog && (
        <BookingDialog
          asset={asset}
          employees={employees}
          onClose={handleCloseDialog}
        />
      )}
    </Card>
  );
}
