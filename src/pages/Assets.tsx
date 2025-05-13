
import { useState, useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Asset, AssetStatus, AssetType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";

// Import our new components
import AssetHeader from "@/components/assets/AssetHeader";
import AssetSearch from "@/components/assets/AssetSearch";
import AssetFilters from "@/components/assets/AssetFilters";
import AssetGridView from "@/components/assets/AssetGridView";
import AssetListView from "@/components/assets/AssetListView";
import AssetEmptyState from "@/components/assets/AssetEmptyState";
import AssetLoadingState from "@/components/assets/AssetLoadingState";

const AssetsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AssetType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AssetStatus[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const { toast } = useToast();
  
  // Use the centralized getAssets function from data/assets.ts
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
  
  // Extract unique manufacturers from assets for filter
  const manufacturers = Array.from(
    new Set(allAssets.map(asset => asset.manufacturer))
  ).filter(Boolean).sort();

  useEffect(() => {
    if (allAssets && allAssets.length) {
      console.log("Assets loaded in component:", allAssets.length);
    }
  }, [allAssets]);

  // Filter assets based on search term, types, statuses, manufacturers, and employees
  const filteredAssets = allAssets.filter((asset) => {
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

    return matchesSearch && matchesType && matchesStatus && matchesManufacturer && matchesEmployee;
  });
  
  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedManufacturers([]);
    setSelectedEmployees([]);
    setSearchTerm("");
  };

  const totalFiltersActive = selectedTypes.length + selectedStatuses.length + 
    selectedManufacturers.length + selectedEmployees.length;

  // Show more detailed error if one occurs
  if (error) {
    return (
      <PageTransition>
        <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
          <h1 className="text-2xl md:text-3xl font-bold">Assets</h1>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
            <h3 className="font-semibold mb-2">Fehler beim Laden der Assets</h3>
            <p>{error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten"}</p>
            <p className="mt-2 text-sm">Bitte stellen Sie sicher, dass Sie angemeldet sind und über die entsprechenden Berechtigungen verfügen.</p>
          </div>
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
            manufacturers={manufacturers}
            employees={employees}
            clearFilters={clearFilters}
          />
        )}
        
        {/* Content display based on loading state and results */}
        {isLoading ? (
          <AssetLoadingState />
        ) : filteredAssets.length === 0 ? (
          <AssetEmptyState 
            hasAssets={allAssets.length > 0} 
            clearFilters={clearFilters} 
          />
        ) : view === "grid" ? (
          <AssetGridView assets={filteredAssets} />
        ) : (
          <AssetListView assets={filteredAssets} />
        )}
      </div>
    </PageTransition>
  );
};

export default AssetsPage;
