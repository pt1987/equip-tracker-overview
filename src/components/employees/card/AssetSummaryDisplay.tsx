
import { Badge } from "@/components/ui/badge";

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

const AssetSummaryDisplay = ({ assetSummary, isLoading }: AssetSummaryDisplayProps) => {
  if (isLoading) {
    return (
      <div className="col-span-2 text-center text-sm text-muted-foreground">
        Loading asset data...
      </div>
    );
  }
  
  if (!assetSummary) {
    return (
      <div className="col-span-2 text-center text-sm text-muted-foreground">
        No assets found
      </div>
    );
  }

  return (
    <div className="col-span-2 mt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Assets ({assetSummary.totalCount})</span>
        <Badge variant="outline" className="text-xs">
          Value: ${assetSummary.totalValue.toLocaleString()}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {assetSummary.laptop > 0 && (
          <Badge variant="secondary" className="flex justify-between">
            Laptops <span className="font-bold">{assetSummary.laptop}</span>
          </Badge>
        )}
        {assetSummary.smartphone > 0 && (
          <Badge variant="secondary" className="flex justify-between">
            Phones <span className="font-bold">{assetSummary.smartphone}</span>
          </Badge>
        )}
        {assetSummary.tablet > 0 && (
          <Badge variant="secondary" className="flex justify-between">
            Tablets <span className="font-bold">{assetSummary.tablet}</span>
          </Badge>
        )}
        {assetSummary.mouse > 0 && (
          <Badge variant="secondary" className="flex justify-between">
            Mice <span className="font-bold">{assetSummary.mouse}</span>
          </Badge>
        )}
        {assetSummary.keyboard > 0 && (
          <Badge variant="secondary" className="flex justify-between">
            Keyboards <span className="font-bold">{assetSummary.keyboard}</span>
          </Badge>
        )}
        {assetSummary.accessory > 0 && (
          <Badge variant="secondary" className="flex justify-between">
            Accessories <span className="font-bold">{assetSummary.accessory}</span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default AssetSummaryDisplay;
