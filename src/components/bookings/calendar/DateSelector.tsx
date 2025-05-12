
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarContainer } from "@/components/ui/calendar";
import CalendarDay from "./CalendarDay";
import { Asset, AssetBooking } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  assets: Asset[];
  bookings: AssetBooking[];
}

export default function DateSelector({ 
  selectedDate, 
  onDateSelect,
  assets,
  bookings
}: DateSelectorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-2">
      <h3 className="text-lg font-medium mb-2">Datum auswählen</h3>
      <div className={`flex justify-center ${isMobile ? 'w-full' : ''}`}>
        <CalendarContainer
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className={`rounded-md border shadow-sm ${isMobile ? 'w-full max-w-full' : ''}`}
          locale={de}
          components={{
            Day: ({ date, ...props }) => (
              <div {...props}>
                <CalendarDay day={date} assets={assets} bookings={bookings} />
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}
