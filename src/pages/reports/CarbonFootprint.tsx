
import React from "react";
import { Leaf } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import CarbonFootprintReport from "@/components/reports/CarbonFootprintReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";

export default function CarbonFootprint() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Leaf className="h-8 w-8" />
                <span>CO2-Fußabdruck</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse des Umwelteinflusses und CO2-Fußabdrucks der IT-Assets
              </p>
            </div>
            
            <ReportExportButton reportName="CO2-Fußabdruck" />
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>CO2-Fußabdruck Analyse</CardTitle>
              <CardDescription>Umweltauswirkungen und Nachhaltigkeitsanalyse der IT-Assets</CardDescription>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <CarbonFootprintReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
