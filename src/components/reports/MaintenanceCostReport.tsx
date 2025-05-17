
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const getMaintenanceCostData = async (dateRange?: any) => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { assetId: "A1001", assetName: "MacBook Pro 16", category: "Laptops", purchaseValue: 2400, totalMaintenanceCost: 350, maintenanceRatio: 14.6, maintenanceCount: 2 },
    { assetId: "A1002", assetName: "Dell XPS 15", category: "Laptops", purchaseValue: 1800, totalMaintenanceCost: 420, maintenanceRatio: 23.3, maintenanceCount: 3 },
    { assetId: "A1003", assetName: "iPhone 15 Pro", category: "Smartphones", purchaseValue: 1200, totalMaintenanceCost: 280, maintenanceRatio: 23.3, maintenanceCount: 2 },
    { assetId: "A1004", assetName: "Samsung S24 Ultra", category: "Smartphones", purchaseValue: 1100, totalMaintenanceCost: 210, maintenanceRatio: 19.1, maintenanceCount: 1 },
    { assetId: "A1005", assetName: "Dell 34" Monitor", category: "Monitors", purchaseValue: 800, totalMaintenanceCost: 110, maintenanceRatio: 13.8, maintenanceCount: 1 }
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function MaintenanceCostReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['maintenanceCost', dateRange],
    queryFn: () => getMaintenanceCostData(dateRange)
  });

  // Calculate aggregated data
  const categoryData = React.useMemo(() => {
    if (!data) return [];
    
    const categoryMap = new Map();
    data.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          category: item.category,
          totalAssets: 0,
          totalMaintenanceCost: 0,
          totalPurchaseValue: 0
        });
      }
      
      const category = categoryMap.get(item.category);
      category.totalAssets++;
      category.totalMaintenanceCost += item.totalMaintenanceCost;
      category.totalPurchaseValue += item.purchaseValue;
    });
    
    return Array.from(categoryMap.values()).map(item => ({
      ...item,
      maintenanceRatio: (item.totalMaintenanceCost / item.totalPurchaseValue) * 100
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
              <CircleDollarSign className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Wartungskosten nach Kategorie</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" orientation="left" 
                  label={{ value: 'Kosten (€)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" 
                  label={{ value: '%', angle: 90, position: 'insideRight' }} />
                <Tooltip formatter={(value, name) => {
                  if (name === "totalMaintenanceCost") return [formatCurrency(value), "Wartungskosten"];
                  if (name === "maintenanceRatio") return [`${value.toFixed(1)}%`, "% vom Kaufwert"];
                  return [value, name];
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="totalMaintenanceCost" name="Wartungskosten" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="maintenanceRatio" name="% vom Kaufwert" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <CircleDollarSign className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Verteilung der Wartungskosten</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="totalMaintenanceCost"
                  nameKey="category"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierte Wartungskosten</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3">Kaufwert</th>
                  <th className="p-3">Wartungskosten</th>
                  <th className="p-3">% vom Kaufwert</th>
                  <th className="p-3">Anzahl Wartungen</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.assetId} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.assetName}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{formatCurrency(item.purchaseValue)}</td>
                    <td className="p-3">{formatCurrency(item.totalMaintenanceCost)}</td>
                    <td className="p-3">{item.maintenanceRatio.toFixed(1)}%</td>
                    <td className="p-3">{item.maintenanceCount}</td>
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
