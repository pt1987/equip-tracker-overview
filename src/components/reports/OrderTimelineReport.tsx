import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrderTimelineByEmployee } from "@/data/reports";
import { getEmployees } from "@/data/employees";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCommonOptions, getAxisOptions, getColorOptions, gradients } from "@/lib/echarts-theme";
import * as echarts from 'echarts';

export default function OrderTimelineReport() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        setEmployees(employeeData || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setEmployees([]);
      }
    };
    
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const employeeData = selectedEmployee !== "all" 
          ? await getOrderTimelineByEmployee(selectedEmployee)
          : await getOrderTimelineByEmployee();
          
        // Format data for timeline chart
        const formattedData: any[] = [];
        
        if (employeeData && Array.isArray(employeeData)) {
          employeeData.forEach(employee => {
            if (employee && employee.orders && Array.isArray(employee.orders)) {
              employee.orders.forEach(order => {
                formattedData.push({
                  date: order.date,
                  price: order.price,
                  name: order.assetName,
                  employee: employee.employeeName,
                  type: order.assetType
                });
              });
            }
          });
        }
        
        // Sort by date
        formattedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setTimelineData(formattedData);
      } catch (error) {
        console.error("Error fetching timeline data:", error);
        setTimelineData([]);
      } finally {
        setIsLoading(false);
      }
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

  const averagePrice = timelineData.length > 0
    ? timelineData.reduce((sum, item) => sum + item.price, 0) / timelineData.length
    : 0;

  const getOption = (): echarts.EChartsOption => {
    const options: echarts.EChartsOption = {
      ...getCommonOptions(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const item = params[0];
          const data = item.data;
          return `
            <div class="font-medium mb-1">${formatDate(data.date)}</div>
            <div>${data.name}</div>
            <div>${data.employee}</div>
            <div class="font-medium mt-1">${formatCurrency(data.price)}</div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '5%',
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 100,
          bottom: 0,
          height: 20,
          borderColor: 'transparent',
          backgroundColor: 'var(--muted)',
          fillerColor: 'var(--muted-foreground)',
          handleStyle: {
            borderColor: 'var(--primary)',
            borderWidth: 1,
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          }
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
        }
      ],
      xAxis: {
        type: 'category',
        data: timelineData.map((item) => formatDate(item.date)),
        axisLabel: {
          interval: 'auto',
          rotate: 45,
          hideOverlap: true,
          formatter: (value: string) => {
            return value;
          }
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatCurrency(value),
        },
      },
      series: [
        {
          name: 'Kaufpreis',
          type: 'bar',
          data: timelineData.map(item => ({
            value: item.price,
            date: item.date,
            name: item.name,
            employee: item.employee,
            itemStyle: {
              color: getBarColor(item.type),
            }
          })),
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            opacity: 0.8,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            }
          },
          barWidth: '60%',
          animationDelay: (idx: number) => idx * 20,
        }
      ],
      markLine: {
        symbol: ['none', 'none'],
        label: {
          formatter: 'Durchschnitt',
          position: 'middle',
        },
        lineStyle: {
          type: 'dashed',
          color: '#888',
        },
        data: [
          { 
            type: 'value', 
            yAxis: averagePrice,
          }
        ]
      },
      animationEasing: 'elasticOut',
    };
    
    return options;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="w-full md:w-64">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Choose employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {Array.isArray(employees) && employees.map((employee) => (
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
      
      {timelineData.length > 0 ? (
        <>
          <div className="h-[350px] md:h-[400px] w-full border rounded-lg p-4">
            <ReactECharts
              option={getOption()}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
              className="echarts-for-react"
              notMerge={true}
            />
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
        </>
      ) : (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-muted-foreground">No data available.</div>
        </div>
      )}
    </div>
  );
}
