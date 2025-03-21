
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Employee } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface BudgetDisplayProps {
  employee: Employee;
  budgetInfo: {
    totalBudget: number;
    availableBudget: number;
    budgetExceeded: boolean;
  };
  estimatedPrice: number;
}

export default function BudgetDisplay({ 
  employee,
  budgetInfo, 
  estimatedPrice 
}: BudgetDisplayProps) {
  const { totalBudget, availableBudget, budgetExceeded } = budgetInfo;
  
  // Calculate remaining budget after this order
  const remainingAfterOrder = availableBudget - estimatedPrice;
  const remainingPercentage = Math.max(0, Math.min(100, (remainingAfterOrder / totalBudget) * 100));
  
  // Determine color based on available budget
  const getBudgetColor = () => {
    if (remainingAfterOrder < 0) return "text-destructive";
    if (remainingAfterOrder < totalBudget * 0.2) return "text-amber-500";
    return "text-green-500";
  };
  
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {employee.firstName} {employee.lastName}
            </span>
            <span className="text-sm font-medium">
              Position: {employee.position}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Budget (Gesamt)</span>
              <span>{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bereits verwendet</span>
              <span>{formatCurrency(employee.usedBudget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Aktuell verfügbar</span>
              <span 
                className={budgetExceeded ? "text-destructive font-medium" : "text-primary font-medium"}
              >
                {formatCurrency(availableBudget)}
              </span>
            </div>
            
            <div className="mt-2 pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Geschätzter Bestellwert</span>
                <span>{formatCurrency(estimatedPrice)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Verbleibendes Budget nach Bestellung</span>
                <span className={getBudgetColor() + " font-medium"}>
                  {formatCurrency(remainingAfterOrder)}
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <Progress value={remainingPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0€</span>
                <span>{formatCurrency(totalBudget)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
