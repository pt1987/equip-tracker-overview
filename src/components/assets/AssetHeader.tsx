
import ViewToggle from "@/components/shared/ViewToggle";

interface AssetHeaderProps {
  assetsCount: number | undefined;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

const AssetHeader = ({ assetsCount, view, onViewChange }: AssetHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Assets</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view all hardware assets
          {assetsCount !== undefined ? ` (${assetsCount} total)` : ''}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  );
};

export default AssetHeader;
