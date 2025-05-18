
import { Asset } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { 
  LaptopIcon, 
  SmartphoneIcon, 
  TabletIcon, 
  MouseIcon, 
  KeyboardIcon,
  PackageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickStatsSectionProps {
  assetsByType: Record<string, Asset[]>;
}

export default function QuickStatsSection({ assetsByType }: QuickStatsSectionProps) {
  const getAssetCount = (type: string) => {
    return assetsByType[type]?.length || 0;
  };
  
  const getAssetValue = (type: string) => {
    return assetsByType[type]?.reduce((sum, asset) => sum + asset.price, 0) || 0;
  };
  
  const totalCount = Object.values(assetsByType).reduce((sum, assets) => sum + assets.length, 0);
  const totalValue = Object.values(assetsByType).reduce(
    (sum, assets) => sum + assets.reduce((assetSum, asset) => assetSum + asset.price, 0), 
    0
  );

  // Funktion zum Scrollen zu einer bestimmten Asset-Sektion
  const scrollToAssetSection = (type: string) => {
    const section = document.getElementById(`asset-section-${type}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Define the asset types and their corresponding icons
  const assetTypes = [
    { type: "laptop", label: "Laptops", icon: <LaptopIcon size={16} className="text-gray-700" /> },
    { type: "smartphone", label: "Smartphones", icon: <SmartphoneIcon size={16} className="text-gray-700" /> },
    { type: "tablet", label: "Tablets", icon: <TabletIcon size={16} className="text-gray-700" /> },
    { type: "mouse", label: "Mäuse", icon: <MouseIcon size={16} className="text-gray-700" /> },
    { type: "keyboard", label: "Tastaturen", icon: <KeyboardIcon size={16} className="text-gray-700" /> },
    { type: "accessory", label: "Zubehör", icon: <PackageIcon size={16} className="text-gray-700" /> }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium flex items-center gap-1">
          <PackageIcon size={16} className="text-gray-700" />
          Asset Übersicht
        </h3>
        <div className="text-xs font-medium">
          Gesamt: <span className="text-primary">{formatCurrency(totalValue)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {assetTypes.map(({ type, label, icon }) => (
          <div 
            key={type} 
            className="p-2 bg-muted/30 rounded border border-border hover:bg-secondary/20 transition-colors cursor-pointer"
            onClick={() => scrollToAssetSection(type)}
            aria-label={`Zu ${label} springen`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {icon}
                <span className="text-xs font-medium">{label}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{getAssetCount(type)}</span>
              <span className="text-xs text-muted-foreground">{formatCurrency(getAssetValue(type))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
