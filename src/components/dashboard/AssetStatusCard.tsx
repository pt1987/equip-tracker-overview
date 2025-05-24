
import { motion } from "framer-motion";
import StatusBadge from "@/components/assets/StatusBadge";
import { AssetStatusDistribution } from "@/lib/types";
import MicaCard from "./MicaCard";

interface AssetStatusCardProps {
  assetStatusDistribution: AssetStatusDistribution[];
}

export default function AssetStatusCard({ assetStatusDistribution }: AssetStatusCardProps) {
  return (
    <MicaCard className="h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-foreground/90 mb-6">Asset-Status</h3>
        
        <div className="flex-1 space-y-4">
          {assetStatusDistribution.map((item, index) => (
            <motion.div 
              key={item.status} 
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatusBadge status={item.status} size="md" />
              <span className="font-semibold text-xl text-foreground/90">{item.count}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </MicaCard>
  );
}
