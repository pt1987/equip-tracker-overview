
import { memo } from "react";
import { PurchaseListFilter } from "@/lib/purchase-list-types";
import DateRangeSection from "./filters/DateRangeSection";
import SupplierFilter from "./filters/SupplierFilter";
import CostCenterFilter from "./filters/CostCenterFilter";
import VatRateFilter from "./filters/VatRateFilter";
import StatusFilter from "./filters/StatusFilter";
import GoBDStatusFilter from "./filters/GoBDStatusFilter";
import FilterContainer from "./filters/FilterContainer";
import { useFilters } from "@/hooks/purchase/useFilters";

interface PurchaseFiltersProps {
  filters: PurchaseListFilter;
  setFilters: (filters: PurchaseListFilter) => void;
}

const PurchaseFilters = memo(({ filters, setFilters }: PurchaseFiltersProps) => {
  const {
    dateRange,
    handleDateRangeChange,
    handleFilterChange,
    clearAllFilters
  } = useFilters(filters, setFilters);

  const isAnyFilterApplied = Object.keys(filters).length > 0;

  return (
    <FilterContainer 
      hasFilters={isAnyFilterApplied} 
      onClearAll={clearAllFilters}
    >
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
    </FilterContainer>
  );
});

PurchaseFilters.displayName = "PurchaseFilters";

export default PurchaseFilters;
