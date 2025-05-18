
import { Link } from "react-router-dom";
import { useState } from "react";
import { Asset } from "@/lib/types";
import { ArrowRight, PackageIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import AssetCard from "@/components/assets/AssetCard";
import ViewToggle from "@/components/shared/ViewToggle";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AssetSectionProps {
  assets: Asset[];
}

// Define German translations for asset types
const assetTypeTranslations: Record<string, { singular: string, plural: string }> = {
  laptop: { singular: "Laptop", plural: "Laptops" },
  smartphone: { singular: "Smartphone", plural: "Smartphones" },
  tablet: { singular: "Tablet", plural: "Tablets" },
  mouse: { singular: "Maus", plural: "Mäuse" },
  keyboard: { singular: "Tastatur", plural: "Tastaturen" },
  accessory: { singular: "Zubehör", plural: "Zubehör" }
};

// Component to render the proper icon based on asset type
export function AssetTypeIcon({ type }: { type: Asset["type"] }) {
  switch (type) {
    case "laptop":
      return <LaptopIcon size={16} className="text-gray-700" />;
    case "smartphone":
      return <SmartphoneIcon size={16} className="text-gray-700" />;
    case "tablet":
      return <TabletIcon size={16} className="text-gray-700" />;
    case "mouse":
      return <MouseIcon size={16} className="text-gray-700" />;
    case "keyboard":
      return <KeyboardIcon size={16} className="text-gray-700" />;
    case "accessory":
      return <PackageIcon size={16} className="text-gray-700" />;
    default:
      return <PackageIcon size={16} className="text-gray-700" />;
  }
}

// Import necessary icons
import { 
  LaptopIcon,
  SmartphoneIcon,
  TabletIcon,
  MouseIcon,
  KeyboardIcon,
} from "lucide-react";

export default function AssetSection({ assets }: AssetSectionProps) {
  const [assetView, setAssetView] = useState<"grid" | "list">("grid");
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});
  
  // The number of items to show initially
  const initialItemCount = 3;
  
  // Group assets by type
  const assetsByType: Record<string, Asset[]> = {};
  assets.forEach(asset => {
    if (!assetsByType[asset.type]) {
      assetsByType[asset.type] = [];
    }
    assetsByType[asset.type].push(asset);
  });
  
  // Toggle expand state for a specific type
  const toggleExpand = (type: string) => {
    setExpandedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Get correct type label based on count (singular/plural)
  const getTypeLabel = (type: string, count: number) => {
    const translation = assetTypeTranslations[type] || { singular: type, plural: type + 's' };
    return count === 1 ? translation.singular : translation.plural;
  };

  return (
    <div className="glass-card p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1">
          <PackageIcon size={16} className="text-gray-700" />
          <h2 className="text-base font-medium">Assets</h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="text-sm font-medium hidden sm:block">
            Gesamtwert: <span className="text-primary">{formatCurrency(assets.reduce((sum, asset) => sum + asset.price, 0))}</span>
          </div>
          <ViewToggle view={assetView} onViewChange={setAssetView} />
        </div>
      </div>
      
      {assets.length > 0 ? (
        <div className="space-y-3">
          {Object.entries(assetsByType).map(([type, typeAssets]) => (
            <div key={type} id={`asset-section-${type}`}>
              <div className="flex items-center gap-1 mb-1 pb-1 border-b border-border">
                <AssetTypeIcon type={type as Asset["type"]} />
                <h3 className="text-sm font-medium">
                  {getTypeLabel(type, typeAssets.length)}
                </h3>
                <span className="ml-1 text-xs text-muted-foreground">
                  ({typeAssets.length})
                </span>
              </div>
              
              <Collapsible
                open={expandedTypes[type] || typeAssets.length <= initialItemCount}
                onOpenChange={() => toggleExpand(type)}
              >
                {assetView === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Always show the first few items */}
                    {typeAssets.slice(0, expandedTypes[type] ? typeAssets.length : initialItemCount).map((asset, index) => (
                      <AssetCard 
                        key={asset.id} 
                        asset={asset} 
                        index={index} 
                        hideEmployeeInfo={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {typeAssets.slice(0, expandedTypes[type] ? typeAssets.length : initialItemCount).map((asset) => (
                      <Link
                        key={asset.id}
                        to={`/asset/${asset.id}`}
                        className="block w-full p-2 rounded-lg border border-border hover:bg-secondary/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md overflow-hidden bg-muted flex-shrink-0">
                            {asset.imageUrl ? (
                              <img
                                src={asset.imageUrl}
                                alt={asset.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <AssetTypeIcon type={asset.type} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{asset.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {asset.manufacturer} {asset.model}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(asset.price)}</p>
                            <p className="text-xs text-muted-foreground">{new Date(asset.purchaseDate).toLocaleDateString()}</p>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Show button to expand/collapse if there are more items than initialItemCount */}
                {typeAssets.length > initialItemCount && (
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-1 text-muted-foreground hover:text-foreground text-xs h-7"
                    >
                      {expandedTypes[type] ? 
                        "Weniger anzeigen" : 
                        `${typeAssets.length - initialItemCount} weitere anzeigen...`
                      }
                    </Button>
                  </CollapsibleTrigger>
                )}
              </Collapsible>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-3">
          <div className="mx-auto w-8 h-8 mb-2 rounded-full bg-muted flex items-center justify-center">
            <PackageIcon size={16} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-1">Keine Assets zugewiesen</h3>
          <p className="text-xs text-muted-foreground">
            Diesem Mitarbeiter sind noch keine Assets zugewiesen.
          </p>
        </div>
      )}
    </div>
  );
}
