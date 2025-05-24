
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/lib/types";
import MicaCard from "./MicaCard";

interface BudgetUsageCardProps {
  dashboardStats: DashboardStats;
}

export default function BudgetUsageCard({ dashboardStats }: BudgetUsageCardProps) {
  const budgetUsagePercentage = dashboardStats.totalBudget > 0 
    ? Math.round(dashboardStats.totalBudgetUsed / dashboardStats.totalBudget * 100) 
    : 0;
    
  const getUsageColor = () => {
    if (budgetUsagePercentage > 90) return "text-red-500";
    if (budgetUsagePercentage > 75) return "text-amber-500";
    return "text-emerald-500";
  };
  
  const getProgressColor = () => {
    if (budgetUsagePercentage > 90) return "bg-red-500/80";
    if (budgetUsagePercentage > 75) return "bg-amber-500/80";
    return "bg-emerald-500/80";
  };
    
  return (
    <MicaCard className="h-full">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-foreground/90 mb-6">Budget-Nutzung</h3>
        
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wide">Gesamt Budget</p>
              <p className="text-xl font-bold text-foreground/90">
                {dashboardStats.totalBudget.toLocaleString()} €
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wide">Verwendet</p>
              <p className="text-xl font-bold text-foreground/90">
                {dashboardStats.totalBudgetUsed.toLocaleString()} €
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground/70">Auslastungsrate</span>
              <span className={cn("text-sm font-semibold", getUsageColor())}>
                {budgetUsagePercentage}%
              </span>
            </div>
            
            <div className="relative">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div 
                  className={cn("h-full rounded-full", getProgressColor())}
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetUsagePercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MicaCard>
  );
}
