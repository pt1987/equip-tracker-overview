
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportType } from "@/lib/types";
import OrderTimelineReport from "@/components/reports/OrderTimelineReport";
import BudgetYearlyReport from "@/components/reports/BudgetYearlyReport";
import AssetPurchasesReport from "@/components/reports/AssetPurchasesReport";
import AssetUsageDurationReport from "@/components/reports/AssetUsageDurationReport";
import WarrantyDefectsReport from "@/components/reports/WarrantyDefectsReport";
import FixedAssetsReport from "@/components/reports/FixedAssetsReport";
import EmployeeBudgetReport from "@/components/reports/EmployeeBudgetReport";
import VendorPurchaseReport from "@/components/reports/VendorPurchaseReport";
import { DownloadIcon, FileBarChart, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  exportOrderTimeline, 
  exportYearlyBudget, 
  exportYearlyPurchases, 
  exportUsageDuration, 
  exportWarrantyDefects, 
  exportFixedAssetsReport,
  exportEmployeeBudgetReport,
  exportVendorPurchaseReport
} from "@/utils/export";
import { 
  getOrderTimelineByEmployee, 
  getYearlyBudgetReport, 
  getYearlyAssetPurchasesReport, 
  getAssetUsageDurationReport, 
  getWarrantyDefectReport, 
  getFixedAssetsReport,
  getVendorPurchaseReport 
} from "@/data/reports";
import { getEmployees } from "@/data/employees";

const reportOptions = [
  { value: "orderTimeline", label: "Order Timeline" },
  { value: "yearlyBudget", label: "Yearly Budget" },
  { value: "yearlyPurchases", label: "Yearly Purchases" },
  { value: "usageDuration", label: "Usage Duration" },
  { value: "warrantyDefects", label: "Warranty Defects" },
  { value: "fixedAssets", label: "Anlagevermögen & GWG" },
  { value: "employeeBudget", label: "Mitarbeiter Budget" },
  { value: "vendorPurchase", label: "Anbieter Analyse" }
];

