
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Asset, AssetBooking } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import DateSelector from "./calendar/DateSelector";
import CalendarLegend from "./calendar/CalendarLegend";
import AssetCalendarList from "./calendar/AssetCalendarList";

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
  const isMobile = useIsMobile();

  useEffect(() => {
    // Update visible assets when the selected date changes
    setVisibleAssets(assets);
  }, [assets, selectedDate]);

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 lg:grid-cols-3 gap-6'}`}>
      <div className={`${isMobile ? 'order-1' : 'col-span-1'}`}>
        <DateSelector 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate}
          assets={assets}
          bookings={bookings}
        />
        
        <CalendarLegend />
      </div>
      
      <div className={`${isMobile ? 'order-2' : 'col-span-1 lg:col-span-2'}`}>
        <h3 className="text-lg font-medium mb-2">
          Geräte für {selectedDate ? format(selectedDate, "dd.MM.yyyy", { locale: de }) : "heute"}
        </h3>
        
        <AssetCalendarList 
          assets={visibleAssets}
          selectedDate={selectedDate}
          bookings={bookings}
          onAssetSelect={onAssetSelect}
        />
      </div>
    </div>
  );
}
