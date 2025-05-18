
import { useState } from "react";
import { Asset, AssetReview } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AssetTechnicalDetails from "./AssetTechnicalDetails";
import ConnectedAsset from "./ConnectedAsset";
import ComplianceSection from "./ComplianceSection";
import AssetReviewHistory from "./AssetReviewHistory";
import { useIsMobile } from "@/hooks/use-mobile";

interface AssetDetailTabsProps {
  asset: Asset;
  onAssetUpdate: (updatedAsset: Asset) => void;
  onReviewAdded: (review: AssetReview) => void;
}

export default function AssetDetailTabs({
  asset,
  onAssetUpdate,
  onReviewAdded
}: AssetDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "compliance">("details");
  const isMobile = useIsMobile();

  const handleTabChange = (value: string) => {
    setActiveTab(value as "details" | "compliance");
  };

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          <div className="mb-2" id="mobile-asset-tab-selector">
            <Select 
              value={activeTab} 
              onValueChange={handleTabChange}
              aria-label="Mobile asset tab selector"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bereich auswählen">
                  {activeTab === "details" ? "Technische Details" : "ISO 27001 Compliance"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="details">Technische Details</SelectItem>
                <SelectItem value="compliance">ISO 27001 Compliance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {activeTab === "details" && (
            <div className="space-y-5">
              <AssetTechnicalDetails asset={asset} />
              {asset.connectedAssetId && (
                <ConnectedAsset connectedAssetId={asset.connectedAssetId} />
              )}
            </div>
          )}
          
          {activeTab === "compliance" && (
            <div className="space-y-5">
              <ComplianceSection asset={asset} onAssetUpdate={onAssetUpdate} />
              <AssetReviewHistory asset={asset} onReviewAdded={onReviewAdded} />
            </div>
          )}
        </div>
      ) : (
        <Tabs id="asset-details-tabs" value={activeTab} onValueChange={(value) => setActiveTab(value as "details" | "compliance")} className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="details">Technische Details</TabsTrigger>
            <TabsTrigger value="compliance">ISO 27001 Compliance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6 pt-4">
            <AssetTechnicalDetails asset={asset} />
            {asset.connectedAssetId && <ConnectedAsset connectedAssetId={asset.connectedAssetId} />}
          </TabsContent>
          
          <TabsContent value="compliance" className="space-y-6 pt-4">
            <ComplianceSection asset={asset} onAssetUpdate={onAssetUpdate} />
            <AssetReviewHistory asset={asset} onReviewAdded={onReviewAdded} />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
