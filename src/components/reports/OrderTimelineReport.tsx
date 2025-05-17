
import { useEffect, useState } from "react";
import { getOrderTimelineByEmployee } from "@/data/reports";
import { OrderTimeline } from "@/lib/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface OrderTimelineReportProps {
  dateRange?: DateRange;
}

export default function OrderTimelineReport({ dateRange }: OrderTimelineReportProps) {
  const [data, setData] = useState<OrderTimeline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const timelineData = await getOrderTimelineByEmployee(undefined, dateRange);
        setData(timelineData);
      } catch (error) {
        console.error("Error fetching order timeline data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading data...</div>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No order data available for the selected period.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((employee) => {
        // Skip employees with no orders
        if (employee.orders.length === 0) return null;
        
        // Calculate total spent by this employee
        const totalSpent = employee.orders.reduce((sum, order) => sum + order.price, 0);
        
        return (
          <div key={employee.employeeId} className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-medium">{employee.employeeName}</h3>
              <div className="text-sm text-muted-foreground">
                Gesamtausgaben: <span className="font-medium">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
            
            <div className="relative pl-8 space-y-6">
              {/* Timeline line */}
              <div className="absolute left-3 top-1 bottom-1 w-0.5 bg-muted"></div>
              
              {employee.orders.map((order, index) => (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <div>
                      <span className="text-muted-foreground text-sm">
                        {formatDate(order.date)}
                      </span>
                      <h4 className="font-medium">{order.assetName}</h4>
                      <p className="text-sm text-muted-foreground">{order.assetType}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatCurrency(order.price)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
