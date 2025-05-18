
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const getAssetLifecycleData = async (dateRange?: any) => {
  // Calculate months between dates
  const monthsBetween = (startDate: Date, endDate: Date) => {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
           (endDate.getMonth() - startDate.getMonth());
  };
  
  // Calculate days between dates
  const daysBetween = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Query to get assets with relevant data
  let query = supabase
    .from('assets')
    .select('*')
    .order('purchase_date', { ascending: false });
  
  // Apply date filter if provided
  if (dateRange?.from && dateRange?.to) {
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    query = query
      .gte('purchase_date', fromDate.toISOString().split('T')[0])
      .lte('purchase_date', toDate.toISOString().split('T')[0]);
  }
  
  const { data: assets, error } = await query;
  
  if (error) {
    console.error("Error fetching asset lifecycle data:", error);
    throw new Error("Failed to fetch asset lifecycle data");
  }

  // Group assets by category and analyze lifecycle data
  const categories: Record<string, {
    count: number;
    totalLifespan: number;
    purchaseToDeployment: number;
    deploymentToRetirement: number;
  }> = {};
  
  assets?.forEach(asset => {
    const category = asset.category || 'Unknown';
    const purchaseDate = new Date(asset.purchase_date);
    const today = new Date();
    
    // Initialize the category if it doesn't exist
    if (!categories[category]) {
      categories[category] = {
        count: 0,
        totalLifespan: 0,
        purchaseToDeployment: 0,
        deploymentToRetirement: 0
      };
    }
    
    // Increment the count
    categories[category].count += 1;
    
    // Calculate total lifespan until today or retirement
    let lifespan = monthsBetween(purchaseDate, today);
    
    // If the asset has a handover date, calculate days between purchase and handover
    if (asset.handover_to_employee_date) {
      const handoverDate = new Date(asset.handover_to_employee_date);
      const deploymentDays = daysBetween(purchaseDate, handoverDate);
      categories[category].purchaseToDeployment += deploymentDays;
      
      // If asset has a return date, calculate deployment to retirement
      if (asset.actual_return_date) {
        const returnDate = new Date(asset.actual_return_date);
        const usagePeriod = monthsBetween(handoverDate, returnDate);
        categories[category].deploymentToRetirement += usagePeriod;
        // We use actual return date as the end of lifecycle if available
        lifespan = monthsBetween(purchaseDate, returnDate);
      } else {
        // If no return date, calculate from handover to today
        categories[category].deploymentToRetirement += monthsBetween(handoverDate, today);
      }
    }
    
    categories[category].totalLifespan += lifespan;
  });
  
  // Transform data for the chart
  return Object.keys(categories).map(category => {
    const categoryData = categories[category];
    const count = categoryData.count;
    
    return {
      category,
      count,
      averageLifespanMonths: Math.round(categoryData.totalLifespan / count),
      purchaseToDeploymentDays: Math.round(categoryData.purchaseToDeployment / count),
      deploymentToRetirementMonths: Math.round(categoryData.deploymentToRetirement / count)
    };
  }).sort((a, b) => b.count - a.count); // Sort by count descending
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
