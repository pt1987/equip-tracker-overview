
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const getDepartmentAssetsData = async (dateRange?: any) => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { department: "Engineering", assetCount: 120, totalValue: 280000, assetsByType: { laptop: 45, smartphone: 40, tablet: 15, accessory: 20 }, employeeCount: 42, assetsPerEmployee: 2.86 },
    { department: "Design", assetCount: 65, totalValue: 145000, assetsByType: { laptop: 22, smartphone: 18, tablet: 20, accessory: 5 }, employeeCount: 18, assetsPerEmployee: 3.61 },
    { department: "Marketing", assetCount: 38, totalValue: 78000, assetsByType: { laptop: 15, smartphone: 15, tablet: 5, accessory: 3 }, employeeCount: 12, assetsPerEmployee: 3.17 },
    { department: "Sales", assetCount: 42, totalValue: 95000, assetsByType: { laptop: 18, smartphone: 20, tablet: 2, accessory: 2 }, employeeCount: 15, assetsPerEmployee: 2.8 },
    { department: "HR", assetCount: 18, totalValue: 35000, assetsByType: { laptop: 8, smartphone: 6, tablet: 2, accessory: 2 }, employeeCount: 6, assetsPerEmployee: 3.0 },
    { department: "Finance", assetCount: 25, totalValue: 55000, assetsByType: { laptop: 10, smartphone: 8, tablet: 3, accessory: 4 }, employeeCount: 8, assetsPerEmployee: 3.13 }
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DepartmentAssetsReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['departmentAssets', dateRange],
    queryFn: () => getDepartmentAssetsData(dateRange)
  });

  const pieData = React.useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      name: item.department,
      value: item.assetCount
    }));
  }, [data]);

  const valuePieData = React.useMemo(() => {
    if (!data) return [];
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
                <Tooltip formatter={(value) => [`${value} Assets`, ""]} />
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
                <Tooltip formatter={(value) => [formatCurrency(value), ""]} />
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
              <Tooltip formatter={(value, name) => {
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
