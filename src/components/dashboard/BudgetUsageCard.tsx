
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/lib/types";

interface BudgetUsageCardProps {
  dashboardStats: DashboardStats;
}

export default function BudgetUsageCard({ dashboardStats }: BudgetUsageCardProps) {
  const budgetUsagePercentage = dashboardStats.totalBudget > 0 
    ? Math.round(dashboardStats.totalBudgetUsed / dashboardStats.totalBudget * 100) 
    : 0;
    
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Budget-Nutzung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Budget aller Mitarbeiter</p>
                <p className="text-2xl font-bold">{dashboardStats.totalBudget.toLocaleString()} €</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Davon verwendet</p>
                <p className="text-2xl font-bold">{dashboardStats.totalBudgetUsed.toLocaleString()} €</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Auslastungsrate</span>
                <span className={cn(budgetUsagePercentage > 90 ? "text-red-500" : budgetUsagePercentage > 75 ? "text-amber-500" : "text-green-500")}>
                  {budgetUsagePercentage}%
                </span>
              </div>
              <Progress 
                value={budgetUsagePercentage} 
                className={cn("h-2", budgetUsagePercentage > 90 ? "text-red-500" : budgetUsagePercentage > 75 ? "text-amber-500" : "text-green-500")}
                label="Budget Auslastungsrate"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
