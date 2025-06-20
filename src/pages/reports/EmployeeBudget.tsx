
import React from "react";
import { FileBarChart, UserCheck } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import EmployeeBudgetReport from "@/components/reports/EmployeeBudgetReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportEmployeeBudgetReport } from "@/utils/export";
import { getEmployees } from "@/data/employees";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function EmployeeBudget() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getEmployees();
      exportEmployeeBudgetReport(data, format);
      
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
                <UserCheck className="h-8 w-8" />
                <span>Mitarbeiterbudget</span>
              </h1>
              <p className="text-muted-foreground">
                Übersicht über verfügbares Budget pro Mitarbeiter
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
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mitarbeiter Budget Übersicht</CardTitle>
                  <CardDescription>Übersicht über verfügbares Budget pro Mitarbeiter</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Mitarbeiterbudget"
                  description="Dieser Bericht gibt eine Übersicht über das verfügbare und genutzte Budget für IT-Assets pro Mitarbeiter.

Was zeigt dieser Bericht:
- Zugewiesenes Budget pro Mitarbeiter
- Bereits genutztes Budget für Assets
- Verbleibendes verfügbares Budget
- Vergleich der Budgetnutzung zwischen verschiedenen Mitarbeitern/Abteilungen

Anwendung:
Nutzen Sie diesen Bericht für die Ressourcenplanung und um sicherzustellen, dass alle Mitarbeiter angemessen mit IT-Assets ausgestattet sind. Der Bericht hilft, Ungleichheiten in der Ressourcenverteilung zu identifizieren und Budget für neue Mitarbeiter oder spezielle Anforderungen zu planen."
                  showAsDialog={true}
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <EmployeeBudgetReport dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
