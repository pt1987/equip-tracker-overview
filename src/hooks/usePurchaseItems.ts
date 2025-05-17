
import { useState, useEffect, useCallback, useMemo } from "react";
import { PurchaseItem, PurchaseListFilter } from "@/lib/purchase-list-types";
import { useMockData } from "./purchase/useMockData";
import { useFilterPurchases } from "./purchase/useFilterPurchases";
import { useExportFeatures } from "./purchase/useExportFeatures";

export function usePurchaseItems(filters: PurchaseListFilter = {}) {
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock data hook
  const { getMockPurchaseItems } = useMockData();
  
  // Filtering logic hook
  const { filterPurchaseItems } = useFilterPurchases();
  
  // Export features hook
  const { exportToDatev, exportForAudit } = useExportFeatures();

  // Memoize the filter key to avoid unnecessary fetches
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch the items from the database
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay
      
      // Get mock items
      const mockItems = getMockPurchaseItems();
      
      // Filter items based on provided filters
      const filteredItems = filterPurchaseItems(mockItems, filters);
      
      setItems(filteredItems);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [filters, getMockPurchaseItems, filterPurchaseItems]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchItems();
    };
    
    fetchData();
  }, [filterKey, fetchItems]);

  const refresh = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    isLoading,
    error,
    refresh,
    exportToDatev,
    exportForAudit
  };
}
