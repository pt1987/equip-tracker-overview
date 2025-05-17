
import { useCallback } from "react";
import { PurchaseItem, PurchaseListFilter } from "@/lib/purchase-list-types";

export function useFilterPurchases() {
  const filterPurchaseItems = useCallback((items: PurchaseItem[], filters: PurchaseListFilter) => {
    let filteredItems = [...items];
    
    // Apply date range filter
    if (filters.dateRange?.from || filters.dateRange?.to) {
      filteredItems = filteredItems.filter(item => {
        const itemDate = new Date(item.documentDate).getTime();
        const fromDate = filters.dateRange?.from ? new Date(filters.dateRange.from).getTime() : 0;
        const toDate = filters.dateRange?.to ? new Date(filters.dateRange.to).getTime() : Infinity;
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    
    // Apply supplier filter
    if (filters.supplier) {
      filteredItems = filteredItems.filter(item => 
        item.supplier.toLowerCase().includes(filters.supplier!.toLowerCase())
      );
    }
    
    // Apply cost center filter
    if (filters.costCenter) {
      filteredItems = filteredItems.filter(item => 
        item.costCenter === filters.costCenter
      );
    }
    
    // Apply VAT rate filter
    if (filters.vatRate !== undefined) {
      filteredItems = filteredItems.filter(item => 
        item.vatRate === filters.vatRate
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filteredItems = filteredItems.filter(item => 
        item.status === filters.status
      );
    }
    
    // Apply GoBD status filter
    if (filters.gobdStatus) {
      filteredItems = filteredItems.filter(item => 
        item.gobdStatus === filters.gobdStatus
      );
    }
    
    // Apply search term filter (new)
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.supplier.toLowerCase().includes(searchTermLower) ||
        item.itemDescription.toLowerCase().includes(searchTermLower) ||
        item.invoiceNumber.toLowerCase().includes(searchTermLower)
      );
    }
    
    return filteredItems;
  }, []);

  return {
    filterPurchaseItems
  };
}
