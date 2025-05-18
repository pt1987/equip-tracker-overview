
import { Asset } from "@/lib/types";
import AssetImage from "./AssetImage";
import AssetHeaderInfo from "./AssetHeaderInfo";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import AssetStatusIndicator from "@/components/bookings/AssetStatusIndicator";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";

interface AssetMediaSectionProps {
  asset: Asset;
  bookingStatus: "available" | "booked" | "available-partial";
  loadingBookingStatus: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export default function AssetMediaSection({
  asset,
  bookingStatus,
  loadingBookingStatus,
  onEdit,
  onDelete
}: AssetMediaSectionProps) {
  const isSmallScreen = useBreakpoint('sm');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className={`${isSmallScreen ? 'order-2' : ''}`}>
        <AssetImage imageUrl={asset.imageUrl} altText={asset.name} />
      </div>
      <div className={`${isSmallScreen ? 'order-1' : ''}`}>
        <AssetHeaderInfo asset={asset} onEdit={onEdit} onDelete={onDelete} />
        
        {/* Display external asset badge if it's an external asset */}
        {asset.isExternal && (
          <div className="mt-3">
            <Badge 
              variant="outline" 
              className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
            >
              <AlertTriangle className="mr-1 h-3 w-3" />
              Externes Kundeneigentum
            </Badge>
          </div>
        )}
        
        {/* Anzeigen des Pool-Status, wenn es ein Pool-Gerät ist */}
        {(asset.isPoolDevice || asset.status === 'pool') && !asset.isExternal && (
          <div className="mt-4 flex items-center gap-2">
            <span className="font-medium">Buchungsstatus:</span> 
            {loadingBookingStatus ? (
              <span className="text-sm text-muted-foreground">Wird geladen...</span>
            ) : (
              <AssetStatusIndicator status={bookingStatus} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
