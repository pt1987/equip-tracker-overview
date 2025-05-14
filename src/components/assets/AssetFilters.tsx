
import { useState } from "react";
import { motion } from "framer-motion";
import { AssetStatus, AssetType } from "@/lib/types";
import FiltersHeader from "./filters/FiltersHeader";
import TypeFilter from "./filters/TypeFilter";
import SourceFilter from "./filters/SourceFilter";
import OwnerCompanyFilter from "./filters/OwnerCompanyFilter";
import StatusFilter from "./filters/StatusFilter";
import ManufacturerFilter from "./filters/ManufacturerFilter";
import EmployeeFilter from "./filters/EmployeeFilter";

interface AssetFiltersProps {
  selectedTypes: AssetType[];
  setSelectedTypes: (types: AssetType[]) => void;
  selectedStatuses: AssetStatus[];
  setSelectedStatuses: (statuses: AssetStatus[]) => void;
  selectedManufacturers: string[];
  setSelectedManufacturers: (manufacturers: string[]) => void;
  selectedEmployees: string[];
  setSelectedEmployees: (employees: string[]) => void;
  selectedOwnerCompanies: string[];
  setSelectedOwnerCompanies: (companies: string[]) => void;
  isExternalFilter: boolean | null;
  setIsExternalFilter: (isExternal: boolean | null) => void;
  manufacturers: string[];
  ownerCompanies: string[];
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
  selectedOwnerCompanies,
  setSelectedOwnerCompanies,
  isExternalFilter,
  setIsExternalFilter,
  manufacturers,
  ownerCompanies,
  employees,
  clearFilters
}: AssetFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card p-4 mb-6"
    >
      <FiltersHeader clearFilters={clearFilters} />
      
      <div className="space-y-4">
        {/* Device Type Filter */}
        <TypeFilter 
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
        
        {/* External/Internal Filter */}
        <SourceFilter 
          isExternalFilter={isExternalFilter}
          setIsExternalFilter={setIsExternalFilter}
        />
        
        {/* Owner Company Filter - Only visible when External is selected */}
        {isExternalFilter === true && (
          <OwnerCompanyFilter 
            selectedOwnerCompanies={selectedOwnerCompanies}
            setSelectedOwnerCompanies={setSelectedOwnerCompanies}
            ownerCompanies={ownerCompanies}
          />
        )}
        
        {/* Status Filter */}
        <StatusFilter 
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
        />
        
        {/* Manufacturer Filter */}
        <ManufacturerFilter 
          selectedManufacturers={selectedManufacturers}
          setSelectedManufacturers={setSelectedManufacturers}
          manufacturers={manufacturers}
        />
        
        {/* Employee Filter */}
        <EmployeeFilter 
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          employees={employees}
        />
      </div>
    </motion.div>
  );
};

export default AssetFilters;
