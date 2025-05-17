
import React from "react";
import { FileBarChart, DollarSign } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import BudgetYearlyReport from "@/components/reports/BudgetYearlyReport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportYearlyBudget } from "@/utils/export";
import { getYearlyBudgetReport } from "@/data/reports";

export default function YearlyBudget() {
  const { toast } = useToast();
  
  const exportReport = async (format: 'excel' | 'pdf') => {
    try {
      const data = await getYearlyBudgetReport();
      exportYearlyBudget(data, format);
      
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
                <DollarSign className="h-8 w-8" />
                <span>Jährliches Budget</span>
              </h1>
              <p className="text-muted-foreground">
                Budgetausgaben für IT-Assets pro Jahr
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
              <CardTitle>Yearly Budget Usage</CardTitle>
              <CardDescription>Budget spent on assets per year</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetYearlyReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
