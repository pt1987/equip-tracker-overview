
import { useState, useCallback, useEffect, useMemo } from "react";
import { PurchaseListFilter } from "@/lib/purchase-list-types";
import { DateRange } from "react-day-picker";

export function useFilters(
  initialFilters: PurchaseListFilter = {},
  setFiltersCallback?: (filters: PurchaseListFilter) => void
) {
  // Use useMemo for initial state to avoid recreating objects on each render
  const [filters, setFilters] = useState<PurchaseListFilter>(initialFilters);
  
  // Memoize dateRange to prevent unnecessary re-renders
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialFilters.dateRange?.from || initialFilters.dateRange?.to
      ? {
          from: initialFilters.dateRange.from ? new Date(initialFilters.dateRange.from) : undefined,
          to: initialFilters.dateRange.to ? new Date(initialFilters.dateRange.to) : undefined,
        }
      : undefined
  );

  // Stable reference for callbacks using useCallback
  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
    
    let updatedFilters: PurchaseListFilter;
    
    if (range?.from || range?.to) {
      updatedFilters = {
        ...filters,
        dateRange: {
          from: range.from ? range.from.toISOString() : "",
          to: range.to ? range.to.toISOString() : "",
        },
      };
    } else {
      const { dateRange, ...rest } = filters;
      updatedFilters = rest;
    }
    
    setFilters(updatedFilters);
    
    if (setFiltersCallback) {
      setFiltersCallback(updatedFilters);
    }
  }, [filters, setFiltersCallback]);

  const handleFilterChange = useCallback((field: string, value: any) => {
    if (value) {
      // Use functional updates to ensure we always have the latest state
      setFilters(prevFilters => {
        const newFilters = { ...prevFilters, [field]: value };
        if (setFiltersCallback) {
          setFiltersCallback(newFilters);
        }
        return newFilters;
      });
    } else {
      setFilters(prevFilters => {
        const newFilters = { ...prevFilters };
        delete newFilters[field as keyof PurchaseListFilter];
        if (setFiltersCallback) {
          setFiltersCallback(newFilters);
        }
        return newFilters;
      });
    }
  }, [setFiltersCallback]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setDateRange(undefined);
    
    if (setFiltersCallback) {
      setFiltersCallback({});
    }
  }, [setFiltersCallback]);

  // Use object reference equality check to prevent unnecessary effects
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
