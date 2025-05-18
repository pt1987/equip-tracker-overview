
import React from "react";
import { Building2 } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import DepartmentAssetsReport from "@/components/reports/DepartmentAssetsReport";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/reports/DateRangeFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { ReportExportButton } from "@/components/reports/ReportExportButton";
import { ReportInfoTooltip } from "@/components/reports/ReportInfoTooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DepartmentAssets() {
  const { dateRange, setDateRange } = useDateRangeFilter();
  
  // Query to fetch data for export
  const { data: reportData = [] } = useQuery({
    queryKey: ['departmentAssetsExport', dateRange],
    queryFn: async () => {
      try {
        // Get employees grouped by cluster (department)
        const { data: employees, error: employeeError } = await supabase
          .from('employees')
          .select('cluster, id');
        
        if (employeeError) {
          console.error("Error fetching employees for export:", employeeError);
          return [];
        }
        
        // Get assets
        let assetsQuery = supabase
          .from('assets')
          .select('*');
        
        // Apply date filter if provided
        if (dateRange?.from && dateRange?.to) {
          assetsQuery = assetsQuery
            .gte('purchase_date', new Date(dateRange.from).toISOString().split('T')[0])
            .lte('purchase_date', new Date(dateRange.to).toISOString().split('T')[0]);
        }
        
        const { data: assets, error: assetError } = await assetsQuery;
        
        if (assetError) {
          console.error("Error fetching assets for export:", assetError);
          return [];
        }
        
        // Group employees by department
        const departmentEmployees: Record<string, any[]> = {};
        employees.forEach(emp => {
          const dept = emp.cluster || 'Unknown';
          if (!departmentEmployees[dept]) {
            departmentEmployees[dept] = [];
          }
          departmentEmployees[dept].push(emp);
        });
        
        // Create employee ID to department map
        const employeeDeptMap: Record<string, string> = {};
        employees.forEach(emp => {
          employeeDeptMap[emp.id] = emp.cluster || 'Unknown';
        });
        
        // Group assets by department and count by type
        const departmentAssets: Record<string, {
          assets: any[],
          assetsByType: {
            laptop: number;
            smartphone: number;
            tablet: number;
            accessory: number;
          }
        }> = {};
        
        assets.forEach(asset => {
          const dept = asset.employee_id ? employeeDeptMap[asset.employee_id] || 'Unassigned' : 'Unassigned';
          
          if (!departmentAssets[dept]) {
            departmentAssets[dept] = {
              assets: [],
              assetsByType: { laptop: 0, smartphone: 0, tablet: 0, accessory: 0 }
            };
          }
          
          departmentAssets[dept].assets.push(asset);
          
          // Count by type
          const assetType = asset.type ? asset.type.toLowerCase() : 'accessory';
          if (assetType.includes('laptop') || assetType.includes('notebook')) {
            departmentAssets[dept].assetsByType.laptop += 1;
          } else if (assetType.includes('phone') || assetType.includes('smartphone')) {
            departmentAssets[dept].assetsByType.smartphone += 1;
          } else if (assetType.includes('tablet') || assetType.includes('ipad')) {
            departmentAssets[dept].assetsByType.tablet += 1;
          } else {
            departmentAssets[dept].assetsByType.accessory += 1;
          }
        });
        
        // Format data for export
        return Object.keys(departmentEmployees).map(dept => {
          const deptAssets = departmentAssets[dept]?.assets || [];
          return {
            department: dept,
            employees: departmentEmployees[dept].length,
            assets: deptAssets.length,
            totalValue: deptAssets.reduce((sum, asset) => sum + (Number(asset.price) || 0), 0),
            assetsPerEmployee: departmentEmployees[dept].length > 0 ? 
              deptAssets.length / departmentEmployees[dept].length : 0,
            laptops: departmentAssets[dept]?.assetsByType.laptop || 0,
            smartphones: departmentAssets[dept]?.assetsByType.smartphone || 0,
            tablets: departmentAssets[dept]?.assetsByType.tablet || 0,
            accessories: departmentAssets[dept]?.assetsByType.accessory || 0
          };
        });
      } catch (error) {
        console.error("Error preparing department assets for export:", error);
        return [];
      }
    }
  });
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                <span>Abteilungsübersicht</span>
              </h1>
              <p className="text-muted-foreground">
                Analyse der Asset-Verteilung und -Nutzung nach Abteilungen
              </p>
            </div>
            
            <ReportExportButton reportName="Abteilungsübersicht" data={reportData} />
          </div>
          
          <ReportsNavigation />
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Abteilungsübersicht</CardTitle>
                  <CardDescription>Verteilung und Nutzung von Assets nach Abteilungen und Mitarbeitern</CardDescription>
                </div>
                <ReportInfoTooltip 
                  title="Abteilungsübersicht"
                  description="Dieser Bericht zeigt die Verteilung und Nutzung von IT-Assets nach Abteilungen und Mitarbeitern.

Was zeigt dieser Bericht:
- Anzahl der Assets pro Abteilung
- Wert der Assets pro Abteilung
- Verteilung der Asset-Typen innerhalb einer Abteilung
- Nutzungsgrad der Assets nach Abteilung

Anwendung:
Nutzen Sie diesen Bericht, um die Asset-Verteilung zwischen Abteilungen zu vergleichen und Ressourcen entsprechend zu verteilen. Abteilungen mit älteren Assets oder höherem Nutzungsgrad könnten priorisiert werden."
                  showAsDialog={true}
                />
              </div>
              <div className="pt-4">
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <DepartmentAssetsReport />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
