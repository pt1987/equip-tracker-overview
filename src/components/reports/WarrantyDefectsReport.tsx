
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
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

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
    return <div>Loading...</div>;
  }

  const pieData = [
    { name: "With Warranty", value: warrantyData.withWarranty.count },
    { name: "Without Warranty", value: warrantyData.withoutWarranty.count }
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  const chartConfig = {
    "With Warranty": { color: "#16a34a" },
    "Without Warranty": { color: "#dc2626" }
  };

  const totalDefective = warrantyData.withWarranty.count + warrantyData.withoutWarranty.count;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="min-h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const value = Number(payload[0].value);
                    return (
                      <div className="p-2 bg-background border rounded shadow-sm">
                        <p className="font-semibold">{payload[0].name}</p>
                        <p>Count: {value}</p>
                        <p>
                          Percentage: {((value / totalDefective) * 100).toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
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
              <div className="p-4 border rounded-md bg-secondary/30">
                <h4 className="font-semibold text-green-600">With Warranty</h4>
                <div className="mt-2 text-2xl font-bold">
                  {warrantyData.withWarranty.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {warrantyData.withWarranty.percentage.toFixed(1)}% of defective
                </div>
              </div>
              
              <div className="p-4 border rounded-md bg-secondary/30">
                <h4 className="font-semibold text-red-600">Without Warranty</h4>
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
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Warranty Status</th>
              <th className="text-center py-2 px-4">Count</th>
              <th className="text-right py-2 px-4">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-secondary/50">
              <td className="py-2 px-4">With Warranty</td>
              <td className="py-2 px-4 text-center">{warrantyData.withWarranty.count}</td>
              <td className="py-2 px-4 text-right">
                {warrantyData.withWarranty.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr className="border-b hover:bg-secondary/50">
              <td className="py-2 px-4">Without Warranty</td>
              <td className="py-2 px-4 text-center">{warrantyData.withoutWarranty.count}</td>
              <td className="py-2 px-4 text-right">
                {warrantyData.withoutWarranty.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr className="font-semibold">
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
