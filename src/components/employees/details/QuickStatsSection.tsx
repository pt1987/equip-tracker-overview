
import { Asset } from "@/lib/types";
import {
  LaptopIcon,
  SmartphoneIcon,
  TabletIcon,
  MouseIcon,
  KeyboardIcon,
  PackageIcon
} from "lucide-react";

interface QuickStatsSectionProps {
  assetsByType: Record<string, Asset[]>;
}

export default function QuickStatsSection({ 
  assetsByType
}: QuickStatsSectionProps) {
  // Fixed translations with correct plural forms
  const assetTypeTranslations: Record<string, { singular: string, plural: string }> = {
    laptop: { singular: "Laptop", plural: "Laptops" },
    smartphone: { singular: "Smartphone", plural: "Smartphones" },
    tablet: { singular: "Tablet", plural: "Tablets" },
    mouse: { singular: "Maus", plural: "Mäuse" },
    keyboard: { singular: "Tastatur", plural: "Tastaturen" },
    accessory: { singular: "Zubehör", plural: "Zubehör" }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Schnellübersicht</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gray-100">
            <LaptopIcon size={16} className="text-gray-700" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {assetsByType["laptop"]?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">
              {assetsByType["laptop"]?.length !== 1 
                ? assetTypeTranslations.laptop.plural 
                : assetTypeTranslations.laptop.singular}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gray-100">
            <SmartphoneIcon size={16} className="text-gray-700" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {assetsByType["smartphone"]?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">
              {assetsByType["smartphone"]?.length !== 1 
                ? assetTypeTranslations.smartphone.plural 
                : assetTypeTranslations.smartphone.singular}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gray-100">
            <TabletIcon size={16} className="text-gray-700" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {assetsByType["tablet"]?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">
              {assetsByType["tablet"]?.length !== 1 
                ? assetTypeTranslations.tablet.plural 
                : assetTypeTranslations.tablet.singular}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gray-100">
            <MouseIcon size={16} className="text-gray-700" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {assetsByType["mouse"]?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">
              {assetsByType["mouse"]?.length !== 1 
                ? assetTypeTranslations.mouse.plural 
                : assetTypeTranslations.mouse.singular}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gray-100">
            <KeyboardIcon size={16} className="text-gray-700" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {assetsByType["keyboard"]?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">
              {assetsByType["keyboard"]?.length !== 1 
                ? assetTypeTranslations.keyboard.plural 
                : assetTypeTranslations.keyboard.singular}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gray-100">
            <PackageIcon size={16} className="text-gray-700" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {assetsByType["accessory"]?.length || 0}
            </span>
            <span className="text-sm text-muted-foreground">
              {assetTypeTranslations.accessory.singular}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
