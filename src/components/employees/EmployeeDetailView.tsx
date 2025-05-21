
import { Employee, Asset } from "@/lib/types";
import EmployeeImageSection from "./details/EmployeeImageSection";
import EmployeeHeader from "./details/EmployeeHeader";
import EmployeeMetrics from "./details/EmployeeMetrics";
import EmployeeActions from "./details/EmployeeActions";
import QuickStatsSection from "./details/QuickStatsSection";

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
  // Group assets by type
  const assetsByType: Record<string, Asset[]> = {};
  assets.forEach(asset => {
    if (!assetsByType[asset.type]) {
      assetsByType[asset.type] = [];
    }
    assetsByType[asset.type].push(asset);
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full">
        {/* Actions positioned at top right of the container */}
        <div className="absolute top-2 right-2 z-10">
          <EmployeeActions onEdit={onEdit} onDelete={onDelete} />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-auto">
            <EmployeeImageSection employee={employee} />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col">
              <EmployeeHeader employee={employee} />
              
              <EmployeeMetrics 
                employee={employee} 
                assetCount={assets.length} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick stats section between first and second card - more compact */}
      <div className="glass-card p-3">
        <QuickStatsSection assetsByType={assetsByType} />
      </div>
    </div>
  );
}
