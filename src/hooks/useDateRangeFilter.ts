
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { subMonths } from "date-fns";

export function useDateRangeFilter() {
  // Default to last 12 months
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 12),
    to: new Date(),
  });

  // Convert to ISO strings for API calls
  const getDateRangeParams = () => {
    if (!dateRange) {
      return { from: undefined, to: undefined };
    }
    
    return {
      from: dateRange.from ? dateRange.from.toISOString() : undefined,
      to: dateRange.to ? dateRange.to.toISOString() : undefined,
    };
  };

  // Filter function to check if a date falls within the selected range
  const isInDateRange = (date: string | Date): boolean => {
    if (!dateRange || (!dateRange.from && !dateRange.to)) {
      return true; // No filter applied
    }

    const dateToCheck = date instanceof Date ? date : new Date(date);
    
    if (dateRange.from && dateRange.to) {
      return dateToCheck >= dateRange.from && dateToCheck <= dateRange.to;
    }
    
    if (dateRange.from) {
      return dateToCheck >= dateRange.from;
    }
    
    if (dateRange.to) {
      return dateToCheck <= dateRange.to;
    }
    
    return true;
  };

  return {
    dateRange,
    setDateRange,
    getDateRangeParams,
    isInDateRange,
  };
}
