
import React from "react";
import { FileBarChart, Calendar } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import OrderTimelineReport from "@/components/reports/OrderTimelineReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportOrderTimeline } from "@/utils/export";
import { getOrderTimelineByEmployee } from "@/data/reports";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function OrderTimeline() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getOrderTimelineByEmployee(undefined, dateRange);
      exportOrderTimeline(data, format);
      
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
                <Calendar className="h-8 w-8" />
                <span>Bestellverlauf</span>
              </h1>
              <p className="text-muted-foreground">
                Zeitlicher Verlauf der Assetbestellungen nach Mitarbeitern
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
                  <CardTitle>Mitarbeiter Bestellverlauf</CardTitle>
                  <CardDescription>Zeitlicher Verlauf der Asset-Anschaffungen pro Mitarbeiter</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Bestellverlauf"
                  description="Dieser Bericht zeigt den zeitlichen Verlauf der Asset-Bestellungen und -Anschaffungen pro Mitarbeiter.

Was zeigt dieser Bericht:
- Zeitliche Abfolge aller Bestellungen pro Mitarbeiter
- Bestellvolumen und -häufigkeit im Zeitverlauf
- Ausgaben pro Mitarbeiter über die Zeit
- Identifikation von Bestellmustern

Anwendung:
Nutzen Sie diesen Bericht, um die Beschaffungshistorie einzelner Mitarbeiter zu analysieren und typische Erneuerungszyklen zu erkennen. Der Bericht hilft, ungewöhnliche Bestellmuster zu identifizieren und die Ressourcenverteilung über die Zeit zu verstehen."
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <OrderTimelineReport dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
