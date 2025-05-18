
import { useState } from "react";
import { Asset, AssetReview } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

// Import component parts
import AssetMediaSection from "./details/AssetMediaSection";
import AssetDetailTabs from "./details/AssetDetailTabs";
import ExternalAssetSection from "./details/ExternalAssetSection";
import { useAssetBookingStatus } from "./details/useAssetBookingStatus";

interface AssetDetailViewProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export default function AssetDetailView({
  asset,
  onEdit,
  onDelete
}: AssetDetailViewProps) {
  const [currentAsset, setCurrentAsset] = useState<Asset>(asset);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Use our custom hooks to handle data fetching
  const { bookingStatus, loadingBookingStatus } = useAssetBookingStatus(currentAsset);

  const handleAssetUpdate = (updatedAsset: Asset) => {
    setCurrentAsset(updatedAsset);
  };

  const handleReviewAdded = (review: AssetReview) => {
    // Update the asset with new review dates
    const updatedAsset = {
      ...currentAsset,
      lastReviewDate: review.reviewDate,
      nextReviewDate: review.nextReviewDate
    };
    setCurrentAsset(updatedAsset);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <AssetMediaSection 
        asset={currentAsset} 
        bookingStatus={bookingStatus}
        loadingBookingStatus={loadingBookingStatus}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      
      {/* Show external asset section before other tabs if it's an external asset */}
      {currentAsset.isExternal && (
        <ExternalAssetSection asset={currentAsset} onAssetUpdate={handleAssetUpdate} />
      )}

      <AssetDetailTabs 
        asset={currentAsset} 
        onAssetUpdate={handleAssetUpdate} 
        onReviewAdded={handleReviewAdded} 
      />
    </div>
  );
}
