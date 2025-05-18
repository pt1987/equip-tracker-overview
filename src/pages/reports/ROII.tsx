
import React from "react";
import { TrendingUp } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import ROIIReport from "@/components/reports/ROIIReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";
import { useQuery } from "@tanstack/react-query";
import { getROIIData } from "@/components/reports/roii/useROIIData";

export default function ROII() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  const isMobile = useIsMobile();
  
  // Query to fetch data for export
  const { data: reportData = [] } = useQuery({
    queryKey: ['roiiExport', dateRange],
    queryFn: () => getROIIData(dateRange)
  });
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row md:items-center justify-between gap-4'}`}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <TrendingUp className="h-8 w-8" />
                <span>IT-Investitionsrendite</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse der Rendite von IT-Investitionen und deren geschäftlicher Wert
              </p>
            </div>
            
            <ReportExportButton reportName="IT-Investitionsrendite" data={reportData} />
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>IT-Investitionsrendite</CardTitle>
                  <CardDescription>Detaillierte Analyse der Rendite von IT-Investitionen und deren geschäftlicher Wert</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="IT-Investitionsrendite (ROI)"
                  description="Dieser Bericht analysiert die Rendite der IT-Investitionen (Return on IT Investment) im Unternehmen.

Was zeigt dieser Bericht:
- Investitionskosten pro Asset-Kategorie
- Geschätzter Wertbeitrag/Rendite der IT-Investitionen
- ROI-Kennzahlen für unterschiedliche Asset-Typen
- Amortisationszeiträume für Investitionen

Anwendung:
Nutzen Sie diesen Bericht für Budgetentscheidungen und zur Priorisierung zukünftiger IT-Investitionen. Die Daten ermöglichen eine fundierte Bewertung, welche IT-Bereiche den größten geschäftlichen Nutzen bringen und wo Investitionen am effektivsten eingesetzt werden können."
                  showAsDialog={true}
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <ROIIReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
