
import React from "react";
import { KeyRound } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import SoftwareLicenseReport from "@/components/reports/SoftwareLicenseReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";

export default function SoftwareLicense() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <KeyRound className="h-8 w-8" />
                <span>Software-Lizenzen</span>
              </h1>
              <p className="text-muted-foreground">
                Übersicht und Analyse von Software-Lizenzen und Abonnements
              </p>
            </div>
            
            <ReportExportButton reportName="Software-Lizenzen" />
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>Software-Lizenz Übersicht</CardTitle>
              <CardDescription>Analyse der Software-Lizenzen und Abonnements nach Typ und Kosten</CardDescription>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <SoftwareLicenseReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
