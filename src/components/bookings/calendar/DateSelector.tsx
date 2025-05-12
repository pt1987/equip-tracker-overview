
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
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Datum auswählen</h3>
      <div className={`w-full flex justify-center ${isMobile ? 'mx-auto' : ''}`}>
        <CalendarContainer
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className={`rounded-md border ${isMobile ? 'w-full max-w-[350px]' : ''}`}
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
