
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
  ReferenceLine
} from "recharts";
import { getYearlyBudgetReport } from "@/data/reports";
import { formatCurrency } from "@/lib/utils";

export default function BudgetYearlyReport() {
  const [budgetData, setBudgetData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const data = getYearlyBudgetReport();
      setBudgetData(data);
    };
    
    fetchData();
  }, []);

  // Calculate average spend for reference line
  const averageSpend = budgetData.length > 0
    ? budgetData.reduce((sum, item) => sum + item.totalSpent, 0) / budgetData.length
    : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full border rounded-lg p-2 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={budgetData}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="year" 
              axisLine={true}
              tickLine={true}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={60}
              dx={-5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-card border shadow-sm rounded-md">
                      <p className="font-medium text-sm">Year: {data.year}</p>
                      <p className="font-medium mt-1 text-sm">
                        Total Spent: {formatCurrency(data.totalSpent)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <ReferenceLine y={averageSpend} label="Average" stroke="#888" strokeDasharray="3 3" />
            <Bar 
              dataKey="totalSpent" 
              fill="#2563eb" 
              name="Budget Spent"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 sm:py-3 sm:px-4 font-medium">Year</th>
                <th className="text-right py-2 px-3 sm:py-3 sm:px-4 font-medium">Total Spent</th>
                <th className="text-right py-2 px-3 sm:py-3 sm:px-4 font-medium">% of Average</th>
              </tr>
            </thead>
            <tbody>
              {budgetData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-muted/30">
                  <td className="py-2 px-3 sm:py-3 sm:px-4">{item.year}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-right font-medium">{formatCurrency(item.totalSpent)}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">
                    {averageSpend > 0 ? `${((item.totalSpent / averageSpend) * 100).toFixed(1)}%` : '0%'}
                  </td>
                </tr>
              ))}
              <tr className="font-medium bg-muted/20">
                <td className="py-2 px-3 sm:py-3 sm:px-4">Average</td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">{formatCurrency(averageSpend)}</td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">100%</td>
              </tr>
              <tr className="font-medium bg-muted/20">
                <td className="py-2 px-3 sm:py-3 sm:px-4">Total</td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">
                  {formatCurrency(budgetData.reduce((sum, item) => sum + item.totalSpent, 0))}
                </td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
