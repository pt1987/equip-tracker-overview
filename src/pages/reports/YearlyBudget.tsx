
import React from "react";
import { FileBarChart, DollarSign } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import BudgetYearlyReport from "@/components/reports/BudgetYearlyReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportYearlyBudget } from "@/utils/export";
import { getYearlyBudgetReport } from "@/data/reports";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function YearlyBudget() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getYearlyBudgetReport(dateRange);
      exportYearlyBudget(data, format);
      
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
                <DollarSign className="h-8 w-8" />
                <span>Jährliches Budget</span>
              </h1>
              <p className="text-muted-foreground">
                Budgetausgaben für IT-Assets pro Jahr
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
                  <CardTitle>Jährliches Budget</CardTitle>
                  <CardDescription>Budget für Assets pro Jahr</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Jährliches Budget"
                  description="Dieser Bericht zeigt die Budgetausgaben für IT-Assets pro Jahr im zeitlichen Verlauf.

Was zeigt dieser Bericht:
- Jährliche Gesamtausgaben für IT-Assets
- Vergleich der Ausgaben zwischen verschiedenen Jahren
- Prozentuale Verteilung des Budgets über den Zeitraum
- Trend-Analyse der IT-Ausgaben

Anwendung:
Nutzen Sie diesen Bericht für die langfristige Budgetplanung und um Ausgabentrends zu erkennen. Der Bericht hilft bei der Beurteilung, ob IT-Ausgaben über die Zeit steigen oder fallen und unterstützt bei der Prognose zukünftiger Budgetanforderungen."
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <BudgetYearlyReport dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
