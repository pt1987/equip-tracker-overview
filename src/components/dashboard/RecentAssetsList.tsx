
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package, Calendar } from "lucide-react";
import StatusBadge from "@/components/assets/StatusBadge";
import { cn } from "@/lib/utils";
import { Asset } from "@/lib/types";
import MicaCard from "./MicaCard";

interface RecentAssetsListProps {
  recentAssets: Asset[];
}

export default function RecentAssetsList({ recentAssets }: RecentAssetsListProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "laptop": return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "smartphone": return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
      case "tablet": return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-600 border-gray-500/30";
    }
  };

  return (
    <MicaCard className="h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-foreground/90 mb-4">Zuletzt hinzugefügte Assets</h3>
        
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3">
            {recentAssets.map((asset, index) => (
              <motion.div 
                key={asset.id} 
                className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={cn("p-2 rounded-lg border backdrop-blur-sm", getTypeColor(asset.type))}>
                  <Package size={16} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium line-clamp-1 text-foreground/90">{asset.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground/70">
                    <Calendar size={12} className="mr-1" />
                    {new Date(asset.purchaseDate).toLocaleDateString()}
                  </div>
                </div>
                
                <StatusBadge status={asset.status} size="sm" />
              </motion.div>
            ))}
            
            {recentAssets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground/60">
                Keine Assets gefunden
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </MicaCard>
  );
}
