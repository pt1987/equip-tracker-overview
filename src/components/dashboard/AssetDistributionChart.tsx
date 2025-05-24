
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AssetTypeDistribution } from "@/lib/types";
import MicaCard from "./MicaCard";

interface AssetDistributionChartProps {
  assetTypeDistribution: AssetTypeDistribution[];
}

export default function AssetDistributionChart({ assetTypeDistribution }: AssetDistributionChartProps) {
  const total = assetTypeDistribution.reduce((acc, curr) => acc + curr.count, 0);
  
  const getProgressColor = (index: number) => {
    const colors = [
      "bg-blue-500/80",
      "bg-emerald-500/80", 
      "bg-amber-500/80",
      "bg-purple-500/80",
      "bg-rose-500/80",
      "bg-cyan-500/80"
    ];
    return colors[index % colors.length];
  };

  return (
    <MicaCard className="h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-foreground/90 mb-6">Asset-Verteilung</h3>
        
        <div className="flex-1 space-y-5">
          {assetTypeDistribution.map((item, index) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            
            return (
              <motion.div 
                key={item.type}
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/80 capitalize">{item.type}</span>
                  <span className="text-sm text-muted-foreground/80">{item.count} Assets</span>
                </div>
                
                <div className="relative">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div 
                      className={cn("h-full rounded-full", getProgressColor(index))}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MicaCard>
  );
}
