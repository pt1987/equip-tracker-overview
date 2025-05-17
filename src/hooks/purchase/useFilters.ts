
import { useState, useCallback, useEffect, useMemo } from "react";
import { PurchaseListFilter } from "@/lib/purchase-list-types";
import { DateRange } from "react-day-picker";

export function useFilters(
  initialFilters: PurchaseListFilter = {},
  setFiltersCallback?: (filters: PurchaseListFilter) => void
) {
  const [filters, setFilters] = useState<PurchaseListFilter>(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialFilters.dateRange?.from || initialFilters.dateRange?.to
      ? {
          from: initialFilters.dateRange.from ? new Date(initialFilters.dateRange.from) : undefined,
          to: initialFilters.dateRange.to ? new Date(initialFilters.dateRange.to) : undefined,
        }
      : undefined
  );

  // Use memoized handlers to prevent unnecessary re-renders
  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    // Update local state with the new range
    setDateRange(range);
    
    // Create updated filters
    let updatedFilters: PurchaseListFilter;
    
    // Only update filters if date range has values
    if (range?.from || range?.to) {
      updatedFilters = {
        ...filters,
        dateRange: {
          from: range.from ? range.from.toISOString() : "",
          to: range.to ? range.to.toISOString() : "",
        },
      };
    } else {
      // Remove date range filter if both dates are undefined
      const { dateRange, ...rest } = filters;
      updatedFilters = rest;
    }
    
    // Update local state
    setFilters(updatedFilters);
    
    // Call the parent callback if provided
    if (setFiltersCallback) {
      setFiltersCallback(updatedFilters);
    }
  }, [filters, setFiltersCallback]);

  const handleFilterChange = useCallback((field: string, value: any) => {
    let updatedFilters: PurchaseListFilter;
    
    if (value) {
      updatedFilters = { ...filters, [field]: value };
    } else {
      const newFilters = { ...filters };
      delete newFilters[field as keyof PurchaseListFilter];
      updatedFilters = newFilters;
    }
    
    // Update local state
    setFilters(updatedFilters);
    
    // Call the parent callback if provided
    if (setFiltersCallback) {
      setFiltersCallback(updatedFilters);
    }
  }, [filters, setFiltersCallback]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setDateRange(undefined);
    
    // Call the parent callback with empty filters
    if (setFiltersCallback) {
      setFiltersCallback({});
    }
  }, [setFiltersCallback]);

  // Update local state when props change, use effect with proper deps
  useEffect(() => {
    if (JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
      setFilters(initialFilters);
      setDateRange(
        initialFilters.dateRange?.from || initialFilters.dateRange?.to
          ? {
              from: initialFilters.dateRange.from ? new Date(initialFilters.dateRange.from) : undefined,
              to: initialFilters.dateRange.to ? new Date(initialFilters.dateRange.to) : undefined,
            }
          : undefined
      );
    }
  }, [initialFilters]);

  return {
    filters,
    dateRange,
    setFilters,
    handleDateRangeChange,
    handleFilterChange,
    clearAllFilters
  };
}
