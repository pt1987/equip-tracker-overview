
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { de } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface DateRangeSectionProps {
  dateRange: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export default function DateRangeSection({ dateRange, onChange }: DateRangeSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="date-range">Belegdatum</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Filtert die Belege nach Belegdatum. Wählen Sie einen Zeitraum aus, für den Sie Belege anzeigen möchten.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <DateRangePicker
        value={dateRange}
        onChange={onChange}
        placeholder="Datumsbereich auswählen"
        align="start"
        locale={de}
      />
    </div>
  );
}
