
import { Skeleton } from "@/components/ui/skeleton";

export default function AssetLoading() {
  return (
    <div className="container mx-auto px-6 py-4 max-w-7xl">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-[400px] w-full rounded-lg" />
    </div>
  );
}
