
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { de } from "date-fns/locale";
import type { Locale } from "date-fns"; // Import Locale type

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  align?: "center" | "start" | "end";
  locale?: Locale;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Select a date range",
  align = "center",
  locale,
}: DateRangePickerProps) {
  const formatRange = React.useCallback(
    (range: DateRange | undefined) => {
      if (!range) {
        return placeholder;
      }

      const { from, to } = range;

      if (from && to) {
        return `${format(from, "dd.MM.yyyy", { locale })} - ${format(
          to,
          "dd.MM.yyyy",
          { locale }
        )}`;
      }

      if (from) {
        return `${format(from, "dd.MM.yyyy", { locale })} - ?`;
      }

      if (to) {
        return `? - ${format(to, "dd.MM.yyyy", { locale })}`;
      }

      return placeholder;
    },
    [placeholder, locale]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          locale={locale}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
