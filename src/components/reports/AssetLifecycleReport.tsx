
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

const getAssetLifecycleData = async (dateRange?: any) => {
  // In a real implementation, this would fetch data from an API based on the date range
  // For now, returning sample data
  return [
    { category: "Laptops", averageLifespanMonths: 36, count: 45, purchaseToDeploymentDays: 5, deploymentToRetirementMonths: 35 },
    { category: "Smartphones", averageLifespanMonths: 24, count: 38, purchaseToDeploymentDays: 3, deploymentToRetirementMonths: 23 },
    { category: "Monitors", averageLifespanMonths: 48, count: 52, purchaseToDeploymentDays: 2, deploymentToRetirementMonths: 47 },
    { category: "Tablets", averageLifespanMonths: 30, count: 23, purchaseToDeploymentDays: 4, deploymentToRetirementMonths: 29 },
    { category: "Desktop PCs", averageLifespanMonths: 60, count: 17, purchaseToDeploymentDays: 7, deploymentToRetirementMonths: 58 }
  ];
};

export default function AssetLifecycleReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assetLifecycle', dateRange],
    queryFn: () => getAssetLifecycleData(dateRange)
  });

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
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Durchschnittliche Lebensdauer nach Kategorie</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" orientation="left" label={{ value: 'Monate', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value, name) => {
                if (name === "averageLifespanMonths") return [`${value} Monate`, "Durchschn. Lebensdauer"];
                if (name === "purchaseToDeploymentDays") return [`${value} Tage`, "Zeit bis zur Bereitstellung"];
                if (name === "deploymentToRetirementMonths") return [`${value} Monate`, "Nutzungszeit"];
                return [value, name];
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="averageLifespanMonths" name="Durchschn. Lebensdauer" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierte Lebenszyklusdaten</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3">Anzahl</th>
                  <th className="p-3">Tage bis Bereitstellung</th>
                  <th className="p-3">Nutzungsdauer (Monate)</th>
                  <th className="p-3">Gesamtlebensdauer (Monate)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">{item.purchaseToDeploymentDays}</td>
                    <td className="p-3">{item.deploymentToRetirementMonths}</td>
                    <td className="p-3">{item.averageLifespanMonths}</td>
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
