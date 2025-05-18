
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Softwarelizenzen</h2>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="border rounded-lg">
        <div className="p-4">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
};
