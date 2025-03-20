
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ReportType } from "@/lib/types";
import OrderTimelineReport from "@/components/reports/OrderTimelineReport";
import BudgetYearlyReport from "@/components/reports/BudgetYearlyReport";
import AssetPurchasesReport from "@/components/reports/AssetPurchasesReport";
import AssetUsageDurationReport from "@/components/reports/AssetUsageDurationReport";
import WarrantyDefectsReport from "@/components/reports/WarrantyDefectsReport";
import { DownloadIcon, FileBarChart, ChevronDown } from "lucide-react";
import { 
  exportOrderTimeline, 
  exportYearlyBudget, 
  exportYearlyPurchases, 
  exportUsageDuration, 
  exportWarrantyDefects 
} from "@/utils/export";
import { 
  getOrderTimelineByEmployee, 
  getYearlyBudgetReport, 
  getYearlyAssetPurchasesReport, 
  getAssetUsageDurationReport, 
  getWarrantyDefectReport 
} from "@/data/reports";

export default function Reporting() {
  const [activeReport, setActiveReport] = useState<ReportType>("orderTimeline");
  const { toast } = useToast();

  const exportReport = (format: 'excel' | 'pdf') => {
    try {
      switch (activeReport) {
        case 'orderTimeline':
          exportOrderTimeline(getOrderTimelineByEmployee(), format);
          break;
        case 'yearlyBudget':
          exportYearlyBudget(getYearlyBudgetReport(), format);
          break;
        case 'yearlyPurchases':
          exportYearlyPurchases(getYearlyAssetPurchasesReport(), format);
          break;
        case 'usageDuration':
          exportUsageDuration(getAssetUsageDurationReport(), format);
          break;
        case 'warrantyDefects':
          exportWarrantyDefects(getWarrantyDefectReport(), format);
          break;
      }
      
      toast({
        title: "Report exported",
        description: `The report has been exported as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the report.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <FileBarChart className="h-7 w-7 text-primary" />
            Reporting
          </h1>
          <p className="text-muted-foreground">
            View and export detailed reports about your assets and employees
          </p>
        </div>
      </div>

      <Tabs
        defaultValue="orderTimeline"
        value={activeReport}
        onValueChange={(value) => setActiveReport(value as ReportType)}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            <TabsTrigger value="orderTimeline">Order Timeline</TabsTrigger>
            <TabsTrigger value="yearlyBudget">Yearly Budget</TabsTrigger>
            <TabsTrigger value="yearlyPurchases">Yearly Purchases</TabsTrigger>
            <TabsTrigger value="usageDuration">Usage Duration</TabsTrigger>
            <TabsTrigger value="warrantyDefects">Warranty Defects</TabsTrigger>
          </TabsList>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export Report
                <ChevronDown className="ml-2 h-4 w-4" />
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
        
        <Card>
          <CardHeader>
            <CardTitle>
              {activeReport === "orderTimeline" && "Employee Order Timeline"}
              {activeReport === "yearlyBudget" && "Yearly Budget Usage"}
              {activeReport === "yearlyPurchases" && "Yearly Asset Purchases"}
              {activeReport === "usageDuration" && "Average Asset Usage Duration"}
              {activeReport === "warrantyDefects" && "Defective Hardware Warranty Analysis"}
            </CardTitle>
            <CardDescription>
              {activeReport === "orderTimeline" && "Timeline of asset purchases per employee"}
              {activeReport === "yearlyBudget" && "Budget spent on assets per year"}
              {activeReport === "yearlyPurchases" && "Number of assets purchased per year by type"}
              {activeReport === "usageDuration" && "Average usage duration by asset category"}
              {activeReport === "warrantyDefects" && "Analysis of defective hardware with and without warranty"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="orderTimeline" className="p-4 m-0">
              <OrderTimelineReport />
            </TabsContent>
            
            <TabsContent value="yearlyBudget" className="p-4 m-0">
              <BudgetYearlyReport />
            </TabsContent>
            
            <TabsContent value="yearlyPurchases" className="p-4 m-0">
              <AssetPurchasesReport />
            </TabsContent>
            
            <TabsContent value="usageDuration" className="p-4 m-0">
              <AssetUsageDurationReport />
            </TabsContent>
            
            <TabsContent value="warrantyDefects" className="p-4 m-0">
              <WarrantyDefectsReport />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
