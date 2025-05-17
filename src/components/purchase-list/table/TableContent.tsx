
import { memo } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { PurchaseItem } from "@/lib/purchase-list-types";
import TableRowItem from "./TableRowItem";
import LoadingTable from "./LoadingTable";
import ErrorDisplay from "./ErrorDisplay";
import EmptyState from "./EmptyState";

interface TableContentProps {
  items: PurchaseItem[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
  onViewDetails: (item: PurchaseItem) => void;
}

const TableContent = memo(({ items, isLoading, error, onRefresh, onViewDetails }: TableContentProps) => {
  // Show loading state
  if (isLoading) {
    return <LoadingTable />;
  }

  // Show error state
  if (error) {
    return <ErrorDisplay error={error} onRefresh={onRefresh} />;
  }

  // Show empty state if no items
  if (!items.length) {
    return <EmptyState onRefresh={onRefresh} />;
  }

  // Show table with items
  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableBody>
          {items.map((item) => (
            <TableRowItem 
              key={item.id} 
              item={item} 
              onViewDetails={() => onViewDetails(item)} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

TableContent.displayName = "TableContent";

export default TableContent;
