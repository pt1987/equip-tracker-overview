
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { Asset, AssetBooking, Employee } from "@/lib/types";
import { getCurrentOrUpcomingBooking, getBookingsByAssetId } from "@/data/bookings";
import { getEmployeeById } from "@/data/employees";
import BookingDialog from "@/components/bookings/BookingDialog";
import AssetStatusIndicator from "@/components/bookings/AssetStatusIndicator";

interface AssetBookingSectionProps {
  asset: Asset;
  employees: Employee[];
  refetchAsset: () => void;
}

export default function AssetBookingSection({ asset, employees, refetchAsset }: AssetBookingSectionProps) {
  const [currentBooking, setCurrentBooking] = useState<AssetBooking | null>(null);
  const [bookings, setBookings] = useState<AssetBooking[]>([]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedEmployee, setBookedEmployee] = useState<Employee | null>(null);
  
  // Load current booking and recent bookings
  const loadBookings = async () => {
    setIsLoading(true);
    try {
      // Get current or upcoming booking
      const current = await getCurrentOrUpcomingBooking(asset.id);
      setCurrentBooking(current);
      
      // If there's a current booking, get employee details
      if (current) {
        const employee = await getEmployeeById(current.employeeId);
        setBookedEmployee(employee || null);
      }
      
      // Get recent bookings
      const recent = await getBookingsByAssetId(asset.id);
      setBookings(recent);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (asset?.id) {
      loadBookings();
    }
  }, [asset?.id]);
  
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
  
  // Determine the availability status
  const getAvailabilityStatus = () => {
    if (currentBooking && currentBooking.status === 'active') {
      return "booked";
    } else if (bookings.length > 0 && bookings.some(b => b.status === 'reserved')) {
      return "available-partial";
    } else {
      return "available";
    }
  };
  
  // Count upcoming bookings
  const countUpcomingBookings = () => {
    return bookings.filter(b => b.status === 'reserved').length;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
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
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Aktualisieren
            </Button>
            {(asset.status === 'pool' || asset.isPoolDevice === true) && (currentBooking === null || currentBooking?.status !== 'active') && (
              <Button
                size="sm"
                onClick={handleBook}
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Buchen
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2">Aktueller Status</h3>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  {currentBooking ? (
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
                            <div className="text-sm text-muted-foreground">
                              {format(parseISO(currentBooking.startDate), "dd.MM.yyyy HH:mm")} - 
                              {format(parseISO(currentBooking.endDate), "dd.MM.yyyy HH:mm")}
                            </div>
                          </div>
                        </div>
                      </div>
                      {currentBooking.purpose && (
                        <div className="mt-2 text-sm border-t pt-2">
                          <span className="font-medium">Zweck:</span> {currentBooking.purpose}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border p-3 rounded-md bg-muted/20">
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800">
                        Verfügbar
                      </Badge>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Dieses Gerät ist aktuell nicht gebucht und kann reserviert werden.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {bookings.length > 0 && (
              <div>
                <h3 className="text-md font-medium mb-2">Letzte Buchungen</h3>
                <div className="border rounded-md divide-y">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            {format(parseISO(booking.startDate), "dd.MM.yyyy")} - 
                            {format(parseISO(booking.endDate), "dd.MM.yyyy")}
                          </div>
                          {booking.returnInfo?.returned && (
                            <Badge variant="outline" className="mt-1">
                              Zurückgegeben am {format(parseISO(booking.returnInfo.returnedAt!), "dd.MM.yyyy")}
                            </Badge>
                          )}
                        </div>
                        <Badge variant={booking.status === 'completed' ? 'outline' : 
                                        booking.status === 'active' ? 'default' :
                                        booking.status === 'reserved' ? 'secondary' : 'destructive'}>
                          {booking.status === 'completed' ? 'Abgeschlossen' :
                           booking.status === 'active' ? 'Aktiv' :
                           booking.status === 'reserved' ? 'Reserviert' : 'Storniert'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
