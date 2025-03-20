
import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell 
} from "recharts";
import { getAssetUsageDurationReport } from "@/data/reports";
import { AssetUsageDurationReport as AssetUsageReport } from "@/lib/types";
import { localizeCategory } from "@/lib/utils";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function AssetUsageDurationReport() {
  const [usageData, setUsageData] = useState<AssetUsageReport[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const data = getAssetUsageDurationReport();
      setUsageData(data);
    };
    
    fetchData();
  }, []);

  const categoryColors: Record<string, string> = {
    notebook: "#2563eb",
    smartphone: "#16a34a",
    tablet: "#9333ea",
    peripheral: "#ca8a04",
    monitor: "#dc2626",
    audio: "#0891b2"
  };

  const chartConfig = Object.fromEntries(
    Object.entries(categoryColors).map(([key, value]) => [key, { color: value }])
  );

  return (
    <div className="space-y-6">
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={usageData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45} 
              textAnchor="end"
              tickFormatter={(value) => localizeCategory(value)}
            />
            <YAxis label={{ value: 'Months', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2 bg-background border rounded shadow-sm">
                      <p className="font-semibold">{localizeCategory(data.category)}</p>
                      <p>Average Usage: {data.averageMonths} months</p>
                      <p>Device Count: {data.count}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="averageMonths" 
              name="Average Months"
              radius={[4, 4, 0, 0]}
            >
              {usageData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={categoryColors[entry.category] || "#8884d8"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Category</th>
              <th className="text-center py-2 px-4">Count</th>
              <th className="text-right py-2 px-4">Average Usage (Months)</th>
            </tr>
          </thead>
          <tbody>
            {usageData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-secondary/50">
                <td className="py-2 px-4">{localizeCategory(item.category)}</td>
                <td className="py-2 px-4 text-center">{item.count}</td>
                <td className="py-2 px-4 text-right">{item.averageMonths}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
