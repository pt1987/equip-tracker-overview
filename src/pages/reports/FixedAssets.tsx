
import React from "react";
import { FileBarChart, BarChart3 } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import FixedAssetsReport from "@/components/reports/FixedAssetsReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportFixedAssetsReport } from "@/utils/export";
import { getFixedAssetsReport } from "@/data/reports";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function FixedAssets() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getFixedAssetsReport(dateRange);
      exportFixedAssetsReport(data, format);
      
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
                <BarChart3 className="h-8 w-8" />
                <span>Anlagevermögen & GWG</span>
              </h1>
              <p className="text-muted-foreground">
                Übersicht über Anlagevermögen und geringwertige Wirtschaftsgüter
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
                  <CardTitle>Anlagevermögen & GWG Übersicht</CardTitle>
                  <CardDescription>Übersicht über Anlagevermögen und geringwertige Wirtschaftsgüter</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Anlagevermögen & GWG"
                  description="Dieser Bericht bietet eine Übersicht über das IT-Anlagevermögen und geringwertige Wirtschaftsgüter (GWG) im Unternehmen.

Was zeigt dieser Bericht:
- Aufschlüsselung von Assets nach Anlagevermögen vs. GWG
- Abschreibungswerte und Buchwerte des Anlagevermögens
- Bilanzielle Wertentwicklung der IT-Assets
- GWG-Quoten und deren Entwicklung

Anwendung:
Nutzen Sie diesen Bericht für die Buchhaltung, steuerliche Planung und das Finanzberichtswesen. Der Bericht unterstützt die Einhaltung von Bilanzierungsvorschriften und bietet eine klare Übersicht über abschreibungspflichtige Assets versus Sofortabschreibungen."
                  showAsDialog={true}
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <FixedAssetsReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
