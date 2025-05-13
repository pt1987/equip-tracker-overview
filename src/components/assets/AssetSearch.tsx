
import SearchFilter from "@/components/shared/SearchFilter";
import AssetFilterButton from "./AssetFilterButton";

interface AssetSearchProps {
  onSearch: (value: string) => void;
  onToggleFilters: () => void;
  totalFiltersActive: number;
}

const AssetSearch = ({ 
  onSearch,
  onToggleFilters,
  totalFiltersActive 
}: AssetSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <SearchFilter 
        placeholder="Search assets..." 
        onSearch={onSearch}
        className="flex-1"
      />
      
      <AssetFilterButton 
        onClick={onToggleFilters} 
        totalFiltersActive={totalFiltersActive} 
      />
    </div>
  );
};

export default AssetSearch;
