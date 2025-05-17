
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

  return (
    <>
      <TableContent
        items={items}
        isLoading={isLoading}
        error={error}
        onRefresh={onRefresh}
        onViewDetails={handleViewDetails}
      />
      
      {selectedItem && (
        <PurchaseItemDialog 
          item={selectedItem} 
          open={!!selectedItem} 
          onOpenChange={handleCloseDialog}
          onUpdate={onRefresh}
        />
      )}
    </>
  );
});

PurchaseListTable.displayName = "PurchaseListTable";

export default PurchaseListTable;
