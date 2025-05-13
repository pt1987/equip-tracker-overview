
import { Skeleton } from "@/components/ui/skeleton";

const AssetLoadingState = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
      ))}
    </div>
  );
};

export default AssetLoadingState;
