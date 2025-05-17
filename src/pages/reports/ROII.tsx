
import React from "react";
import { TrendingUp } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import ROIIReport from "@/components/reports/ROIIReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";

export default function ROII() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <TrendingUp className="h-8 w-8" />
                <span>IT-Investitionsrendite</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse der Rendite von IT-Investitionen und deren geschäftlicher Wert
              </p>
            </div>
            
            <ReportExportButton reportName="IT-Investitionsrendite" />
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>IT-Investitionsrendite</CardTitle>
              <CardDescription>Detaillierte Analyse der Rendite von IT-Investitionen und deren geschäftlicher Wert</CardDescription>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <ROIIReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
