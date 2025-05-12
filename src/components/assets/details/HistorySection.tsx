
import { AssetHistoryEntry } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AssetHistoryTimeline from "@/components/assets/AssetHistoryTimeline";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";

interface HistorySectionProps {
  assetHistory: AssetHistoryEntry[];
  isHistoryLoading: boolean;
}

export default function HistorySection({ 
  assetHistory, 
  isHistoryLoading 
}: HistorySectionProps) {
  const [history, setHistory] = useState<AssetHistoryEntry[]>([]);

  // Process history entries when they change
  useEffect(() => {
    if (!isHistoryLoading) {
      console.log("Asset history entries received:", assetHistory?.length);
      if (assetHistory?.length > 0) {
        console.log("Sample entry:", assetHistory[0]);
      }
      // Ensure we always have an array
      setHistory(Array.isArray(assetHistory) ? assetHistory : []);
    }
  }, [assetHistory, isHistoryLoading]);

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Asset Historie</CardTitle>
        </div>
        <CardDescription>
          Vollständiger Änderungsverlauf dieses Assets mit Zeitstempel und Benutzer
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {!isHistoryLoading ? (
          history && history.length > 0 ? (
            <AssetHistoryTimeline history={history} />
          ) : (
            <Alert className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Keine Historieneinträge</AlertTitle>
              <AlertDescription>
                Für dieses Asset sind keine Historieneinträge vorhanden. Jede Änderung am Asset wird hier protokolliert.
              </AlertDescription>
            </Alert>
          )
        ) : (
          <div className="space-y-2 py-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
