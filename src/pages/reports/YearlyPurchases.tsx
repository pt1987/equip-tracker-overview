
import React from "react";
import { FileBarChart, ShoppingBag } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import AssetPurchasesReport from "@/components/reports/AssetPurchasesReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportYearlyPurchases } from "@/utils/export";
import { getYearlyAssetPurchasesReport } from "@/data/reports";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";

export default function YearlyPurchases() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getYearlyAssetPurchasesReport(dateRange);
      exportYearlyPurchases(data, format);
      
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
                <ShoppingBag className="h-8 w-8" />
                <span>Jährliche Anschaffungen</span>
              </h1>
              <p className="text-muted-foreground">
                Anzahl der angeschafften Assets pro Jahr nach Typ
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
                  <CardTitle>Jährliche Asset-Anschaffungen</CardTitle>
                  <CardDescription>Anzahl der angeschafften Assets pro Jahr nach Typ</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Jährliche Anschaffungen"
                  description="Dieser Bericht zeigt die Anzahl der angeschafften IT-Assets pro Jahr, aufgeschlüsselt nach Asset-Typ.

Was zeigt dieser Bericht:
- Anzahl der erworbenen Assets pro Jahr und Kategorie
- Trends im Anschaffungsverhalten über mehrere Jahre
- Saisonale Muster bei Anschaffungen
- Vergleich zwischen verschiedenen Asset-Kategorien

Anwendung:
Nutzen Sie diesen Bericht, um langfristige Beschaffungstrends zu erkennen und zukünftige Anschaffungszyklen zu planen. Der Bericht hilft, saisonale Schwankungen zu identifizieren und die Beschaffungsplanung entsprechend anzupassen."
                  showAsDialog={true}
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <AssetPurchasesReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
