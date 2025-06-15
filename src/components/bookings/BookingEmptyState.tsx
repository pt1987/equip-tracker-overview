
import { AlertTriangle, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetType } from "@/lib/types";

interface BookingEmptyStateProps {
  filteredAssetsCount: number;
  selectedAssetType: AssetType | "all";
  searchTerm: string;
  onCreateBooking: () => void;
}

export default function BookingEmptyState({ 
  filteredAssetsCount, 
  selectedAssetType, 
  searchTerm,
  onCreateBooking 
}: BookingEmptyStateProps) {
  const hasFilters = selectedAssetType !== "all" || searchTerm.length > 0;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center bg-white/30 backdrop-blur-sm border border-n26-secondary/30 rounded-lg">
      <div className="p-4 bg-n26-secondary/20 rounded-full mb-4">
        {filteredAssetsCount === 0 ? (
          <AlertTriangle className="h-12 w-12 text-n26-primary" />
        ) : (
          <Calendar className="h-12 w-12 text-n26-primary" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-n26-primary mb-2">
        {filteredAssetsCount === 0 
          ? "Keine Poolgeräte gefunden" 
          : "Keine Buchungen vorhanden"}
      </h3>
      
      <p className="text-n26-primary/70 max-w-md mb-6">
        {filteredAssetsCount === 0 
          ? hasFilters 
            ? "Keine Poolgeräte entsprechen den aktuellen Filterkriterien. Versuchen Sie, die Filter anzupassen."
            : "Es wurden noch keine Poolgeräte hinzugefügt. Fügen Sie zunächst Geräte hinzu, um Buchungen zu verwalten."
          : "Beginnen Sie mit der ersten Buchung eines Poolgeräts."}
      </p>
      
      {filteredAssetsCount > 0 && (
        <Button 
          onClick={onCreateBooking}
          className="bg-gradient-to-r from-n26-primary to-n26-accent hover:from-n26-primary/90 hover:to-n26-accent/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Erste Buchung erstellen
        </Button>
      )}
    </div>
  );
}
