
import React from "react";
import { FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportPurchaseList } from "@/utils/purchase-export";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReportExportButtonProps {
  reportName: string;
  data?: any[];
}

export function ReportExportButton({ reportName, data = [] }: ReportExportButtonProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const exportReport = async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      // If data is provided, use the export utility
      if (data && data.length > 0) {
        exportPurchaseList(data, format);
      }
      
      // Show success toast
      toast({
        title: "Report exportiert",
        description: `Der Bericht "${reportName}" wurde als ${format.toUpperCase()} exportiert.`
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <FileBarChart className="h-4 w-4 mr-2" />
          {!isMobile ? "Export Report" : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportReport('excel')}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportReport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportReport('csv')}>
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
