
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface DepartmentAssetData {
  department: string;
  assetCount: number;
  totalValue: number;
  assetsByType: {
    laptop: number;
    smartphone: number;
    tablet: number;
    accessory: number;
  };
  employeeCount: number;
  assetsPerEmployee: number;
}

const getDepartmentAssetsData = async (dateRange?: any): Promise<DepartmentAssetData[]> => {
  console.log("Fetching department assets data with date range:", dateRange);
  
  try {
    // First, get employees grouped by cluster (department)
    const { data: employeesByDepartment, error: employeeError } = await supabase
      .from('employees')
      .select('cluster, id')
      .order('cluster');
    
    if (employeeError) {
      console.error("Error fetching employees by department:", employeeError);
      throw employeeError;
    }
    
    // Count employees by department
    const departmentCounts: Record<string, number> = {};
    employeesByDepartment.forEach(emp => {
      const dept = emp.cluster || 'Unknown';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    // Get all assets
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
      console.error("Error fetching assets:", assetError);
      throw assetError;
    }

    // Get employee details to determine department for each asset
    const { data: employees, error: detailError } = await supabase
      .from('employees')
      .select('id, cluster');
    
    if (detailError) {
      console.error("Error fetching employee details:", detailError);
      throw detailError;
    }

    // Create a map of employee ID to department
    const employeeDepartmentMap: Record<string, string> = {};
    employees.forEach(emp => {
      employeeDepartmentMap[emp.id] = emp.cluster || 'Unknown';
    });

    // Group assets by department using the employee's department
    const departmentAssets: Record<string, {
      assets: any[],
      assetTypes: Record<string, number>
    }> = {};

    assets.forEach(asset => {
      // Determine the department based on the asset's assigned employee
      const department = asset.employee_id ? 
        employeeDepartmentMap[asset.employee_id] || 'Unassigned' : 
        'Unassigned';

      if (!departmentAssets[department]) {
        departmentAssets[department] = {
          assets: [],
          assetTypes: { laptop: 0, smartphone: 0, tablet: 0, accessory: 0 }
        };
      }

      departmentAssets[department].assets.push(asset);

      // Update asset type count
      const assetType = asset.type ? asset.type.toLowerCase() : 'accessory';
      if (assetType.includes('laptop') || assetType.includes('notebook')) {
        departmentAssets[department].assetTypes.laptop += 1;
      } else if (assetType.includes('phone') || assetType.includes('smartphone')) {
        departmentAssets[department].assetTypes.smartphone += 1;
      } else if (assetType.includes('tablet') || assetType.includes('ipad')) {
        departmentAssets[department].assetTypes.tablet += 1;
      } else {
        departmentAssets[department].assetTypes.accessory += 1;
      }
    });

    // Format the data for the report
    return Object.keys(departmentAssets).map(department => {
      const deptAssets = departmentAssets[department].assets;
      const assetCount = deptAssets.length;
      const totalValue = deptAssets.reduce((sum, asset) => sum + (Number(asset.price) || 0), 0);
      const employeeCount = departmentCounts[department] || 0;
      
      return {
        department,
        assetCount,
        totalValue,
        assetsByType: departmentAssets[department].assetTypes,
        employeeCount,
        assetsPerEmployee: employeeCount > 0 ? assetCount / employeeCount : 0
      };
    }).filter(dept => dept.assetCount > 0 || dept.employeeCount > 0);
  } catch (error) {
    console.error("Error in getDepartmentAssetsData:", error);
    return [];
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DepartmentAssetsReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['departmentAssets', dateRange],
    queryFn: () => getDepartmentAssetsData(dateRange)
  });

  const pieData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      name: item.department,
      value: item.assetCount
    }));
  }, [data]);

  const valuePieData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      name: item.department,
      value: item.totalValue
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-muted-foreground">Fehler beim Laden der Daten</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Keine Abteilungsdaten verfügbar</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Asset-Verteilung nach Abteilung</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} Assets`, ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Asset-Wertverteilung nach Abteilung</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={valuePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {valuePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Assets pro Mitarbeiter nach Abteilung</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === "assetsPerEmployee") return [`${value.toFixed(2)}`, "Assets pro Mitarbeiter"];
                if (name === "employeeCount") return [`${value}`, "Anzahl Mitarbeiter"];
                return [value, name];
              }} />
              <Legend />
              <Bar dataKey="assetsPerEmployee" name="Assets pro Mitarbeiter" fill="#8884d8" />
              <Bar dataKey="employeeCount" name="Anzahl Mitarbeiter" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierte Abteilungsübersicht</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Abteilung</th>
                  <th className="p-3">Mitarbeiter</th>
                  <th className="p-3">Assets</th>
                  <th className="p-3">Laptops</th>
                  <th className="p-3">Smartphones</th>
                  <th className="p-3">Tablets</th>
                  <th className="p-3">Zubehör</th>
                  <th className="p-3">Assets/MA</th>
                  <th className="p-3">Gesamtwert</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.department}</td>
                    <td className="p-3">{item.employeeCount}</td>
                    <td className="p-3">{item.assetCount}</td>
                    <td className="p-3">{item.assetsByType.laptop || 0}</td>
                    <td className="p-3">{item.assetsByType.smartphone || 0}</td>
                    <td className="p-3">{item.assetsByType.tablet || 0}</td>
                    <td className="p-3">{item.assetsByType.accessory || 0}</td>
                    <td className="p-3">{item.assetsPerEmployee.toFixed(2)}</td>
                    <td className="p-3">{formatCurrency(item.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
