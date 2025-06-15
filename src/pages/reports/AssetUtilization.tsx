
import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import AssetUtilizationReport from "@/components/reports/AssetUtilizationReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function AssetUtilization() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  const [reportData, setReportData] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  // Hier würde normalerweise die Datenabfrage für den Report stattfinden
  useEffect(() => {
    // Hier würde ein API-Aufruf stehen, der Daten basierend auf dateRange holt
    // Für dieses Beispiel simulieren wir die Daten
    const mockData = [
      { category: "Laptops", utilization: 87, count: 120 },
      { category: "Desktops", utilization: 92, count: 45 },
      { category: "Tablets", utilization: 64, count: 30 },
      { category: "Smartphones", utilization: 96, count: 85 }
    ];
    
    setReportData(mockData);
  }, [dateRange]);
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row md:items-center justify-between gap-4'}`}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Activity className="h-8 w-8" />
                <span>Asset-Auslastung</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse der Auslastung von Assets nach Kategorie und Zeitraum
              </p>
            </div>
            
            <ReportExportButton reportName="Asset-Auslastung" data={reportData} />
          </div>
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Asset-Auslastung Analyse</CardTitle>
                  <CardDescription>Detaillierte Analyse der Nutzungszeit und Verfügbarkeit von Assets</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Asset-Auslastung"
                  description="Dieser Bericht analysiert die Nutzungsintensität und Auslastung der IT-Assets im Unternehmen.

Was zeigt dieser Bericht:
- Prozentuale Auslastung nach Asset-Kategorie
- Ungenutzte oder selten genutzte Assets
- Überlastete Assets mit hoher Ausfallgefahr
- Nutzungsmuster über verschiedene Zeiträume

Anwendung:
Nutzen Sie diesen Bericht, um ineffizient eingesetzte Assets zu identifizieren und Ressourcen besser zu verteilen. Die Analyse hilft, Überkapazitäten zu reduzieren und unterbeanspruchte Assets umzuverteilen oder auszumustern."
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <AssetUtilizationReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
