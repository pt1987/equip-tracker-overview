
import { Employee, Asset } from "@/lib/types";
import EmployeeImageSection from "./details/EmployeeImageSection";
import EmployeeHeader from "./details/EmployeeHeader";
import EmployeeMetrics from "./details/EmployeeMetrics";
import EmployeeActions from "./details/EmployeeActions";

interface EmployeeDetailViewProps {
  employee: Employee;
  assets: Asset[];
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeDetailView({ 
  employee, 
  assets, 
  onEdit,
  onDelete
}: EmployeeDetailViewProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="relative w-full md:w-auto">
        <EmployeeImageSection employee={employee} />
      </div>
      
      <div className="flex-1 relative">
        <EmployeeHeader employee={employee} />
        
        <EmployeeMetrics 
          employee={employee} 
          assetCount={assets.length} 
        />
        
        <div className="absolute top-0 right-0">
          <EmployeeActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
