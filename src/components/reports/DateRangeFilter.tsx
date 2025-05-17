
import React from "react";
import { addMonths, addYears, startOfMonth, startOfQuarter, startOfYear, subMonths, subQuarters, subYears } from "date-fns";
import { CalendarRange } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { de } from "date-fns/locale";

type DateRangePreset = {
  label: string;
  value: string;
  getRange: () => DateRange;
};

const presets: DateRangePreset[] = [
  {
    label: "Aktueller Monat",
    value: "current-month",
    getRange: () => {
      const now = new Date();
      return {
        from: startOfMonth(now),
        to: now,
      };
    },
  },
  {
    label: "Letzter Monat",
    value: "last-month",
    getRange: () => {
      const now = new Date();
      return {
        from: startOfMonth(subMonths(now, 1)),
        to: subMonths(now, 0),
      };
    },
  },
  {
    label: "Letztes Quartal",
    value: "last-quarter",
    getRange: () => {
      const now = new Date();
      return {
        from: startOfQuarter(subQuarters(now, 1)),
        to: startOfQuarter(now),
      };
    },
  },
  {
    label: "Aktuelles Jahr",
    value: "current-year",
    getRange: () => {
      const now = new Date();
      return {
        from: startOfYear(now),
        to: now,
      };
    },
  },
  {
    label: "Letztes Jahr",
    value: "last-year",
    getRange: () => {
      const now = new Date();
      return {
        from: startOfYear(subYears(now, 1)),
        to: startOfYear(now),
      };
    },
  },
  {
    label: "Letzte 6 Monate",
    value: "last-6-months",
    getRange: () => {
      const now = new Date();
      return {
        from: subMonths(now, 6),
        to: now,
      };
    },
  },
  {
    label: "Letzte 12 Monate",
    value: "last-12-months",
    getRange: () => {
      const now = new Date();
      return {
        from: subMonths(now, 12),
        to: now,
      };
    },
  },
  {
    label: "Alle Daten",
    value: "all-time",
    getRange: () => {
      return {
        from: new Date(2000, 0, 1),
        to: new Date(),
      };
    },
  },
];

interface DateRangeFilterProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const handlePresetChange = (presetValue: string) => {
    const preset = presets.find((p) => p.value === presetValue);
    if (preset) {
      onChange(preset.getRange());
    }
  };

  return (
    <div className={`flex flex-col md:flex-row gap-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <CalendarRange className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium">Zeitraum:</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Select onValueChange={handlePresetChange} defaultValue="last-12-months">
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Zeitraum auswählen" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="w-full">
          <DateRangePicker 
            value={value} 
            onChange={onChange} 
            placeholder="Zeitraum auswählen"
            locale={de}
          />
        </div>
      </div>
    </div>
  );
}
