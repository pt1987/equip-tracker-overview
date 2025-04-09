
import { AssetHistoryEntry } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AssetHistoryTimeline from "@/components/assets/AssetHistoryTimeline";

interface HistorySectionProps {
  assetHistory: AssetHistoryEntry[];
  isHistoryLoading: boolean;
}

export default function HistorySection({ 
  assetHistory, 
  isHistoryLoading 
}: HistorySectionProps) {
  return (
    <Card className="shadow-sm mt-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Asset Historie</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {!isHistoryLoading ? (
          <AssetHistoryTimeline history={assetHistory} />
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
}
