
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  colorClass?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  colorClass = "text-primary",
  trend,
  trendValue,
  isLoading = false,
}: StatCardProps) {
  return (
    <motion.div 
      className="glass-card p-6 hover-lift"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-8 w-24 bg-muted rounded-md animate-pulse my-1" />
          ) : (
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          )}
        </div>
        <div className={cn("p-3 rounded-lg bg-primary/10", colorClass)}>
          <Icon size={20} className={colorClass} />
        </div>
      </div>
      
      {(description || trend) && (
        <div className="flex justify-between items-center">
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1",
              trend === "up" ? "bg-green-100 text-green-700" :
              trend === "down" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendValue}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
