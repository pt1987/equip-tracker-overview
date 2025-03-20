
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
  
  const assetColors: Record<string, string> = {
    laptop: "#2563eb",
    smartphone: "#16a34a",
    tablet: "#9333ea",
    mouse: "#ca8a04",
    keyboard: "#dc2626",
    accessory: "#0891b2"
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
      <div className="h-[350px] md:h-[400px] w-full border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={purchaseData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 bg-card border shadow-sm rounded-md">
                      <p className="font-medium text-sm mb-2">Year: {label}</p>
                      <div className="space-y-1">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-sm" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm">{assetTypeLabels[entry.name] || entry.name}:</span>
                            </div>
                            <span className="text-sm font-medium">{entry.value}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between gap-4 pt-1 mt-1 border-t">
                          <span className="text-sm font-medium">Total:</span>
                          <span className="text-sm font-medium">
                            {payload.reduce((sum, entry) => sum + (entry.value as number), 0)}
                          </span>
                        </div>
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
                fill={assetColors[type] || "#8884d8"}
                name={assetTypeLabels[type] || type}
                radius={type === 'accessory' ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium">Year</th>
              {assetTypes.map(type => (
                <th key={type} className="text-center py-3 px-4 font-medium">
                  {assetTypeLabels[type] || type}
                </th>
              ))}
              <th className="text-right py-3 px-4 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.map((item) => (
              <tr key={item.year} className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">{item.year}</td>
                {assetTypes.map(type => (
                  <td key={type} className="py-3 px-4 text-center">
                    {item[type] || 0}
                  </td>
                ))}
                <td className="py-3 px-4 text-right font-medium">
                  {assetTypes.reduce((sum, type) => sum + (item[type] || 0), 0)}
                </td>
              </tr>
            ))}
            <tr className="font-medium bg-muted/20">
              <td className="py-3 px-4">Total</td>
              {assetTypes.map(type => (
                <td key={type} className="py-3 px-4 text-center">
                  {purchaseData.reduce((sum, item) => sum + (item[type] || 0), 0)}
                </td>
              ))}
              <td className="py-3 px-4 text-right">
                {purchaseData.reduce(
                  (sum, item) => sum + assetTypes.reduce((typeSum, type) => typeSum + (item[type] || 0), 0), 
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
