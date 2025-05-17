
import { useState, memo, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import PurchaseItemDialog from "./PurchaseItemDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PurchaseListTableProps {
  items: PurchaseItem[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

// Memoized components for better performance
const LoadingTable = memo(() => (
  <div>
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
          {Array(5).fill(0).map((_, i) => (
            <TableRow key={i}>
              {Array(14).fill(0).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
));

LoadingTable.displayName = "LoadingTable";

const ErrorDisplay = memo(({ error, onRefresh }: { error: Error, onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <AlertCircle className="h-12 w-12 text-destructive mb-2" />
    <h3 className="text-lg font-medium mb-1">Fehler beim Laden der Daten</h3>
    <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
    <Button onClick={onRefresh} variant="outline" className="gap-2">
      <RefreshCw className="h-4 w-4" />
      Erneut versuchen
    </Button>
  </div>
));

ErrorDisplay.displayName = "ErrorDisplay";

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <h3 className="text-lg font-medium mb-1">Keine Einkäufe gefunden</h3>
    <p className="text-sm text-muted-foreground mb-2">
      Es wurden keine Einkäufe gefunden, die den Filterkriterien entsprechen.
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

// StatusBadge Component
const StatusBadge = memo(({ status }: { status: string }) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="bg-gray-100">Entwurf</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Prüfung ausstehend</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Genehmigt</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Abgelehnt</Badge>;
    case 'exported':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Exportiert</Badge>;
    case 'archived':
      return <Badge variant="outline" className="bg-gray-300 text-gray-800">Archiviert</Badge>;
    default:
      return <Badge variant="outline">Unbekannt</Badge>;
  }
});

StatusBadge.displayName = "StatusBadge";

// GoBDStatusBadge Component
const GoBDStatusBadge = memo(({ status }: { status: string }) => {
  switch (status) {
    case 'red':
      return <Badge variant="destructive" className="bg-red-500">Nicht konform</Badge>;
    case 'yellow':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Prüfen</Badge>;
    case 'green':
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">GoBD-konform</Badge>;
    default:
      return <Badge variant="outline">Unbekannt</Badge>;
  }
});

GoBDStatusBadge.displayName = "GoBDStatusBadge";

// Table Row Component
const TableRowItem = memo(({ item, onViewDetails }: { item: PurchaseItem, onViewDetails: (item: PurchaseItem) => void }) => {
  return (
    <TableRow key={item.id}>
      <TableCell>{formatDate(item.documentDate)}</TableCell>
      <TableCell>{item.supplier}</TableCell>
      <TableCell className="max-w-[200px] truncate" title={item.itemDescription}>
        {item.itemDescription}
      </TableCell>
      <TableCell className="text-right">{item.quantity}</TableCell>
      <TableCell>{item.unit}</TableCell>
      <TableCell className="text-right">{formatCurrency(item.netAmount)}</TableCell>
      <TableCell className="text-right">{formatCurrency(item.vatAmount)}</TableCell>
      <TableCell className="text-right">{item.vatRate}%</TableCell>
      <TableCell>{item.accountNumber}</TableCell>
      <TableCell>{item.costCenter}</TableCell>
      <TableCell>
        {item.assetId ? (
          <a 
            href={`/asset/${item.assetId}`} 
            className="text-primary hover:underline"
          >
            {item.assetId}
          </a>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell><StatusBadge status={item.status} /></TableCell>
      <TableCell><GoBDStatusBadge status={item.gobdStatus} /></TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onViewDetails(item)}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Details anzeigen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Details anzeigen</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
});

TableRowItem.displayName = "TableRowItem";

// Main component
export default function PurchaseListTable({ items, isLoading, error, onRefresh }: PurchaseListTableProps) {
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);

  const handleViewDetails = (item: PurchaseItem) => {
    setSelectedItem(item);
  };

  // Memoize the table to prevent unnecessary re-renders
  const tableContent = useMemo(() => {
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
      <div>
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
                  onViewDetails={handleViewDetails}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }, [items, isLoading, error, onRefresh]);

  return (
    <>
      {tableContent}
      
      {selectedItem && (
        <PurchaseItemDialog 
          item={selectedItem} 
          open={!!selectedItem} 
          onOpenChange={() => setSelectedItem(null)}
          onUpdate={onRefresh}
        />
      )}
    </>
  );
}
