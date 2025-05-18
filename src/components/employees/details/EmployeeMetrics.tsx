
import { Employee } from "@/lib/types";
import { formatDate, calculateEmploymentDuration, formatCurrency } from "@/lib/utils";
import { CalendarClock, Euro, PackageIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EmployeeMetricsProps {
  employee: Employee;
  assetCount: number;
}

export default function EmployeeMetrics({ employee, assetCount }: EmployeeMetricsProps) {
  const budgetPercentage = Math.min(100, Math.round((employee.usedBudget / employee.budget) * 100));
  const remainingBudget = employee.budget - employee.usedBudget;
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gray-100">
            <CalendarClock size={16} className="text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Startdatum</p>
            <p className="text-sm font-medium">{formatDate(employee.startDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gray-100">
            <CalendarClock size={16} className="text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Beschäftigungsdauer</p>
            <p className="text-sm font-medium">{calculateEmploymentDuration(employee.startDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <div className="p-2 rounded-full bg-gray-100">
            <Euro size={16} className="text-gray-700" />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Budget</p>
              <div className="flex items-center gap-1">
                <p className="text-xs"><span className="font-medium">{formatCurrency(employee.usedBudget)}</span> von {formatCurrency(employee.budget)}</p>
                <p className="text-xs font-medium">({budgetPercentage}%)</p>
              </div>
            </div>
            <Progress 
              value={budgetPercentage} 
              className="h-1.5 my-1" 
              aria-label={`Budget usage: ${budgetPercentage}% of ${formatCurrency(employee.budget)}`}
            />
            <p className="text-xs text-muted-foreground flex justify-between">
              <span>Verfügbar:</span>
              <span className="font-medium text-primary">{formatCurrency(remainingBudget)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
