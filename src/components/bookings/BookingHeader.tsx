
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AssetBooking, Asset } from "@/lib/types";
import { useMemo } from "react";
import { calculateBookingStats } from "@/data/bookings";

interface BookingHeaderProps {
  filteredAssetsCount: number;
  onRefresh: () => void;
  isLoading: boolean;
  bookings: AssetBooking[];
  assets: Asset[];
  onCreateBooking: () => void;
}

export default function BookingHeader({ 
  filteredAssetsCount, 
  onRefresh, 
  isLoading,
  bookings,
  assets,
  onCreateBooking
}: BookingHeaderProps) {
  const isMobile = useIsMobile();

  // Calculate real booking statistics using centralized utility
  const bookingStats = useMemo(() => {
    // Filter assets for pool devices only
    const poolAssetIds = assets
      .filter(asset => asset.isPoolDevice === true || asset.status === 'pool')
      .map(asset => asset.id);
    
    console.log("BookingHeader - Pool assets:", poolAssetIds.length);
    console.log("BookingHeader - All bookings:", bookings.length);
    
    const stats = calculateBookingStats(bookings, poolAssetIds);
    const totalPoolDevices = poolAssetIds.length;
    const availableCount = Math.max(0, totalPoolDevices - stats.active);
    
    console.log("BookingHeader - Final stats:", {
      totalPoolDevices,
      activeBookings: stats.active,
      reservedBookings: stats.reserved,
      availableCount
    });
    
    return {
      available: availableCount,
      active: stats.active,
      reserved: stats.reserved,
      total: totalPoolDevices
    };
  }, [bookings, assets]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight text-n26-primary`}>
            Poolgeräte Buchungen
          </h1>
          <p className="text-n26-primary/70">
            Verwalten Sie Buchungen für {filteredAssetsCount} verfügbare Poolgeräte
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={onRefresh}
            disabled={isLoading}
            className="border-n26-primary/30 text-n26-primary hover:bg-n26-secondary/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''} ${isMobile ? '' : 'mr-2'}`} />
            {!isMobile && "Aktualisieren"}
          </Button>
          
          <Button 
            size={isMobile ? "sm" : "default"}
            className="bg-gradient-to-r from-n26-primary to-n26-accent hover:from-n26-primary/90 hover:to-n26-accent/90"
            onClick={onCreateBooking}
          >
            <Plus className={`h-4 w-4 ${isMobile ? '' : 'mr-2'}`} />
            {!isMobile && "Neue Buchung"}
          </Button>
        </div>
      </div>
      
      {/* Stats Cards with real data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/50 backdrop-blur-sm border border-n26-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-n26-accent" />
            <span className="text-sm font-medium text-n26-primary">Verfügbar</span>
          </div>
          <p className="text-2xl font-bold text-n26-primary mt-1">{bookingStats.available}</p>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm border border-n26-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium text-n26-primary">Aktiv</span>
          </div>
          <p className="text-2xl font-bold text-n26-primary mt-1">{bookingStats.active}</p>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm border border-n26-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full" />
            <span className="text-sm font-medium text-n26-primary">Reserviert</span>
          </div>
          <p className="text-2xl font-bold text-n26-primary mt-1">{bookingStats.reserved}</p>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm border border-n26-secondary/30 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-gray-400 rounded-full" />
            <span className="text-sm font-medium text-n26-primary">Gesamt</span>
          </div>
          <p className="text-2xl font-bold text-n26-primary mt-1">{bookingStats.total}</p>
        </div>
      </div>
    </div>
  );
}
