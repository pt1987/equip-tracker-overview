
import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrderTimelineByEmployee } from "@/data/reports";
import { employees } from "@/data/employees";
import { formatCurrency, formatDate } from "@/lib/utils";

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

  const getBarColor = (type: string) => {
    const colors = {
      laptop: "#2563eb",
      smartphone: "#16a34a",
      tablet: "#9333ea",
      mouse: "#ca8a04",
      keyboard: "#dc2626",
      accessory: "#0891b2"
    };
    
    return colors[type as keyof typeof colors] || "#8884d8";
  };

  // Calculate average price for reference line
  const averagePrice = timelineData.length > 0
    ? timelineData.reduce((sum, item) => sum + item.price, 0) / timelineData.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="w-full md:w-64">
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
        <div className="text-sm text-muted-foreground ml-auto">
          {timelineData.length} purchases displayed
        </div>
      </div>
      
      <div className="h-[350px] md:h-[400px] w-full border rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={timelineData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={70}
              tickFormatter={(value) => formatDate(value)}
              interval="preserveStartEnd"
              minTickGap={15}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              width={80}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 bg-card border shadow-sm rounded-md">
                      <p className="font-medium text-sm">{formatDate(data.date)}</p>
                      <p className="text-sm">{data.name}</p>
                      <p className="text-sm">{data.employee}</p>
                      <p className="font-medium mt-1 text-sm">
                        {formatCurrency(data.price)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <ReferenceLine y={averagePrice} label="Average" stroke="#888" strokeDasharray="3 3" />
            <Bar 
              dataKey="price" 
              name="Purchase Price" 
              radius={[4, 4, 0, 0]}
              fill="#2563eb"
              fillOpacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Employee</th>
              <th className="text-left py-3 px-4 font-medium">Asset</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-right py-3 px-4 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {timelineData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">{formatDate(item.date)}</td>
                <td className="py-3 px-4">{item.employee}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4 capitalize">{item.type}</td>
                <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.price)}</td>
              </tr>
            ))}
            {timelineData.length > 0 && (
              <tr className="font-medium bg-muted/20">
                <td colSpan={4} className="py-3 px-4">Average</td>
                <td className="py-3 px-4 text-right">{formatCurrency(averagePrice)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
