
import { useState, useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Asset, AssetStatus, AssetType } from "@/lib/types";
import AssetCard from "@/components/assets/AssetCard";
import SearchFilter from "@/components/shared/SearchFilter";
import ViewToggle from "@/components/shared/ViewToggle";
import { motion } from "framer-motion";
import { 
  SlidersHorizontal, 
  X, 
  Check,
  Monitor,
  SmartphoneIcon,
  TabletIcon,
  MouseIcon,
  KeyboardIcon,
  PackageIcon,
  ArrowRight
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import StatusBadge from "@/components/assets/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAssets } from "@/data/assets";

const AssetTypeIcon = ({ type }: { type: AssetType }) => {
  switch (type) {
    case "laptop":
      return <Monitor size={18} />;
    case "smartphone":
      return <SmartphoneIcon size={18} />;
    case "tablet":
      return <TabletIcon size={18} />;
    case "mouse":
      return <MouseIcon size={18} />;
    case "keyboard":
      return <KeyboardIcon size={18} />;
    case "accessory":
      return <PackageIcon size={18} />;
    default:
      return <PackageIcon size={18} />;
  }
};

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

const AssetsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<AssetType[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<AssetStatus[]>([]);
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

  useEffect(() => {
    if (allAssets && allAssets.length) {
      console.log("Assets loaded in component:", allAssets.length);
    }
  }, [allAssets]);

  // Filter assets based on search term, types, and statuses
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
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
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
  
  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSearchTerm("");
  };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Assets</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view all hardware assets
              {allAssets ? ` (${allAssets.length} total)` : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchFilter 
            placeholder="Search assets..." 
            onSearch={setSearchTerm}
            className="flex-1"
          />
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
            {(selectedTypes.length > 0 || selectedStatuses.length > 0) && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                {selectedTypes.length + selectedStatuses.length}
              </span>
            )}
          </button>
        </div>
        
        {/* Filters */}
        {showFilters && (
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
            </div>
          </motion.div>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <PackageIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No assets found</h3>
            <p className="text-muted-foreground mb-6">
              {allAssets.length > 0 
                ? "There are no assets matching your current filters."
                : "There are no assets in the system yet. Try adding some assets first."}
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset, index) => (
              <AssetCard 
                key={asset.id} 
                asset={asset} 
                index={index} 
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <Link
                key={asset.id}
                to={`/asset/${asset.id}`}
                className="glass-card p-4 flex items-center gap-4 hover:bg-secondary/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {asset.imageUrl ? (
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AssetTypeIcon type={asset.type} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{asset.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {asset.manufacturer} {asset.model}
                  </p>
                </div>
                <div className="hidden md:block w-32">
                  <StatusBadge status={asset.status} />
                </div>
                <div className="hidden md:block w-36">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Type: </span>
                    {asset.type}
                  </p>
                </div>
                <div className="hidden md:block w-32">
                  <p className="text-sm font-medium">
                    {formatCurrency(asset.price)}
                  </p>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AssetsPage;
