
import { X } from "lucide-react";

interface FiltersHeaderProps {
  clearFilters: () => void;
}

const FiltersHeader = ({ clearFilters }: FiltersHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium">Filters</h3>
      <button
        onClick={clearFilters}
        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        <X size={14} />
        Clear all
      </button>
    </div>
  );
};

export default FiltersHeader;
