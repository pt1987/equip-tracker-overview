
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
import { getYearlyBudgetReport } from "@/data/reports";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function BudgetYearlyReport() {
  const [budgetData, setBudgetData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const data = getYearlyBudgetReport();
      setBudgetData(data);
    };
    
    fetchData();
  }, []);

  const chartConfig = {
    totalSpent: { color: "#2563eb" }
  };

  return (
    <div className="space-y-6">
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={budgetData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 bg-background border rounded shadow-sm">
                      <p className="font-semibold">Year: {payload[0].payload.year}</p>
                      <p className="font-semibold mt-1">
                        Total Spent: {formatCurrency(payload[0].payload.totalSpent)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="totalSpent" 
              fill="#8884d8" 
              name="Budget Spent"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Year</th>
              <th className="text-right py-2 px-4">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {budgetData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-secondary/50">
                <td className="py-2 px-4">{item.year}</td>
                <td className="py-2 px-4 text-right">{formatCurrency(item.totalSpent)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="py-2 px-4">Total</td>
              <td className="py-2 px-4 text-right">
                {formatCurrency(budgetData.reduce((sum, item) => sum + item.totalSpent, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
