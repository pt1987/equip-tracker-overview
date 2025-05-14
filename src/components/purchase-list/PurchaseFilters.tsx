
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { PurchaseListFilter, PurchaseStatus, GoBDStatus, TaxRate } from "@/lib/purchase-list-types";
import { X } from "lucide-react";

interface PurchaseFiltersProps {
  filters: PurchaseListFilter;
  setFilters: (filters: PurchaseListFilter) => void;
}

export default function PurchaseFilters({ filters, setFilters }: PurchaseFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: filters.dateRange?.from ? new Date(filters.dateRange.from) : undefined,
    to: filters.dateRange?.to ? new Date(filters.dateRange.to) : undefined,
  });

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    // Update local state with the new range, allowing undefined values
    setDateRange({
      from: range.from,
      to: range.to
    });
    
    // Only update filters if at least one date is provided
    if (range.from || range.to) {
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

  const handleSupplierChange = (value: string) => {
    if (value) {
      setFilters({ ...filters, supplier: value });
    } else {
      const { supplier, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleCostCenterChange = (value: string) => {
    if (value) {
      setFilters({ ...filters, costCenter: value });
    } else {
      const { costCenter, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleVatRateChange = (value: string) => {
    if (value) {
      setFilters({ ...filters, vatRate: parseInt(value) as TaxRate });
    } else {
      const { vatRate, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleStatusChange = (value: string) => {
    if (value) {
      setFilters({ ...filters, status: value as PurchaseStatus });
    } else {
      const { status, ...rest } = filters;
      setFilters(rest);
    }
  };

  const handleGoBDStatusChange = (value: string) => {
    if (value) {
      setFilters({ ...filters, gobdStatus: value as GoBDStatus });
    } else {
      const { gobdStatus, ...rest } = filters;
      setFilters(rest);
    }
  };

  const clearAllFilters = () => {
    setFilters({});
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-range">Belegdatum</Label>
          <DateRangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Datumsbereich auswählen"
            align="start"
            locale="de"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Lieferant</Label>
          <Input
            id="supplier"
            value={filters.supplier || ""}
            onChange={(e) => handleSupplierChange(e.target.value)}
            placeholder="Lieferant eingeben"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost-center">Kostenstelle</Label>
          <Input
            id="cost-center"
            value={filters.costCenter || ""}
            onChange={(e) => handleCostCenterChange(e.target.value)}
            placeholder="Kostenstelle eingeben"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vat-rate">MwSt-Satz</Label>
          <Select
            value={filters.vatRate?.toString() || "none"}
            onValueChange={handleVatRateChange}
          >
            <SelectTrigger id="vat-rate">
              <SelectValue placeholder="MwSt-Satz auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Alle</SelectItem>
              <SelectItem value="0">0%</SelectItem>
              <SelectItem value="7">7%</SelectItem>
              <SelectItem value="19">19%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || "none"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Status auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Alle</SelectItem>
              <SelectItem value="draft">Entwurf</SelectItem>
              <SelectItem value="pending">Prüfung ausstehend</SelectItem>
              <SelectItem value="approved">Genehmigt</SelectItem>
              <SelectItem value="rejected">Abgelehnt</SelectItem>
              <SelectItem value="exported">Exportiert</SelectItem>
              <SelectItem value="archived">Archiviert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gobd-status">GoBD-Status</Label>
          <Select
            value={filters.gobdStatus || "none"}
            onValueChange={handleGoBDStatusChange}
          >
            <SelectTrigger id="gobd-status">
              <SelectValue placeholder="GoBD-Status auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Alle</SelectItem>
              <SelectItem value="red">Nicht konform</SelectItem>
              <SelectItem value="yellow">Prüfen</SelectItem>
              <SelectItem value="green">GoBD-konform</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
    </div>
  );
}
