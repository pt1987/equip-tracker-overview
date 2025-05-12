
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Asset, AssetBooking } from "@/lib/types";
import AssetStatusIndicator from "../AssetStatusIndicator";
import { getAssetStatusOnDate, getBookingsForAssetOnDate } from "../utils/bookingUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssetCalendarListProps {
  assets: Asset[];
  selectedDate: Date | undefined;
  bookings: AssetBooking[];
  onAssetSelect: (asset: Asset, date?: Date) => void;
}

export default function AssetCalendarList({ 
  assets, 
  selectedDate, 
  bookings, 
  onAssetSelect 
}: AssetCalendarListProps) {
  const isMobile = useIsMobile();

  return (
    <ScrollArea className={`${isMobile ? 'h-[400px]' : 'h-[500px]'}`}>
      <div className="space-y-3 pr-4">
        {assets.map(asset => {
          const assetBookings = getBookingsForAssetOnDate(asset, selectedDate, bookings);
          const status = getAssetStatusOnDate(asset, selectedDate, bookings);
          
          return (
            <Card 
              key={asset.id} 
              className={`cursor-pointer hover:bg-muted/50 transition-colors`}
              onClick={() => onAssetSelect(asset, selectedDate)}
            >
              <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
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
        
        {assets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Keine Poolgeräte gefunden
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
