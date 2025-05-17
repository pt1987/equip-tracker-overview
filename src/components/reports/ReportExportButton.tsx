
import React from "react";
import { FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { exportPurchaseList } from "@/utils/purchase-export";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReportExportButtonProps {
  reportName: string;
  data?: any[];
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export function ReportExportButton({ 
  reportName, 
  data = [], 
  className = "", 
  variant = "outline" 
}: ReportExportButtonProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const exportReport = async (format: 'excel' | 'pdf' | 'csv') => {
    try {
      // If data is provided, use the export utility
      if (data && data.length > 0) {
        exportPurchaseList(data, format, `${reportName}_Export`);
      } else {
        throw new Error("Keine Daten zum Exportieren vorhanden");
      }
      
      // Show success toast with appropriate message
      const formatDisplayName = format === 'excel' ? 'Excel' : format === 'pdf' ? 'PDF' : 'CSV';
      
      toast({
        title: "Report exportiert",
        description: `Der Bericht "${reportName}" wurde als ${formatDisplayName} exportiert.`,
      });
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: error instanceof Error ? error.message : "Beim Exportieren des Berichts ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
      console.error("Export error:", error);
    }
  };

  // Check if we have data to export
  const hasData = data && data.length > 0;
  
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={variant} 
                  className={`${className} ${hasData ? '' : 'opacity-50 cursor-not-allowed'}`}
                  disabled={!hasData}
                >
                  <FileBarChart className="h-4 w-4 mr-2" />
                  {!isMobile ? "Export Report" : "Export"}
                </Button>
              </DropdownMenuTrigger>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {hasData 
              ? "Report als Excel, PDF oder CSV exportieren" 
              : "Keine Daten zum Exportieren vorhanden"}
          </TooltipContent>
        </Tooltip>
        
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => exportReport('excel')} disabled={!hasData}>
            Export als Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportReport('pdf')} disabled={!hasData}>
            Export als PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportReport('csv')} disabled={!hasData}>
            Export als CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
