
import { Asset } from "@/lib/types";
import AssetCard from "./AssetCard";

interface AssetGridViewProps {
  assets: Asset[];
}

const AssetGridView = ({ assets }: AssetGridViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assets.map((asset, index) => (
        <AssetCard 
          key={asset.id} 
          asset={asset} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default AssetGridView;
