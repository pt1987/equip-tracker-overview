
import { Asset } from "@/lib/types";
import AssetGridView from "./AssetGridView";
import AssetListView from "./AssetListView";
import AssetEmptyState from "./AssetEmptyState";
import AssetLoadingState from "./AssetLoadingState";

interface AssetContentProps {
  isLoading: boolean;
  filteredAssets: Asset[];
  allAssetsLength: number;
  view: "grid" | "list";
  clearFilters: () => void;
}

const AssetContent = ({ 
  isLoading, 
  filteredAssets, 
  allAssetsLength,
  view,
  clearFilters 
}: AssetContentProps) => {
  if (isLoading) {
    return <AssetLoadingState />;
  }
  
  if (filteredAssets.length === 0) {
    return (
      <AssetEmptyState 
        hasAssets={allAssetsLength > 0} 
        clearFilters={clearFilters} 
      />
    );
  }
  
  return view === "grid" ? (
    <AssetGridView assets={filteredAssets} />
  ) : (
    <AssetListView assets={filteredAssets} />
  );
};

export default AssetContent;
