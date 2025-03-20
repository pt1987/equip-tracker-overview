
import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { getYearlyAssetPurchasesReport } from "@/data/reports";
import { AssetType } from "@/lib/types";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function AssetPurchasesReport() {
  const [purchaseData, setPurchaseData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const data = getYearlyAssetPurchasesReport();
      
      // Transform data for the stacked bar chart
      const formattedData = data.map(item => {
        const result: any = { year: item.year };
        
        // Add each asset type count
        Object.entries(item.assetsByType).forEach(([type, count]) => {
          result[type] = count;
        });
        
        return result;
      });
      
      setPurchaseData(formattedData);
    };
    
    fetchData();
  }, []);

  const assetTypes: AssetType[] = ['laptop', 'smartphone', 'tablet', 'mouse', 'keyboard', 'accessory'];
  
  const chartConfig = {
    laptop: { color: "#2563eb" },
    smartphone: { color: "#16a34a" },
    tablet: { color: "#9333ea" },
    mouse: { color: "#ca8a04" },
    keyboard: { color: "#dc2626" },
    accessory: { color: "#0891b2" }
  };

  const assetTypeLabels: Record<string, string> = {
    laptop: "Laptops",
    smartphone: "Smartphones",
    tablet: "Tablets",
    mouse: "Mice",
    keyboard: "Keyboards",
    accessory: "Accessories"
  };

  return (
    <div className="space-y-6">
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={purchaseData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 bg-background border rounded shadow-sm">
                      <p className="font-semibold">Year: {label}</p>
                      <div className="mt-1 space-y-1">
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }}>
                            {assetTypeLabels[entry.name] || entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {assetTypes.map((type) => (
              <Bar
                key={type}
                dataKey={type}
                stackId="a"
                fill={chartConfig[type]?.color || "#8884d8"}
                name={assetTypeLabels[type] || type}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Year</th>
              {assetTypes.map(type => (
                <th key={type} className="text-center py-2 px-4 capitalize">
                  {assetTypeLabels[type] || type}
                </th>
              ))}
              <th className="text-right py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.map((item) => (
              <tr key={item.year} className="border-b hover:bg-secondary/50">
                <td className="py-2 px-4">{item.year}</td>
                {assetTypes.map(type => (
                  <td key={type} className="py-2 px-4 text-center">
                    {item[type] || 0}
                  </td>
                ))}
                <td className="py-2 px-4 text-right font-semibold">
                  {assetTypes.reduce((sum, type) => sum + (item[type] || 0), 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
