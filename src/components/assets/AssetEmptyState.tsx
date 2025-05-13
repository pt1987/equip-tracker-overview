
import { PackageIcon } from "lucide-react";

interface AssetEmptyStateProps {
  hasAssets: boolean;
  clearFilters: () => void;
}

const AssetEmptyState = ({ hasAssets, clearFilters }: AssetEmptyStateProps) => {
  return (
    <div className="glass-card p-12 text-center">
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <PackageIcon size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No assets found</h3>
      <p className="text-muted-foreground mb-6">
        {hasAssets 
          ? "There are no assets matching your current filters."
          : "There are no assets in the system yet. Try adding some assets first."}
      </p>
      <button
        onClick={clearFilters}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
};

export default AssetEmptyState;
