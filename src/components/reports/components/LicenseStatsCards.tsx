
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface LicenseStats {
  totalCost: number;
  totalLicenses: number;
  assignedLicenses: number;
  utilizationRate: number;
}

export const LicenseStatsCards = ({ stats }: { stats: LicenseStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground text-sm">Gesamtkosten</div>
          <div className="text-2xl font-bold mt-2">{formatCurrency(stats.totalCost)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground text-sm">Gesamtlizenzen</div>
          <div className="text-2xl font-bold mt-2">{stats.totalLicenses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground text-sm">Zugewiesene Lizenzen</div>
          <div className="text-2xl font-bold mt-2">{stats.assignedLicenses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground text-sm">Nutzungsrate</div>
          <div className="text-2xl font-bold mt-2">{stats.utilizationRate.toFixed(1)}%</div>
        </CardContent>
      </Card>
    </div>
  );
};
