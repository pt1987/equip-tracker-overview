
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { PurchaseListFilter } from "@/lib/purchase-list-types";
import DateRangeSection from "./filters/DateRangeSection";
import SupplierFilter from "./filters/SupplierFilter";
import CostCenterFilter from "./filters/CostCenterFilter";
import VatRateFilter from "./filters/VatRateFilter";
import StatusFilter from "./filters/StatusFilter";
import GoBDStatusFilter from "./filters/GoBDStatusFilter";

interface PurchaseFiltersProps {
  filters: PurchaseListFilter;
  setFilters: (filters: PurchaseListFilter) => void;
}

export default function PurchaseFilters({ filters, setFilters }: PurchaseFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.dateRange?.from || filters.dateRange?.to
      ? {
          from: filters.dateRange.from ? new Date(filters.dateRange.from) : undefined,
          to: filters.dateRange.to ? new Date(filters.dateRange.to) : undefined,
        }
      : undefined
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
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
  };

  const clearAllFilters = () => {
    setFilters({});
    setDateRange(undefined);
  };

  const handleFilterChange = (field: string, value: any) => {
    if (value) {
      setFilters({ ...filters, [field]: value });
    } else {
      const newFilters = { ...filters };
      delete newFilters[field as keyof PurchaseListFilter];
      setFilters(newFilters);
    }
  };

  const isAnyFilterApplied = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <DateRangeSection 
          dateRange={dateRange} 
          onChange={handleDateRangeChange} 
        />

        <SupplierFilter 
          value={filters.supplier || ""} 
          onChange={(value) => handleFilterChange("supplier", value)} 
        />

        <CostCenterFilter 
          value={filters.costCenter || ""} 
          onChange={(value) => handleFilterChange("costCenter", value)} 
        />

        <VatRateFilter 
          value={filters.vatRate?.toString() || "none"} 
          onChange={(value) => handleFilterChange("vatRate", value !== "none" ? parseInt(value) : undefined)} 
        />

        <StatusFilter 
          value={filters.status || "none"} 
          onChange={(value) => handleFilterChange("status", value !== "none" ? value : undefined)} 
        />

        <GoBDStatusFilter 
          value={filters.gobdStatus || "none"} 
          onChange={(value) => handleFilterChange("gobdStatus", value !== "none" ? value : undefined)} 
        />
      </div>

      {isAnyFilterApplied && (
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            onClick={clearAllFilters} 
            size="sm"
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Filter zurücksetzen
          </Button>
        </div>
      )}
    </div>
  );
}
