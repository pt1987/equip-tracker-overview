
import { Button } from "@/components/ui/button";
import { CalendarIcon, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AssetTypeFilter from "./AssetTypeFilter";
import { AssetType } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingControlsProps {
  view: "calendar" | "list";
  setView: (view: "calendar" | "list") => void;
  selectedAssetType: AssetType | "all";
  setSelectedAssetType: (type: AssetType | "all") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function BookingControls({
  view,
  setView,
  selectedAssetType,
  setSelectedAssetType,
  searchTerm,
  setSearchTerm
}: BookingControlsProps) {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white/50 backdrop-blur-sm border border-n26-secondary/30 rounded-lg p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-n26-primary/60 h-4 w-4" />
            <Input
              type="text"
              placeholder="Gerät oder Mitarbeiter suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-n26-secondary/30 focus:border-n26-primary bg-white/70"
            />
          </div>
          
          {/* Asset Type Filter */}
          <AssetTypeFilter 
            selectedType={selectedAssetType} 
            onChange={setSelectedAssetType}
          />
        </div>
        
        {/* View Toggle */}
        <div className="flex border border-n26-secondary/30 rounded-md overflow-hidden bg-white/30">
          <Button
            variant={view === "calendar" ? "default" : "ghost"}
            size="sm"
            className={`rounded-none ${
              view === "calendar" 
                ? "bg-gradient-to-r from-n26-primary to-n26-accent text-white" 
                : "text-n26-primary hover:bg-n26-secondary/20"
            }`}
            onClick={() => setView("calendar")}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Kalender
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className={`rounded-none ${
              view === "list" 
                ? "bg-gradient-to-r from-n26-primary to-n26-accent text-white" 
                : "text-n26-primary hover:bg-n26-secondary/20"
            }`}
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
      </div>
    </div>
  );
}
