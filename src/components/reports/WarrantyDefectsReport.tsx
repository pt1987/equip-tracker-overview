
import { useEffect, useState } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { getWarrantyDefectReport } from "@/data/reports";
import { WarrantyDefectReport } from "@/lib/types";

export default function WarrantyDefectsReport() {
  const [warrantyData, setWarrantyData] = useState<WarrantyDefectReport | null>(null);

  useEffect(() => {
    const fetchData = () => {
      const data = getWarrantyDefectReport();
      setWarrantyData(data);
    };
    
    fetchData();
  }, []);

  if (!warrantyData) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-muted-foreground">Loading data...</div>
    </div>;
  }

  const pieData = [
    { name: "With Warranty", value: warrantyData.withWarranty.count },
    { name: "Without Warranty", value: warrantyData.withoutWarranty.count }
  ];

  const COLORS = ["#16a34a", "#dc2626"];
  const totalDefective = warrantyData.withWarranty.count + warrantyData.withoutWarranty.count;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const value = Number(payload[0].value);
                    const percentage = (value / totalDefective) * 100;
                    
                    return (
                      <div className="p-3 bg-card border shadow-sm rounded-md">
                        <p className="font-medium text-sm">{data.name}</p>
                        <p className="text-sm">Count: {value}</p>
                        <p className="text-sm">
                          Percentage: {percentage.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="space-y-6 w-full max-w-md">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Defective Hardware Summary</h3>
              <p className="text-muted-foreground">
                Total defective devices: {totalDefective}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-secondary/30">
                <h4 className="font-medium text-green-600 dark:text-green-500">With Warranty</h4>
                <div className="mt-2 text-2xl font-bold">
                  {warrantyData.withWarranty.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {warrantyData.withWarranty.percentage.toFixed(1)}% of defective
                </div>
              </div>
              
              <div className="p-4 rounded-lg border bg-secondary/30">
                <h4 className="font-medium text-red-600 dark:text-red-500">Without Warranty</h4>
                <div className="mt-2 text-2xl font-bold">
                  {warrantyData.withoutWarranty.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {warrantyData.withoutWarranty.percentage.toFixed(1)}% of defective
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-4 font-medium">Warranty Status</th>
              <th className="text-center py-2 px-4 font-medium">Count</th>
              <th className="text-right py-2 px-4 font-medium">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-muted/30">
              <td className="py-2 px-4">With Warranty</td>
              <td className="py-2 px-4 text-center">{warrantyData.withWarranty.count}</td>
              <td className="py-2 px-4 text-right">
                {warrantyData.withWarranty.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr className="border-b hover:bg-muted/30">
              <td className="py-2 px-4">Without Warranty</td>
              <td className="py-2 px-4 text-center">{warrantyData.withoutWarranty.count}</td>
              <td className="py-2 px-4 text-right">
                {warrantyData.withoutWarranty.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr className="font-medium bg-muted/20">
              <td className="py-2 px-4">Total</td>
              <td className="py-2 px-4 text-center">{totalDefective}</td>
              <td className="py-2 px-4 text-right">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
