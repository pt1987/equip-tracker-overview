
import { Asset } from "@/lib/types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import AssetTypeIcon from "./AssetTypeIcon";
import StatusBadge from "./StatusBadge";

interface AssetListViewProps {
  assets: Asset[];
}

const AssetListView = ({ assets }: AssetListViewProps) => {
  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <Link
          key={asset.id}
          to={`/asset/${asset.id}`}
          className="glass-card p-4 flex items-center gap-4 hover:bg-secondary/10 transition-colors"
        >
          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
            {asset.imageUrl ? (
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <AssetTypeIcon type={asset.type} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{asset.name}</h3>
            <p className="text-sm text-muted-foreground">
              {asset.manufacturer} {asset.model}
            </p>
          </div>
          <div className="hidden md:block w-32">
            <StatusBadge status={asset.status} />
          </div>
          <div className="hidden md:block w-36">
            <p className="text-sm">
              <span className="text-muted-foreground">Type: </span>
              {asset.type}
            </p>
          </div>
          <div className="hidden md:block w-32">
            <p className="text-sm font-medium">
              {formatCurrency(asset.price)}
            </p>
          </div>
          <ArrowRight size={16} className="text-muted-foreground" />
        </Link>
      ))}
    </div>
  );
};

export default AssetListView;
