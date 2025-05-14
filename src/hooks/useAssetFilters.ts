
import { useState, useMemo } from "react";
import { Asset, AssetStatus, AssetType } from "@/lib/types";

export function useAssetFilters(assets: Asset[]) {
  // State for all filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AssetType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AssetStatus[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedOwnerCompanies, setSelectedOwnerCompanies] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isExternalFilter, setIsExternalFilter] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique manufacturers from assets for filter
  const manufacturers = useMemo(() => {
    return Array.from(
      new Set(assets.map(asset => asset.manufacturer))
    ).filter(Boolean).sort();
  }, [assets]);

  // Extract unique owner companies from external assets for filter
  const ownerCompanies = useMemo(() => {
    return Array.from(
      new Set(
        assets
          .filter(asset => asset.isExternal && asset.ownerCompany)
          .map(asset => asset.ownerCompany)
      )
    ).filter(Boolean).sort() as string[];
  }, [assets]);

  // Filter assets based on all selected criteria
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Check if asset matches search term
      const matchesSearch = searchTerm === "" || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Check if asset matches selected types
      const matchesType = selectedTypes.length === 0 || 
        selectedTypes.includes(asset.type);
      
      // Check if asset matches selected statuses
      const matchesStatus = selectedStatuses.length === 0 || 
        selectedStatuses.includes(asset.status);
      
      // Check if asset matches selected manufacturers
      const matchesManufacturer = selectedManufacturers.length === 0 ||
        selectedManufacturers.includes(asset.manufacturer);

      // Check if asset matches selected employees
      const matchesEmployee = selectedEmployees.length === 0 ||
        (asset.employeeId && selectedEmployees.includes(asset.employeeId));
      
      // Check if asset matches isExternal filter
      const matchesExternal = isExternalFilter === null || 
        asset.isExternal === isExternalFilter;
      
      // Check if asset matches owner company filter
      const matchesOwnerCompany = selectedOwnerCompanies.length === 0 ||
        (asset.ownerCompany && selectedOwnerCompanies.includes(asset.ownerCompany));

      return matchesSearch && 
             matchesType && 
             matchesStatus && 
             matchesManufacturer && 
             matchesEmployee && 
             matchesExternal && 
             matchesOwnerCompany;
    });
  }, [
    assets, 
    searchTerm, 
    selectedTypes, 
    selectedStatuses, 
    selectedManufacturers, 
    selectedEmployees, 
    isExternalFilter, 
    selectedOwnerCompanies
  ]);
  
  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedManufacturers([]);
    setSelectedEmployees([]);
    setSelectedOwnerCompanies([]);
    setIsExternalFilter(null);
    setSearchTerm("");
  };

  const totalFiltersActive = 
    selectedTypes.length + 
    selectedStatuses.length + 
    selectedManufacturers.length + 
    selectedEmployees.length + 
    selectedOwnerCompanies.length + 
    (isExternalFilter !== null ? 1 : 0);

  return {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    selectedStatuses,
    setSelectedStatuses,
    selectedManufacturers,
    setSelectedManufacturers,
    selectedOwnerCompanies,
    setSelectedOwnerCompanies,
    selectedEmployees,
    setSelectedEmployees,
    isExternalFilter,
    setIsExternalFilter,
    showFilters,
    setShowFilters,
    manufacturers,
    ownerCompanies,
    filteredAssets,
    clearFilters,
    totalFiltersActive
  };
}
