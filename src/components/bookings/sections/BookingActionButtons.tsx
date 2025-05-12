
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { Asset } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookingActionButtonsProps {
  asset: Asset;
  isLoading: boolean;
  isActive: boolean;
  onRefresh: () => void;
  onBook: () => void;
}

export default function BookingActionButtons({
  asset,
  isLoading,
  isActive,
  onRefresh,
  onBook
}: BookingActionButtonsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex gap-2 ${isMobile ? 'mt-3' : ''}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        Aktualisieren
      </Button>
      {(asset.status === 'pool' || asset.isPoolDevice === true) && !isActive && (
        <Button
          size="sm"
          onClick={onBook}
        >
          <CalendarIcon className="h-4 w-4 mr-1" />
          Buchen
        </Button>
      )}
    </div>
  );
}
