
import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrderTimelineByEmployee } from "@/data/reports";
import { employees } from "@/data/employees";
import { OrderTimeline } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function OrderTimelineReport() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const employeeData = selectedEmployee !== "all" 
        ? getOrderTimelineByEmployee(selectedEmployee)
        : getOrderTimelineByEmployee();
        
      // Format data for timeline chart
      const formattedData: any[] = [];
      
      employeeData.forEach(employee => {
        employee.orders.forEach(order => {
          formattedData.push({
            date: order.date,
            price: order.price,
            name: order.assetName,
            employee: employee.employeeName,
            type: order.assetType
          });
        });
      });
      
      // Sort by date
      formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setTimelineData(formattedData);
    };
    
    fetchData();
  }, [selectedEmployee]);

  const chartConfig = {
    laptop: { color: "#2563eb" },
    smartphone: { color: "#16a34a" },
    tablet: { color: "#9333ea" },
    mouse: { color: "#ca8a04" },
    keyboard: { color: "#dc2626" },
    accessory: { color: "#0891b2" }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="w-64">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {`${employee.firstName} ${employee.lastName}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={timelineData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              tickFormatter={(value) => formatDate(value)}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 bg-background border rounded shadow-sm">
                      <p className="font-semibold">{formatDate(payload[0].payload.date)}</p>
                      <p>{payload[0].payload.name}</p>
                      <p>{payload[0].payload.employee}</p>
                      <p className="font-semibold mt-1">
                        {formatCurrency(payload[0].payload.price)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="price" 
              fill="#8884d8" 
              name="Purchase Price" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Employee</th>
              <th className="text-left py-2 px-4">Asset</th>
              <th className="text-left py-2 px-4">Type</th>
              <th className="text-right py-2 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {timelineData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-secondary/50">
                <td className="py-2 px-4">{formatDate(item.date)}</td>
                <td className="py-2 px-4">{item.employee}</td>
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4 capitalize">{item.type}</td>
                <td className="py-2 px-4 text-right">{formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
