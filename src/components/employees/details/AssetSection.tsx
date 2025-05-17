
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

type AssetIcon = {
  type: Asset["type"];
  Icon: React.ReactNode;
};

// Component to render the proper icon based on asset type
export function AssetTypeIcon({ type }: { type: Asset["type"] }) {
  switch (type) {
    case "laptop":
      return <LaptopIcon size={18} className="text-blue-600" />;
    case "smartphone":
      return <SmartphoneIcon size={18} className="text-purple-600" />;
    case "tablet":
      return <TabletIcon size={18} className="text-green-600" />;
    case "mouse":
      return <MouseIcon size={18} className="text-amber-600" />;
    case "keyboard":
      return <KeyboardIcon size={18} className="text-gray-600" />;
    case "accessory":
      return <PackageIcon size={18} className="text-pink-600" />;
    default:
      return <PackageIcon size={18} />;
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

// Define German translations for asset types
const assetTypeTranslations: Record<string, string> = {
  laptop: "Laptop",
  smartphone: "Smartphone",
  tablet: "Tablet",
  mouse: "Maus",
  keyboard: "Tastatur",
  accessory: "Zubehör"
};

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

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <PackageIcon size={18} />
          <h2 className="text-lg font-semibold">Assets</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium hidden md:block">
            Gesamtwert: <span className="text-primary">{formatCurrency(assets.reduce((sum, asset) => sum + asset.price, 0))}</span>
          </div>
          <ViewToggle view={assetView} onViewChange={setAssetView} />
        </div>
      </div>
      
      {assets.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(assetsByType).map(([type, typeAssets]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                <AssetTypeIcon type={type as Asset["type"]} />
                <h3 className="font-medium">{assetTypeTranslations[type] || type}s</h3>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({typeAssets.length})
                </span>
              </div>
              
              <Collapsible
                open={expandedTypes[type] || typeAssets.length <= initialItemCount}
                onOpenChange={() => toggleExpand(type)}
              >
                {assetView === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Always show the first few items */}
                    {typeAssets.slice(0, expandedTypes[type] ? typeAssets.length : initialItemCount).map((asset, index) => (
                      <AssetCard 
                        key={asset.id} 
                        asset={asset} 
                        index={index} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {typeAssets.slice(0, expandedTypes[type] ? typeAssets.length : initialItemCount).map((asset) => (
                      <Link
                        key={asset.id}
                        to={`/asset/${asset.id}`}
                        className="block w-full p-3 rounded-lg border border-border hover:bg-secondary/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
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
                            <h4 className="font-medium truncate">{asset.name}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {asset.manufacturer} {asset.model}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(asset.price)}</p>
                            <p className="text-xs text-muted-foreground">{new Date(asset.purchaseDate).toLocaleDateString()}</p>
                          </div>
                          <ArrowRight size={16} className="text-muted-foreground ml-2" />
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
                      className="w-full mt-2 text-muted-foreground hover:text-foreground"
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
        <div className="text-center p-8">
          <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
            <PackageIcon size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Keine Assets zugewiesen</h3>
          <p className="text-muted-foreground">
            Diesem Mitarbeiter sind noch keine Assets zugewiesen.
          </p>
        </div>
      )}
    </div>
  );
}
