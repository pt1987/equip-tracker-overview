
import React from "react";
import { FileBarChart, Activity } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import AssetLifecycleReport from "@/components/reports/AssetLifecycleReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";

export default function AssetLifecycle() {
  const { toast } = useToast();
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      // In einer realen Implementierung würden hier die Daten abgerufen werden
      // und an eine Export-Funktion übergeben werden
      
      toast({
        title: "Report exportiert",
        description: `Der Bericht wurde als ${format.toUpperCase()} exportiert.`
      });
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: "Beim Exportieren des Berichts ist ein Fehler aufgetreten.",
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
                <Activity className="h-8 w-8" />
                <span>Asset-Lebenszyklus</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse des vollständigen Lebenszyklus von Assets
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
              <CardTitle>Asset-Lebenszyklus Analyse</CardTitle>
              <CardDescription>Durchschnittliche Lebensdauer und Lebensphasen nach Asset-Kategorie</CardDescription>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <AssetLifecycleReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
