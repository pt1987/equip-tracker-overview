
import React from "react";
import { FileBarChart, FileLineChart } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import WarrantyDefectsReport from "@/components/reports/WarrantyDefectsReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportWarrantyDefects } from "@/utils/export";
import { getWarrantyDefectReport } from "@/data/reports";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function WarrantyDefects() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getWarrantyDefectReport(dateRange);
      exportWarrantyDefects(data, format);
      
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
                <FileLineChart className="h-8 w-8" />
                <span>Garantie & Defekte</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse defekter Hardware im Zusammenhang mit Garantiestatus
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
                  <CardTitle>Defekte Hardware Garantie-Analyse</CardTitle>
                  <CardDescription>Analyse der defekten Hardware mit und ohne Garantie</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Garantie & Defekte"
                  description="Dieser Bericht analysiert defekte Hardware im Zusammenhang mit deren Garantiestatus.

Was zeigt dieser Bericht:
- Defekte Assets nach Kategorie und Typ
- Verhältnis von Defekten innerhalb und außerhalb der Garantie
- Häufigkeit bestimmter Defektarten
- Kostenersparnis durch Garantieansprüche

Anwendung:
Nutzen Sie diesen Bericht für die Qualitätsbewertung von Assets und zur Optimierung des Garantiemanagements. Die Analyse hilft, besonders fehleranfällige Asset-Typen zu identifizieren und zukünftige Beschaffungsentscheidungen zu verbessern."
                  showAsDialog={true}
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <WarrantyDefectsReport dateRange={dateRange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
