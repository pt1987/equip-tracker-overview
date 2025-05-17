
import React from "react";
import { FileBarChart, Clock } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import AssetUsageDurationReport from "@/components/reports/AssetUsageDurationReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportUsageDuration } from "@/utils/export";
import { getAssetUsageDurationReport } from "@/data/reports";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function UsageDuration() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getAssetUsageDurationReport(dateRange);
      exportUsageDuration(data, format);
      
      toast({
        title: "Report exported",
        description: `The report has been exported as ${format.toUpperCase()}.`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the report.",
        variant: "destructive"
      });
      console.error("Export error:", error);
    }
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Clock className="h-8 w-8" />
                <span>Nutzungsdauer</span>
              </h1>
              <p className="text-muted-foreground">
                Durchschnittliche Nutzungsdauer nach Asset-Kategorie
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <FileBarChart className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportReport('excel')}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportReport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Durchschnittliche Asset-Nutzungsdauer</CardTitle>
                  <CardDescription>Durchschnittliche Nutzungsdauer nach Asset-Kategorie</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Nutzungsdauer"
                  description="Dieser Bericht zeigt die durchschnittliche Nutzungsdauer von IT-Assets nach Kategorien.

Was zeigt dieser Bericht:
- Durchschnittliche Nutzungsdauer pro Asset-Kategorie
- Vergleich der tatsächlichen mit der erwarteten Nutzungsdauer
- Assets mit überdurchschnittlich kurzer oder langer Nutzungsdauer
- Trends in der Nutzungsdauer über verschiedene Zeiträume

Anwendung:
Nutzen Sie diesen Bericht, um die Effizienz und Langlebigkeit verschiedener Asset-Typen zu vergleichen und bessere Prognosen für zukünftige Ersatzzyklen zu erstellen. Die Analyse hilft, den ROI von Investitionen besser zu verstehen und die Beschaffungsstrategie zu optimieren."
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <AssetUsageDurationReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