export default function Reporting() {
  const [activeReport, setActiveReport] = useState<ReportType>("orderTimeline");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      switch (activeReport) {
        case 'orderTimeline':
          {
            const data = await getOrderTimelineByEmployee();
            exportOrderTimeline(data, format);
            break;
          }
        case 'yearlyBudget':
          {
            const data = await getYearlyBudgetReport();
            exportYearlyBudget(data, format);
            break;
          }
        case 'yearlyPurchases':
          {
            const data = await getYearlyAssetPurchasesReport();
            exportYearlyPurchases(data, format);
            break;
          }
        case 'usageDuration':
          {
            const data = await getAssetUsageDurationReport();
            exportUsageDuration(data, format);
            break;
          }
        case 'warrantyDefects':
          {
            const data = await getWarrantyDefectReport();
            exportWarrantyDefects(data, format);
            break;
          }
        case 'fixedAssets':
          {
            const data = await getFixedAssetsReport();
            exportFixedAssetsReport(data, format);
            break;
          }
        case 'employeeBudget':
          {
            const data = await getEmployees();
            exportEmployeeBudgetReport(data, format);
            break;
          }
        case 'vendorPurchase':
          {
            const data = await getVendorPurchaseReport();
            exportVendorPurchaseReport(data, format);
            break;
          }
      }
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
  
  const getReportTitle = () => {
    const report = reportOptions.find(r => r.value === activeReport);
    return report?.label || "";
  };

  const getReportDescription = () => {
    switch (activeReport) {
      case "orderTimeline": return "Timeline of asset purchases per employee";
      case "yearlyBudget": return "Budget spent on assets per year";
      case "yearlyPurchases": return "Number of assets purchased per year by type";
      case "usageDuration": return "Average usage duration by asset category";
      case "warrantyDefects": return "Analysis of defective hardware with and without warranty";
      case "fixedAssets": return "Übersicht über Anlagevermögen und geringwertige Wirtschaftsgüter";
      case "employeeBudget": return "Übersicht über verfügbares Budget pro Mitarbeiter";
      case "vendorPurchase": return "Analyse der Verteilung und Umsätze nach Anbietern und Herstellern";
      default: return "";
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            Reporting
          </h1>
          <p className="text-muted-foreground">
            View and export detailed reports about your assets and employees
          </p>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <Select value={activeReport} onValueChange={(value) => setActiveReport(value as ReportType)}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Report auswählen">
                  {getReportTitle()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {reportOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>{getReportTitle()}</CardTitle>
              <CardDescription>{getReportDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
              {activeReport === "orderTimeline" && <OrderTimelineReport />}
              {activeReport === "yearlyBudget" && <BudgetYearlyReport />}
              {activeReport === "yearlyPurchases" && <AssetPurchasesReport />}
              {activeReport === "usageDuration" && <AssetUsageDurationReport />}
              {activeReport === "warrantyDefects" && <WarrantyDefectsReport />}
              {activeReport === "fixedAssets" && <FixedAssetsReport />}
              {activeReport === "employeeBudget" && <EmployeeBudgetReport />}
              {activeReport === "vendorPurchase" && <VendorPurchaseReport />}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="orderTimeline" value={activeReport} onValueChange={value => setActiveReport(value as ReportType)} className="w-full">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <TabsList className="flex flex-wrap gap-2 h-auto">
              <TabsTrigger value="orderTimeline">Order Timeline</TabsTrigger>
              <TabsTrigger value="yearlyBudget">Yearly Budget</TabsTrigger>
              <TabsTrigger value="yearlyPurchases">Yearly Purchases</TabsTrigger>
              <TabsTrigger value="usageDuration">Usage Duration</TabsTrigger>
              <TabsTrigger value="warrantyDefects">Warranty Defects</TabsTrigger>
              <TabsTrigger value="fixedAssets">Anlagevermögen & GWG</TabsTrigger>
              <TabsTrigger value="employeeBudget">Mitarbeiter Budget</TabsTrigger>
              <TabsTrigger value="vendorPurchase">Anbieter Analyse</TabsTrigger>
            </TabsList>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
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
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <CardTitle>
                {activeReport === "orderTimeline" && "Employee Order Timeline"}
                {activeReport === "yearlyBudget" && "Yearly Budget Usage"}
                {activeReport === "yearlyPurchases" && "Yearly Asset Purchases"}
                {activeReport === "usageDuration" && "Average Asset Usage Duration"}
                {activeReport === "warrantyDefects" && "Defective Hardware Warranty Analysis"}
                {activeReport === "fixedAssets" && "Anlagevermögen & GWG Übersicht"}
                {activeReport === "employeeBudget" && "Mitarbeiter Budget Übersicht"}
                {activeReport === "vendorPurchase" && "Anbieter Einkaufs Analyse"}
              </CardTitle>
              <CardDescription>
                {getReportDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="orderTimeline" className="mt-0">
                <OrderTimelineReport />
              </TabsContent>
              
              <TabsContent value="yearlyBudget" className="mt-0">
                <BudgetYearlyReport />
              </TabsContent>
              
              <TabsContent value="yearlyPurchases" className="mt-0">
                <AssetPurchasesReport />
              </TabsContent>
              
              <TabsContent value="usageDuration" className="mt-0">
                <AssetUsageDurationReport />
              </TabsContent>
              
              <TabsContent value="warrantyDefects" className="mt-0">
                <WarrantyDefectsReport />
              </TabsContent>
              
              <TabsContent value="fixedAssets" className="mt-0">
                <FixedAssetsReport />
              </TabsContent>

              <TabsContent value="employeeBudget" className="mt-0">
                <EmployeeBudgetReport />
              </TabsContent>

              <TabsContent value="vendorPurchase" className="mt-0">
                <VendorPurchaseReport />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  );
}
