
import { useState, memo, useCallback } from "react";
import { PurchaseItem } from "@/lib/purchase-list-types";
import PurchaseItemDialog from "./PurchaseItemDialog";
import TableContent from "./table/TableContent";

interface PurchaseListTableProps {
  items: PurchaseItem[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

const PurchaseListTable = memo(({ items, isLoading, error, onRefresh }: PurchaseListTableProps) => {
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);

  const handleViewDetails = useCallback((item: PurchaseItem) => {
    setSelectedItem(item);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // Ensure refresh callback is properly wrapped and logs debug info
  const handleRefresh = useCallback(() => {
    console.log("Refreshing purchase list data");
    onRefresh();
  }, [onRefresh]);

  return (
    <>
      <TableContent
        items={items}
        isLoading={isLoading}
        error={error}
        onRefresh={handleRefresh}
        onViewDetails={handleViewDetails}
      />
      
      {selectedItem && (
        <PurchaseItemDialog 
          item={selectedItem} 
          open={!!selectedItem} 
          onOpenChange={handleCloseDialog}
          onUpdate={handleRefresh}
        />
      )}
    </>
  );
});

PurchaseListTable.displayName = "PurchaseListTable";

export default PurchaseListTable;
