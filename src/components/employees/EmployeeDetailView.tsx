
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
      <EmployeeImageSection employee={employee} />
      
      <div className="flex-1">
        <div className="relative">
          <EmployeeActions onEdit={onEdit} onDelete={onDelete} />
          <EmployeeHeader employee={employee} />
        </div>
        
        <EmployeeMetrics 
          employee={employee} 
          assetCount={assets.length} 
        />
      </div>
    </div>
  );
}
