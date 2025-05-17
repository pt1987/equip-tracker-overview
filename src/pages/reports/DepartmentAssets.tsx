
import React from "react";
import { Building2 } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import DepartmentAssetsReport from "@/components/reports/DepartmentAssetsReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function DepartmentAssets() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                <span>Abteilungsübersicht</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse der Asset-Verteilung und -Nutzung nach Abteilungen
              </p>
            </div>
            
            <ReportExportButton reportName="Abteilungsübersicht" />
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Abteilungsübersicht</CardTitle>
                  <CardDescription>Verteilung und Nutzung von Assets nach Abteilungen und Mitarbeitern</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Abteilungsübersicht"
                  description="Dieser Bericht zeigt die Verteilung und Nutzung von IT-Assets nach Abteilungen und Mitarbeitern.

Was zeigt dieser Bericht:
- Anzahl der Assets pro Abteilung
- Wert der Assets pro Abteilung
- Verteilung der Asset-Typen innerhalb einer Abteilung
- Nutzungsgrad der Assets nach Abteilung

Anwendung:
Nutzen Sie diesen Bericht, um die Asset-Verteilung zwischen Abteilungen zu vergleichen und Ressourcen entsprechend zu verteilen. Abteilungen mit älteren Assets oder höherem Nutzungsgrad könnten priorisiert werden."
                  showAsDialog={true}
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <DepartmentAssetsReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
