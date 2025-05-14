
import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils";
import { PurchaseItemHistory } from "@/lib/purchase-list-types";
import { Skeleton } from "@/components/ui/skeleton";

interface PurchaseHistoryListProps {
  purchaseId: string;
}

export default function PurchaseHistoryList({ purchaseId }: PurchaseHistoryListProps) {
  const [history, setHistory] = useState<PurchaseItemHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch the history from the database
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock history data
        const mockHistory: PurchaseItemHistory[] = [
          {
            id: "hist1",
            purchaseItemId: purchaseId,
            timestamp: new Date().toISOString(),
            userId: "user1",
            fieldName: "status",
            oldValue: "draft",
            newValue: "pending",
          },
          {
            id: "hist2",
            purchaseItemId: purchaseId,
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            userId: "user1",
            fieldName: "netAmount",
            oldValue: "120.00",
            newValue: "150.00",
          },
          {
            id: "hist3",
            purchaseItemId: purchaseId,
            timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            userId: "user2",
            fieldName: "itemDescription",
            oldValue: "Laptop",
            newValue: "Laptop ThinkPad X1",
          },
          {
            id: "hist4",
            purchaseItemId: purchaseId,
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            userId: "user1",
            fieldName: "created",
            oldValue: "",
            newValue: "Beleg erstellt",
          },
        ];
        
        setHistory(mockHistory);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [purchaseId]);

  // Function to get user name from user ID (in a real implementation, this would fetch from the database)
  const getUserName = (userId: string) => {
    const users: Record<string, string> = {
      "user1": "Max Mustermann",
      "user2": "Erika Musterfrau",
    };
    return users[userId] || userId;
  };

  // Function to get a descriptive label for the field name
  const getFieldLabel = (fieldName: string) => {
    const labels: Record<string, string> = {
      "status": "Status",
      "netAmount": "Nettobetrag",
      "vatAmount": "MwSt",
      "vatRate": "MwSt-Satz",
      "itemDescription": "Artikelbeschreibung",
      "supplier": "Lieferant",
      "documentDate": "Belegdatum",
      "created": "Erstellung",
    };
    return labels[fieldName] || fieldName;
  };

  // Function to format the value based on field type
  const formatValue = (fieldName: string, value: string) => {
    if (fieldName === "status") {
      const statusLabels: Record<string, string> = {
        "draft": "Entwurf",
        "pending": "Prüfung ausstehend",
        "approved": "Genehmigt",
        "rejected": "Abgelehnt",
        "exported": "Exportiert",
        "archived": "Archiviert",
      };
      return statusLabels[value] || value;
    }
    
    if (fieldName === "netAmount" || fieldName === "vatAmount") {
      return `${value} €`;
    }
    
    if (fieldName === "vatRate") {
      return `${value}%`;
    }
    
    return value;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-4 w-3/4 mb-2" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Keine Änderungshistorie verfügbar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div key={entry.id} className="border rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
            <span className="font-medium">{getFieldLabel(entry.fieldName)}</span>
            <span className="text-muted-foreground text-sm">
              {formatDate(entry.timestamp, true)}
            </span>
          </div>
          
          {entry.fieldName === "created" ? (
            <p>{formatValue(entry.fieldName, entry.newValue)}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-muted-foreground">Alt:</span>
                <p className={entry.oldValue ? "" : "text-muted-foreground italic"}>
                  {entry.oldValue ? formatValue(entry.fieldName, entry.oldValue) : "Kein Wert"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Neu:</span>
                <p className={entry.newValue ? "" : "text-muted-foreground italic"}>
                  {entry.newValue ? formatValue(entry.fieldName, entry.newValue) : "Kein Wert"}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-muted-foreground">
            Geändert von: {getUserName(entry.userId)}
          </div>
        </div>
      ))}
    </div>
  );
}
