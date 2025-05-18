
import React from "react";
import { KeyRound } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import SoftwareLicenseReport from "@/components/reports/SoftwareLicenseReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function SoftwareLicense() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  const isMobile = useIsMobile();
  
  const { data: reportData = [] } = useQuery({
    queryKey: ['softwareLicensesExport', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('software_licenses')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching software licenses for export:", error);
        return [];
      }
      
      return data.map(license => ({
        software: license.name,
        licenses: license.total_licenses,
        used: license.assigned_count,
        expiry: license.expiry_date,
        cost: license.cost_per_license * license.total_licenses
      }));
    }
  });
  
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Software-Lizenz Übersicht</CardTitle>
                  <CardDescription>Analyse der Software-Lizenzen und Abonnements nach Typ und Kosten</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Software-Lizenzen"
                  description="Dieser Bericht gibt eine Übersicht über alle Software-Lizenzen und Abonnements im Unternehmen.

Was zeigt dieser Bericht:
- Verfügbare vs. genutzte Lizenzen pro Software
- Ablaufdaten und Verlängerungszeiträume
- Lizenzkosten und Budget-Auswirkungen
- Nicht oder selten genutzte Software-Lizenzen

Anwendung:
Nutzen Sie diesen Bericht für die Lizenzverwaltung und Kostenkontrolle. Der Bericht hilft, unnötige Lizenzkosten zu vermeiden, bald ablaufende Lizenzen rechtzeitig zu verlängern und die Compliance sicherzustellen."
                  showAsDialog={true}
                />
              </div>
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
