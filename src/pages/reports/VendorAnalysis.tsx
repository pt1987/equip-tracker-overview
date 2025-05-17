
import React from "react";
import { FileBarChart, BarChartHorizontal } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import VendorPurchaseReport from "@/components/reports/VendorPurchaseReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportVendorPurchaseReport } from "@/utils/export";
import { getVendorPurchaseReport } from "@/data/reports";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function VendorAnalysis() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getVendorPurchaseReport(dateRange);
      exportVendorPurchaseReport(data, format);
      
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
                <BarChartHorizontal className="h-8 w-8" />
                <span>Anbieteranalyse</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse der Verteilung und Umsätze nach Anbietern und Herstellern
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
                  <CardTitle>Anbieter Einkaufs Analyse</CardTitle>
                  <CardDescription>Analyse der Verteilung und Umsätze nach Anbietern und Herstellern</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Anbieteranalyse"
                  description="Dieser Bericht analysiert die Verteilung der IT-Ausgaben nach Anbietern und Herstellern.

Was zeigt dieser Bericht:
- Ausgabenverteilung nach Anbietern/Herstellern
- Top-Anbieter nach Ausgabenvolumen
- Anzahl der erworbenen Assets pro Anbieter
- Preisentwicklung und Konditionen im Zeitverlauf

Anwendung:
Nutzen Sie diesen Bericht für das Lieferantenmanagement und die Optimierung von Einkaufsprozessen. Die Analyse hilft, Abhängigkeiten von einzelnen Anbietern zu erkennen, Verhandlungspositionen zu stärken und strategische Einkaufsentscheidungen zu treffen."
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <VendorPurchaseReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
