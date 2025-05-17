
import { memo, useMemo } from "react";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
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

const TableContent = memo(({ 
  items, 
  isLoading, 
  error, 
  onRefresh,
  onViewDetails 
}: TableContentProps) => {
  
  // Memoize the table content to prevent unnecessary re-renders
  const content = useMemo(() => {
    if (error) {
      return <ErrorDisplay error={error} onRefresh={onRefresh} />;
    }

    if (isLoading) {
      return <LoadingTable />;
    }

    if (items.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Belegdatum</TableHead>
              <TableHead>Lieferant</TableHead>
              <TableHead>Artikel-/Güterbezeichnung</TableHead>
              <TableHead className="text-right">Menge</TableHead>
              <TableHead>Einheit</TableHead>
              <TableHead className="text-right">Nettobetrag €</TableHead>
              <TableHead className="text-right">MwSt €</TableHead>
              <TableHead className="text-right">MwSt-Satz %</TableHead>
              <TableHead>Sachkonto</TableHead>
              <TableHead>Kostenstelle</TableHead>
              <TableHead>Asset-ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>GoBD</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRowItem 
                key={item.id} 
                item={item} 
                onViewDetails={onViewDetails}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }, [items, isLoading, error, onRefresh, onViewDetails]);

  return content;
});

TableContent.displayName = "TableContent";

export default TableContent;
