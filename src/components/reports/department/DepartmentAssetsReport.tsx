
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { getDepartmentAssetsData } from "./hooks/useDepartmentData";
import DepartmentAssetCharts from "./DepartmentAssetCharts";
import DepartmentAssetTable from "./DepartmentAssetTable";

export interface DepartmentAssetData {
  department: string;
  assetCount: number;
  totalValue: number;
  assetsByType: {
    laptop: number;
    smartphone: number;
    tablet: number;
    accessory: number;
  };
  employeeCount: number;
  assetsPerEmployee: number;
}

export default function DepartmentAssetsReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['departmentAssets', dateRange],
    queryFn: () => getDepartmentAssetsData(dateRange)
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-muted-foreground">Fehler beim Laden der Daten</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Keine Abteilungsdaten verfügbar</div>;
  }

  return (
    <div className="space-y-6">
      <DepartmentAssetCharts data={data} />
      <DepartmentAssetTable data={data} />
    </div>
  );
}
