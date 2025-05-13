
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  SlidersHorizontal, 
  X, 
  Check,
  UserRound,
  Factory
} from "lucide-react";
import { AssetStatus, AssetType } from "@/lib/types";
import AssetTypeIcon from "./AssetTypeIcon";

interface FilterOption {
  label: string;
  value: string;
}

const typeFilters: FilterOption[] = [
  { label: "Laptop", value: "laptop" },
  { label: "Smartphone", value: "smartphone" },
  { label: "Tablet", value: "tablet" },
  { label: "Mouse", value: "mouse" },
  { label: "Keyboard", value: "keyboard" },
  { label: "Accessory", value: "accessory" },
];

const statusFilters: FilterOption[] = [
  { label: "Ordered", value: "ordered" },
  { label: "Delivered", value: "delivered" },
  { label: "In Use", value: "in_use" },
  { label: "Defective", value: "defective" },
  { label: "Repair", value: "repair" },
  { label: "Pool", value: "pool" },
];

interface AssetFiltersProps {
  selectedTypes: AssetType[];
  setSelectedTypes: (types: AssetType[]) => void;
  selectedStatuses: AssetStatus[];
  setSelectedStatuses: (statuses: AssetStatus[]) => void;
  selectedManufacturers: string[];
  setSelectedManufacturers: (manufacturers: string[]) => void;
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  manufacturers: string[];
  employees: Array<{id: string; firstName: string; lastName: string}>;
  clearFilters: () => void;
}

const AssetFilters = ({
  selectedTypes,
  setSelectedTypes,
  selectedStatuses,
  setSelectedStatuses,
  selectedManufacturers,
  setSelectedManufacturers,
  selectedEmployees,
  setSelectedEmployees,
  manufacturers,
  employees,
  clearFilters
}: AssetFiltersProps) => {
  const toggleTypeFilter = (type: AssetType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };
  
  const toggleStatusFilter = (status: AssetStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };
  
  const toggleManufacturerFilter = (manufacturer: string) => {
    if (selectedManufacturers.includes(manufacturer)) {
      setSelectedManufacturers(selectedManufacturers.filter(m => m !== manufacturer));
    } else {
      setSelectedManufacturers([...selectedManufacturers, manufacturer]);
    }
  };

  const toggleEmployeeFilter = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card p-4 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <X size={14} />
          Clear all
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Asset Type</h4>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map(type => (
              <button
                key={type.value}
                onClick={() => toggleTypeFilter(type.value as AssetType)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedTypes.includes(type.value as AssetType)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <AssetTypeIcon type={type.value as AssetType} />
                {type.label}
                {selectedTypes.includes(type.value as AssetType) && (
                  <Check size={14} />
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map(status => (
              <button
                key={status.value}
                onClick={() => toggleStatusFilter(status.value as AssetStatus)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedStatuses.includes(status.value as AssetStatus)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {status.label}
                {selectedStatuses.includes(status.value as AssetStatus) && (
                  <Check size={14} />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Manufacturer Filter */}
        <div>
          <h4 className="text-sm font-medium mb-2">Hersteller</h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
            {manufacturers.map(manufacturer => (
              <button
                key={manufacturer}
                onClick={() => toggleManufacturerFilter(manufacturer)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedManufacturers.includes(manufacturer)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <Factory size={14} />
                {manufacturer}
                {selectedManufacturers.includes(manufacturer) && (
                  <Check size={14} />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Employee Filter */}
        <div>
          <h4 className="text-sm font-medium mb-2">Zugewiesener Mitarbeiter</h4>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
            {employees.map(employee => (
              <button
                key={employee.id}
                onClick={() => toggleEmployeeFilter(employee.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedEmployees.includes(employee.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                <UserRound size={14} />
                {employee.firstName} {employee.lastName}
                {selectedEmployees.includes(employee.id) && (
                  <Check size={14} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetFilters;
