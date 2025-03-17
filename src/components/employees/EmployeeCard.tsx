
import { Employee } from "@/lib/types";
import { getEmployeeAssetsSummary } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Calendar, 
  LaptopIcon,
  SmartphoneIcon
} from "lucide-react";

interface EmployeeCardProps {
  employee: Employee;
  index: number;
}

export default function EmployeeCard({ employee, index }: EmployeeCardProps) {
  const employeeAssets = getEmployeeAssetsSummary(employee.id);
  const budgetPercentage = Math.min(100, Math.round((employee.usedBudget / employee.budget) * 100));
  
  // Format date to display nicely
  const startDate = new Date(employee.startDate).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/employee/${employee.id}`} className="block w-full group">
        <div className="glass-card overflow-hidden hover:shadow-card transition-all duration-300 group-hover:border-primary/20">
          <div className="flex justify-between p-5">
            <div className="flex space-x-4">
              <div className="relative h-16 w-16 flex-shrink-0">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <img 
                    src={employee.imageUrl} 
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {employee.firstName} {employee.lastName}
                </h3>
                <div className="flex items-center mt-1 text-muted-foreground text-sm">
                  <Briefcase size={14} className="mr-1.5" />
                  <span>{employee.position}</span>
                </div>
                <div className="flex items-center mt-1 text-muted-foreground text-sm">
                  <Calendar size={14} className="mr-1.5" />
                  <span>{startDate}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                Cluster
              </div>
              <div className="rounded-full px-2.5 py-1 text-xs font-medium bg-secondary">
                {employee.cluster}
              </div>
            </div>
          </div>
          
          <div className="px-5 pb-5 pt-2">
            <div className="text-sm font-medium mb-1.5 flex justify-between">
              <span>Budget</span>
              <span>{budgetPercentage}%</span>
            </div>
            
            <div className="budget-progress-track">
              <motion.div 
                className="budget-progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${budgetPercentage}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{employee.usedBudget} €</span>
              <span>{employee.budget} €</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-blue-100">
                  <LaptopIcon size={14} className="text-blue-700" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Laptops</div>
                  <div className="text-sm font-medium">
                    {employeeAssets.assetsByType.laptop.length}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-purple-100">
                  <SmartphoneIcon size={14} className="text-purple-700" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Phones</div>
                  <div className="text-sm font-medium">
                    {employeeAssets.assetsByType.smartphone.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
