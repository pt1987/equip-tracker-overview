
import { useState, useEffect } from "react";
import { format, parseISO, addDays, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarContainer } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Asset, AssetBooking } from "@/lib/types";
import AssetStatusIndicator from "./AssetStatusIndicator";
import { doDateRangesOverlap } from "@/data/bookings";

interface BookingCalendarViewProps {
  assets: Asset[];
  bookings: AssetBooking[];
  onAssetSelect: (asset: Asset, date?: Date) => void;
}

export default function BookingCalendarView({ 
  assets, 
  bookings, 
  onAssetSelect 
}: BookingCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [visibleAssets, setVisibleAssets] = useState<Asset[]>(assets);

  useEffect(() => {
    // Update visible assets when the selected date changes
    setVisibleAssets(assets);
  }, [assets, selectedDate]);

  // Find bookings for a specific asset on the selected date
  const getBookingsForAssetOnDate = (asset: Asset, date?: Date): AssetBooking[] => {
    if (!date) return [];
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    return bookings.filter(booking => 
      booking.assetId === asset.id && 
      doDateRangesOverlap(
        booking.startDate, 
        booking.endDate, 
        dayStart.toISOString(), 
        dayEnd.toISOString()
      )
    );
  };

  // Get status of an asset on a specific date
  const getAssetStatusOnDate = (asset: Asset, date?: Date): "available" | "booked" | "available-partial" => {
    const assetBookings = getBookingsForAssetOnDate(asset, date);
    
    if (!assetBookings.length) {
      return "available";
    }
    
    // Check if any booking covers the full day
    const fullDayBooking = assetBookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      
      bookingStart.setHours(0, 0, 0, 0);
      bookingEnd.setHours(23, 59, 59, 999);
      
      return bookingStart <= date! && date! <= bookingEnd;
    });
    
    return fullDayBooking ? "booked" : "available-partial";
  };

  // Custom calendar day renderer to show booking status
  const renderDay = (day: Date) => {
    // Count how many assets are booked on this day
    const bookedCount = assets.filter(asset => 
      getAssetStatusOnDate(asset, day) === "booked"
    ).length;
    
    const partialCount = assets.filter(asset => 
      getAssetStatusOnDate(asset, day) === "available-partial"
    ).length;
    
    // Determine the color based on availability
    let bgColor = "";
    if (bookedCount === assets.length) {
      bgColor = "bg-red-100 dark:bg-red-900/20";
    } else if (bookedCount > 0 || partialCount > 0) {
      bgColor = "bg-yellow-100 dark:bg-yellow-900/20";
    } else if (assets.length > 0) {
      bgColor = "bg-green-100 dark:bg-green-900/20";
    }

    return (
      <div className={`h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md ${bgColor}`}>
        {format(day, "d")}
        {(bookedCount > 0 || partialCount > 0) && (
          <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Datum auswählen</h3>
          <CalendarContainer
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            locale={de}
            components={{
              Day: ({ date, ...props }) => (
                <div {...props}>
                  {renderDay(date)}
                </div>
              )
            }}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Legende</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/20"></div>
              <span>Alle Geräte verfügbar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-yellow-100 dark:bg-yellow-900/20"></div>
              <span>Einige Geräte verfügbar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-red-100 dark:bg-red-900/20"></div>
              <span>Keine Geräte verfügbar</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-2">
        <h3 className="text-lg font-medium mb-2">
          Geräte für {selectedDate ? format(selectedDate, "dd.MM.yyyy", { locale: de }) : "heute"}
        </h3>
        <ScrollArea className="h-[500px]">
          <div className="space-y-3 pr-4">
            {visibleAssets.map(asset => {
              const assetBookings = getBookingsForAssetOnDate(asset, selectedDate);
              const status = getAssetStatusOnDate(asset, selectedDate);
              
              return (
                <Card 
                  key={asset.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors`}
                  onClick={() => onAssetSelect(asset, selectedDate)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.manufacturer} {asset.model}
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant={asset.type === "laptop" ? "default" : 
                            asset.type === "tablet" ? "secondary" : 
                            asset.type === "smartphone" ? "outline" : "default"}
                          >
                            {asset.type}
                          </Badge>
                          
                          {asset.serialNumber && (
                            <span className="text-xs text-muted-foreground">
                              S/N: {asset.serialNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <AssetStatusIndicator 
                        status={status}
                        bookingCount={assetBookings.length}
                      />
                    </div>
                    
                    {assetBookings.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {assetBookings.map(booking => (
                          <div key={booking.id} className="text-sm border-l-2 border-primary pl-2">
                            <div className="font-medium">
                              {format(parseISO(booking.startDate), "HH:mm")} - {format(parseISO(booking.endDate), "HH:mm")}
                            </div>
                            {booking.purpose && (
                              <div className="text-muted-foreground">{booking.purpose}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {visibleAssets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Keine Poolgeräte gefunden
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
