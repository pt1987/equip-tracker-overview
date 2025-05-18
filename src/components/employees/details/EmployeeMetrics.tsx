
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-blue-100">
            <CalendarClock size={16} className="text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Startdatum</p>
            <p className="font-medium">{formatDate(employee.startDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-blue-100">
            <CalendarClock size={16} className="text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Beschäftigungsdauer</p>
            <p className="font-medium">{calculateEmploymentDuration(employee.startDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-purple-100">
            <PackageIcon size={16} className="text-purple-700" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Geräte</p>
            <p className="font-medium">{assetCount}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-green-100">
            <Euro size={16} className="text-green-700" />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-xs font-medium">{budgetPercentage}%</p>
            </div>
            <Progress 
              value={budgetPercentage} 
              className="h-1.5 my-1" 
              aria-label={`Budget usage: ${budgetPercentage}% of ${formatCurrency(employee.budget)}`}
            />
            <div className="flex justify-between text-xs">
              <p className="font-medium">{formatCurrency(employee.usedBudget)}</p>
              <p className="font-medium text-muted-foreground">von {formatCurrency(employee.budget)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
