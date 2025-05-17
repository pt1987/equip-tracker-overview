
import { useState, useCallback } from "react";
import { PurchaseListFilter } from "@/lib/purchase-list-types";
import { DateRange } from "react-day-picker";

export function useFilters() {
  const [filters, setFilters] = useState<PurchaseListFilter>({});
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.dateRange?.from || filters.dateRange?.to
      ? {
          from: filters.dateRange.from ? new Date(filters.dateRange.from) : undefined,
          to: filters.dateRange.to ? new Date(filters.dateRange.to) : undefined,
        }
      : undefined
  );

  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    // Update local state with the new range
    setDateRange(range);
    
    // Only update filters if date range has values
    if (range?.from || range?.to) {
      setFilters({
        ...filters,
        dateRange: {
          from: range.from ? range.from.toISOString() : "",
          to: range.to ? range.to.toISOString() : "",
        },
      });
    } else {
      // Remove date range filter if both dates are undefined
      const { dateRange, ...rest } = filters;
      setFilters(rest);
    }
  }, [filters]);

  const handleFilterChange = useCallback((field: string, value: any) => {
    if (value) {
      setFilters(prev => ({ ...prev, [field]: value }));
    } else {
      const newFilters = { ...filters };
      delete newFilters[field as keyof PurchaseListFilter];
      setFilters(newFilters);
    }
  }, [filters]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setDateRange(undefined);
  }, []);

  return {
    filters,
    dateRange,
    setFilters,
    handleDateRangeChange,
    handleFilterChange,
    clearAllFilters
  };
}
