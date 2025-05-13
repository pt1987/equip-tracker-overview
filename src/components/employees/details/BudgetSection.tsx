
import { motion } from "framer-motion";
import { Euro } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface BudgetSectionProps {
  budget: number;
  usedBudget: number;
}

export default function BudgetSection({ budget, usedBudget }: BudgetSectionProps) {
  const budgetPercentage = Math.min(100, Math.round((usedBudget / budget) * 100));
  
  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Euro size={18} />
        <h2 className="text-lg font-semibold">Budget</h2>
      </div>
      
      <div className="text-sm font-medium mb-2 flex justify-between">
        <span>Budget usage</span>
        <span>{budgetPercentage}%</span>
      </div>
      
      <div className="budget-progress-track">
        <motion.div 
          className="budget-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${budgetPercentage}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>{formatCurrency(usedBudget)}</span>
        <span>{formatCurrency(budget)}</span>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-secondary/50">
        <p className="text-sm">
          Remaining budget: <span className="font-medium">{formatCurrency(budget - usedBudget)}</span>
        </p>
      </div>
    </div>
  );
}
