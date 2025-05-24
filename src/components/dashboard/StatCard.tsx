
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import MicaCard from "./MicaCard";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  colorClass?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  isLoading?: boolean;
  percentage?: number;
  showPercentage?: boolean;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  colorClass = "accent-blue",
  trend,
  trendValue,
  isLoading = false,
  percentage,
  showPercentage = false,
}: StatCardProps) {
  const getAccentColor = () => {
    switch (colorClass) {
      case "text-blue-500": return "accent-blue";
      case "text-green-500": return "accent-emerald";
      case "text-amber-500": return "accent-amber";
      case "text-red-500": return "accent-rose";
      case "text-purple-500": return "accent-purple";
      default: return "accent-blue";
    }
  };

  return (
    <MicaCard className="h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground/80 mb-1">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-muted/30 rounded-md animate-pulse backdrop-blur-sm" />
          ) : (
            <h3 className="text-2xl font-semibold text-foreground/90">{value}</h3>
          )}
        </div>
        <motion.div 
          className={cn(
            "p-3 rounded-xl backdrop-blur-sm border border-white/20",
            "bg-gradient-to-br from-white/10 to-white/5",
            getAccentColor()
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={20} className={cn("drop-shadow-sm", getAccentColor())} />
        </motion.div>
      </div>
      
      <div className="flex justify-between items-center">
        {showPercentage && percentage !== undefined ? (
          <p className="text-sm text-muted-foreground/70">
            <span className={cn("font-medium", getAccentColor())}>{percentage}%</span> aller Assets
          </p>
        ) : description ? (
          <p className="text-sm text-muted-foreground/70">{description}</p>
        ) : (
          <div></div>
        )}
        
        {trend && trendValue && (
          <motion.div 
            className={cn(
              "flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1.5",
              "backdrop-blur-sm border border-white/20",
              trend === "up" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
              trend === "down" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" :
              "bg-gray-500/10 text-gray-600 border-gray-500/20"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
          </motion.div>
        )}
      </div>
    </MicaCard>
  );
}
