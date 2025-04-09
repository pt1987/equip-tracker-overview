
import { Skeleton } from "@/components/ui/skeleton";

type LoadingVariant = "card" | "list" | "simple" | "detail";

interface EmployeeLoadingStateProps {
  variant?: LoadingVariant;
  count?: number;
  message?: string;
}

const EmployeeLoadingState = ({
  variant = "simple",
  count = 1,
  message = "Loading employees..."
}: EmployeeLoadingStateProps) => {
  // Simple text loading state
  if (variant === "simple") {
    return (
      <div className="glass-card p-12 flex items-center justify-center">
        <div className="animate-pulse-soft">{message}</div>
      </div>
    );
  }

  // Detailed loading state for employee detail page
  if (variant === "detail") {
    return (
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      </div>
    );
  }

  // Generate card loading skeleton placeholders
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array(count).fill(0).map((_, index) => (
          <div key={index} className="glass-card">
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-36" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <div className="pt-4">
                  <Skeleton className="h-5 w-28" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List view loading skeleton
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="glass-card">
          <div className="p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 flex items-center justify-between">
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-36" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="hidden md:flex gap-4 items-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeLoadingState;
