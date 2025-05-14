
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, Eye, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import PurchaseItemDialog from "./PurchaseItemDialog";

interface PurchaseListTableProps {
  items: PurchaseItem[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

export default function PurchaseListTable({ items, isLoading, error, onRefresh }: PurchaseListTableProps) {
  const [selectedItem, setSelectedItem] = useState<PurchaseItem | null>(null);

  // Function to get badge color based on GoBD status
  const getGoBDStatusBadge = (status: string) => {
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
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
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
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-12 w-12 text-destructive mb-2" />
        <h3 className="text-lg font-medium mb-1">Fehler beim Laden der Daten</h3>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={onRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (isLoading) {
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
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium mb-1">Keine Einkäufe gefunden</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Es wurden keine Einkäufe gefunden, die den Filterkriterien entsprechen.
        </p>
      </div>
    );
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
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{getGoBDStatusBadge(item.gobdStatus)}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Details anzeigen</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedItem && (
        <PurchaseItemDialog 
          item={selectedItem} 
          open={!!selectedItem} 
          onOpenChange={() => setSelectedItem(null)}
          onUpdate={onRefresh}
        />
      )}
    </div>
  );
}
