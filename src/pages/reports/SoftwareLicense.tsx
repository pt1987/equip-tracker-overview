
import React, { useState, useEffect } from "react";
import { KeyRound } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import SoftwareLicenseReport from "@/components/reports/SoftwareLicenseReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SoftwareLicense() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  const [reportData, setReportData] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  // Hier würde normalerweise die Datenabfrage für den Report stattfinden
  useEffect(() => {
    // Hier würde ein API-Aufruf stehen, der Daten basierend auf dateRange holt
    // Für dieses Beispiel simulieren wir die Daten
    const mockData = [
      { software: "Microsoft Office", licenses: 120, used: 108, expiry: "2023-12-31", cost: 12000 },
      { software: "Adobe Creative Cloud", licenses: 45, used: 42, expiry: "2023-11-15", cost: 24000 },
      { software: "AutoCAD", licenses: 15, used: 12, expiry: "2024-03-01", cost: 18000 },
      { software: "VMWare", licenses: 8, used: 8, expiry: "2024-06-30", cost: 16000 }
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
                <KeyRound className="h-8 w-8" />
                <span>Software-Lizenzen</span>
              </h1>
              <p className="text-muted-foreground">
                Übersicht und Analyse von Software-Lizenzen und Abonnements
              </p>
            </div>
            
            <ReportExportButton reportName="Software-Lizenzen" data={reportData} />
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>Software-Lizenz Übersicht</CardTitle>
              <CardDescription>Analyse der Software-Lizenzen und Abonnements nach Typ und Kosten</CardDescription>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <SoftwareLicenseReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
