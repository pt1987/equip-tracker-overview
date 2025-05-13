
import { SlidersHorizontal } from "lucide-react";

interface AssetFilterButtonProps {
  onClick: () => void;
  totalFiltersActive: number;
}

const AssetFilterButton = ({ onClick, totalFiltersActive }: AssetFilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
    >
      <SlidersHorizontal size={18} />
      <span>Filters</span>
      {totalFiltersActive > 0 && (
        <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
          {totalFiltersActive}
        </span>
      )}
    </button>
  );
};

export default AssetFilterButton;
