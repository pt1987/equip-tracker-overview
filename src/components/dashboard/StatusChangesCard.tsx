
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAssetHistoryEntries } from "@/data/assets/history";
import { getAssets } from "@/data/assets";
import { Link } from "react-router-dom";
import { subDays, format } from "date-fns";
import { de } from "date-fns/locale";
import StatusBadge from "@/components/assets/StatusBadge";
import { Asset, AssetStatus } from "@/lib/types";

export default function StatusChangesCard() {
  const sevenDaysAgo = subDays(new Date(), 7);
  
  const { data: historyEntries = [], isLoading: historyLoading } = useQuery({
    queryKey: ["assetHistory", "statusChanges", sevenDaysAgo.toISOString()],
    queryFn: async () => {
      const entries = await getAssetHistoryEntries();
      return entries.filter(entry => {
        // Filter for status changes within the last 7 days
        const entryDate = new Date(entry.date);
        return entry.action === "status_change" && entryDate >= sevenDaysAgo;
      });
    }
  });
  
  const { data: assets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });
  
  // Map asset IDs to their objects for quick lookup
  const assetMap = assets.reduce<Record<string, Asset>>((map, asset) => {
    map[asset.id] = asset;
    return map;
  }, {});
  
  const isLoading = historyLoading || assetsLoading;

  // Extract the status changes from the notes, which might contain strings like "Status changed: ordered -> delivered"
  function extractStatusChange(notes: string): { from: AssetStatus | null, to: AssetStatus | null } {
    const regex = /Status\s+(?:changed|geändert):\s+(\w+)\s+->\s+(\w+)/i;
    const match = notes.match(regex);
    
    if (match && match.length >= 3) {
      return { 
        from: match[1] as AssetStatus, 
        to: match[2] as AssetStatus 
      };
    }
    
    return { from: null, to: null };
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-500" />
            Statusänderungen (letzte 7 Tage)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Statusänderungen werden geladen...</p>
            </div>
          ) : historyEntries.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Keine Statusänderungen in den letzten 7 Tagen.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Folgende Assets haben in den letzten 7 Tagen ihren Status geändert:
              </p>
              <div className="space-y-2">
                {historyEntries.map((entry) => {
                  const asset = assetMap[entry.assetId];
                  const { from, to } = extractStatusChange(entry.notes);
                  
                  if (!asset) return null;
                  
                  return (
                    <div 
                      key={entry.id} 
                      className="p-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-100 dark:border-green-900"
                    >
                      <div className="flex justify-between">
                        <Link to={`/asset/${asset.id}`} className="font-medium hover:underline">
                          {asset.name}
                        </Link>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.date), "dd.MM.yyyy", { locale: de })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {from && <StatusBadge status={from} />}
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                        {to && <StatusBadge status={to} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
