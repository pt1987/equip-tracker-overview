
import React, { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import CarbonFootprintReport from "@/components/reports/CarbonFootprintReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function CarbonFootprint() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  const [reportData, setReportData] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  // Hier würde normalerweise die Datenabfrage für den Report stattfinden
  useEffect(() => {
    // Hier würde ein API-Aufruf stehen, der Daten basierend auf dateRange holt
    // Für dieses Beispiel simulieren wir die Daten
    const mockData = [
      { category: "Laptops", co2: 1250, units: 45 },
      { category: "Monitore", co2: 875, units: 80 },
      { category: "Server", co2: 3200, units: 12 },
      { category: "Smartphones", co2: 450, units: 60 }
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
                <Leaf className="h-8 w-8" />
                <span>CO2-Fußabdruck</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse des Umwelteinflusses und CO2-Fußabdrucks der IT-Assets
              </p>
            </div>
            
            <ReportExportButton reportName="CO2-Fußabdruck" data={reportData} />
          </div>
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>CO2-Fußabdruck Analyse</CardTitle>
                  <CardDescription>Umweltauswirkungen und Nachhaltigkeitsanalyse der IT-Assets</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="CO2-Fußabdruck"
                  description="Dieser Bericht analysiert den Umwelteinfluss und CO2-Fußabdruck der IT-Assets im Unternehmen.

Was zeigt dieser Bericht:
- Geschätzter CO2-Ausstoß pro Asset-Kategorie
- CO2-Ausstoß pro Nutzer/Abteilung
- Trends im CO2-Verbrauch über Zeit
- Einsparpotenziale durch Ersatz älterer Geräte

Anwendung:
Nutzen Sie diesen Bericht für Nachhaltigkeitsinitiativen und als Grundlage für umweltbewusste Beschaffungsentscheidungen. Die Daten helfen, den ökologischen Fußabdruck der IT-Infrastruktur zu reduzieren und Umweltziele zu erreichen."
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <CarbonFootprintReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
