
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
  Cell,
  ReferenceLine 
} from "recharts";
import { getAssetUsageDurationReport } from "@/data/reports";
import { AssetUsageDurationReport as AssetUsageReport } from "@/lib/types";
import { localizeCategory } from "@/lib/utils";

export default function AssetUsageDurationReport() {
  const [usageData, setUsageData] = useState<AssetUsageReport[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const data = getAssetUsageDurationReport();
      // Sort data by average months descending for better visualization
      data.sort((a, b) => b.averageMonths - a.averageMonths);
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

  // Calculate average usage duration across all categories
  const averageUsage = usageData.length > 0
    ? usageData.reduce((sum, item) => sum + item.averageMonths, 0) / usageData.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="h-[350px] md:h-[400px] w-full border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={usageData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 'dataMax']} 
              label={{ value: 'Months', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="category" 
              dataKey="category" 
              width={90}
              tickFormatter={(value) => localizeCategory(value)}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-card border shadow-sm rounded-md">
                      <p className="font-medium text-sm">{localizeCategory(data.category)}</p>
                      <p className="text-sm">Average Usage: {data.averageMonths} months</p>
                      <p className="text-sm">Device Count: {data.count}</p>
                      {averageUsage > 0 && (
                        <p className="text-sm mt-1">
                          {data.averageMonths > averageUsage 
                            ? `${((data.averageMonths / averageUsage - 1) * 100).toFixed(0)}% above average` 
                            : `${((1 - data.averageMonths / averageUsage) * 100).toFixed(0)}% below average`}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <ReferenceLine x={averageUsage} stroke="#888" label="Average" />
            <Bar 
              dataKey="averageMonths" 
              name="Average Months"
              radius={[0, 4, 4, 0]}
            >
              {usageData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={categoryColors[entry.category] || "#8884d8"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium">Category</th>
              <th className="text-center py-3 px-4 font-medium">Device Count</th>
              <th className="text-right py-3 px-4 font-medium">Average Usage (Months)</th>
              <th className="text-right py-3 px-4 font-medium">vs. Average</th>
            </tr>
          </thead>
          <tbody>
            {usageData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">{localizeCategory(item.category)}</td>
                <td className="py-3 px-4 text-center">{item.count}</td>
                <td className="py-3 px-4 text-right font-medium">{item.averageMonths}</td>
                <td className="py-3 px-4 text-right">
                  {averageUsage > 0 ? (
                    <span className={item.averageMonths > averageUsage ? "text-green-600" : "text-red-600"}>
                      {item.averageMonths > averageUsage 
                        ? `+${((item.averageMonths / averageUsage - 1) * 100).toFixed(0)}%` 
                        : `-${((1 - item.averageMonths / averageUsage) * 100).toFixed(0)}%`}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
            <tr className="font-medium bg-muted/20">
              <td className="py-3 px-4">Average</td>
              <td className="py-3 px-4 text-center">
                {usageData.reduce((sum, item) => sum + item.count, 0)}
              </td>
              <td className="py-3 px-4 text-right">{averageUsage.toFixed(1)}</td>
              <td className="py-3 px-4 text-right">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
