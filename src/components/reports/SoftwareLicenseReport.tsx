
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useLicenseReportData } from "./hooks/useLicenseReportData";
import { LicenseStatsCards } from "./components/LicenseStatsCards";
import { LicenseBarChart } from "./components/LicenseBarChart";
import { LicenseCompliancePieChart } from "./components/LicenseCompliancePieChart";
import { LicenseTable } from "./components/LicenseTable";

export default function SoftwareLicenseReport() {
  const { dateRange } = useDateRangeFilter();
  const { data, isLoading, isError, stats, complianceData } = useLicenseReportData();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-red-600 font-medium">Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">
      <p>Keine Software-Lizenzdaten verfügbar</p>
      <p className="mt-2 text-sm">Fügen Sie neue Lizenzen über die Lizenzmanagement-Seite hinzu.</p>
    </div>;
  }

  return (
    <div className="space-y-6">
      <LicenseStatsCards stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LicenseBarChart data={data} />
        <LicenseCompliancePieChart data={complianceData} />
      </div>

      <LicenseTable data={data} />
    </div>
  );
}
