
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export type AssetSummary = {
  laptop: number;
  smartphone: number;
  tablet: number;
  mouse: number;
  keyboard: number;
  accessory: number;
  totalCount: number;
  totalValue: number;
};

interface AssetSummaryDisplayProps {
  assetSummary: AssetSummary | null;
  isLoading: boolean;
}

// Define German translations for asset types
const assetTypeTranslations = {
  laptop: "Laptops",
  smartphone: "Smartphones",
  tablet: "Tablets",
  mouse: "Maus",
  keyboard: "Tastatur",
  accessory: "Zubehör"
};

// Define colors for each asset type
const assetTypeColors = {
  laptop: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  smartphone: "bg-purple-100 text-purple-700 hover:bg-purple-200",
  tablet: "bg-green-100 text-green-700 hover:bg-green-200",
  mouse: "bg-amber-100 text-amber-700 hover:bg-amber-200", 
  keyboard: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  accessory: "bg-teal-100 text-teal-700 hover:bg-teal-200"
};

const AssetSummaryDisplay = ({ assetSummary, isLoading }: AssetSummaryDisplayProps) => {
  if (isLoading) {
    return (
      <div className="col-span-2 text-center text-sm text-muted-foreground">
        Lade Asset-Daten...
      </div>
    );
  }
  
  if (!assetSummary) {
    return (
      <div className="col-span-2 text-center text-sm text-muted-foreground">
        Keine Assets gefunden
      </div>
    );
  }

  return (
    <div className="col-span-2 mt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Assets ({assetSummary.totalCount})</span>
        <Badge variant="outline" className="text-xs">
          Wert: {formatCurrency(assetSummary.totalValue)}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {assetSummary.laptop > 0 && (
          <Badge variant="outline" className={`flex justify-between ${assetTypeColors.laptop} border-none`}>
            {assetTypeTranslations.laptop} <span className="font-bold">{assetSummary.laptop}</span>
          </Badge>
        )}
        {assetSummary.smartphone > 0 && (
          <Badge variant="outline" className={`flex justify-between ${assetTypeColors.smartphone} border-none`}>
            {assetTypeTranslations.smartphone} <span className="font-bold">{assetSummary.smartphone}</span>
          </Badge>
        )}
        {assetSummary.tablet > 0 && (
          <Badge variant="outline" className={`flex justify-between ${assetTypeColors.tablet} border-none`}>
            {assetTypeTranslations.tablet} <span className="font-bold">{assetSummary.tablet}</span>
          </Badge>
        )}
        {assetSummary.mouse > 0 && (
          <Badge variant="outline" className={`flex justify-between ${assetTypeColors.mouse} border-none`}>
            {assetTypeTranslations.mouse} <span className="font-bold">{assetSummary.mouse}</span>
          </Badge>
        )}
        {assetSummary.keyboard > 0 && (
          <Badge variant="outline" className={`flex justify-between ${assetTypeColors.keyboard} border-none`}>
            {assetTypeTranslations.keyboard} <span className="font-bold">{assetSummary.keyboard}</span>
          </Badge>
        )}
        {assetSummary.accessory > 0 && (
          <Badge variant="outline" className={`flex justify-between ${assetTypeColors.accessory} border-none`}>
            {assetTypeTranslations.accessory} <span className="font-bold">{assetSummary.accessory}</span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default AssetSummaryDisplay;
