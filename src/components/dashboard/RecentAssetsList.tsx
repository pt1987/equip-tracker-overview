
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Calendar } from "lucide-react";
import StatusBadge from "@/components/assets/StatusBadge";
import { cn } from "@/lib/utils";
import { Asset } from "@/lib/types";

interface RecentAssetsListProps {
  recentAssets: Asset[];
}

export default function RecentAssetsList({ recentAssets }: RecentAssetsListProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Zuletzt hinzugefügte Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-4">
              {recentAssets.map((asset) => (
                <div key={asset.id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="mt-1">
                    <div className={cn("p-2 rounded-md", 
                      asset.type === "laptop" ? "bg-blue-100 text-blue-700" : 
                      asset.type === "smartphone" ? "bg-green-100 text-green-700" : 
                      asset.type === "tablet" ? "bg-purple-100 text-purple-700" : 
                      "bg-gray-100 text-gray-700")}>
                      <Package size={16} />
                    </div>
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{asset.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar size={12} className="mr-1" />
                      {new Date(asset.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                  <StatusBadge status={asset.status} size="sm" />
                </div>
              ))}
              
              {recentAssets.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Keine Assets gefunden</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
