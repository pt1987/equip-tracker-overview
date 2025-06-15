import { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getAssets } from "@/data/assets/fetch";
import { getEmployees } from "@/data/employees/fetch";
import { useAssetFilters } from "@/hooks/useAssetFilters";

// Import our components
import AssetHeader from "@/components/assets/AssetHeader";
import AssetSearch from "@/components/assets/AssetSearch";
import AssetFilters from "@/components/assets/AssetFilters";
import AssetContent from "@/components/assets/AssetContent";
import AssetErrorState from "@/components/assets/AssetErrorState";

const AssetsPage = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  
  // Use the centralized getAssets function from data/assets/fetch.ts
  const { data: allAssets = [], isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      console.log("Fetching assets data...");
      try {
        const assets = await getAssets();
        console.log(`Successfully retrieved ${assets.length} assets:`, assets);
        return assets;
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Laden der Assets",
          description: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten"
        });
        throw error;
      }
    },
  });

  // Fetch employees for the employee filter
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const employees = await getEmployees();
        return employees;
      } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
      }
    }
  });
  
  // Use our custom hook to handle filtering logic
  const {
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
  } = useAssetFilters(allAssets);

  // Show more detailed error if one occurs
  if (error) {
    return (
      <PageTransition>
        <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
          <h1 className="text-2xl md:text-3xl font-bold">Assets</h1>
          <AssetErrorState error={error} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        {/* Header component */}
        <AssetHeader 
          assetsCount={allAssets?.length} 
          view={view} 
          onViewChange={setView} 
        />
        
        {/* Search and filter component */}
        <AssetSearch 
          onSearch={setSearchTerm} 
          onToggleFilters={() => setShowFilters(!showFilters)} 
          totalFiltersActive={totalFiltersActive} 
        />
        
        {/* Filters component */}
        {showFilters && (
          <AssetFilters
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            selectedManufacturers={selectedManufacturers}
            setSelectedManufacturers={setSelectedManufacturers}
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            selectedOwnerCompanies={selectedOwnerCompanies}
            setSelectedOwnerCompanies={setSelectedOwnerCompanies}
            isExternalFilter={isExternalFilter}
            setIsExternalFilter={setIsExternalFilter}
            manufacturers={manufacturers}
            ownerCompanies={ownerCompanies}
            employees={employees}
            clearFilters={clearFilters}
          />
        )}
        
        {/* Content display based on loading state and results */}
        <AssetContent 
          isLoading={isLoading}
          filteredAssets={filteredAssets}
          allAssetsLength={allAssets.length}
          view={view}
          clearFilters={clearFilters}
        />
      </div>
    </PageTransition>
  );
};

export default AssetsPage;
