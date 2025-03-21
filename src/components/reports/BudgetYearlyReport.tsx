
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getYearlyBudgetReport } from "@/data/reports";
import { formatCurrency } from "@/lib/utils";
import { getCommonOptions, getAxisOptions, getColorOptions, gradients, formatters } from "@/lib/echarts-theme";
import { EChartsOption } from "echarts";

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

  // ECharts option
  const getOption = (): EChartsOption => {
    const options: EChartsOption = {
      ...getCommonOptions(),
      ...getColorOptions(['primary']),
      ...getAxisOptions(),
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0].data;
          return `
            <div class="font-medium mb-1">Jahr: ${params[0].name}</div>
            <div>Gesamtausgaben: ${formatters.currency(data)}</div>
            ${averageSpend > 0 ? 
              `<div class="mt-1">
                ${data > averageSpend 
                  ? `<span class="text-green-500">+${((data / averageSpend - 1) * 100).toFixed(1)}%</span> über dem Durchschnitt` 
                  : `<span class="text-red-500">-${((1 - data / averageSpend) * 100).toFixed(1)}%</span> unter dem Durchschnitt`}
              </div>` 
              : ''
            }
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: budgetData.map(item => item.year),
        axisLabel: {
          fontSize: 11,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatters.currency(value),
        },
      },
      series: [
        {
          name: 'Budget Ausgaben',
          type: 'bar',
          data: budgetData.map(item => item.totalSpent),
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: gradients.blue,
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            }
          },
          barWidth: '60%',
          animationDelay: (idx: number) => idx * 100,
        }
      ],
      markLine: {
        symbol: ['none', 'none'],
        label: {
          formatter: 'Durchschnitt',
          position: 'start'
        },
        lineStyle: {
          type: 'dashed',
          color: '#888',
        },
        data: [
          { 
            type: 'value', 
            yAxis: averageSpend,
          }
        ]
      },
    };
    
    return options;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full border rounded-lg p-2 sm:p-4">
        <ReactECharts
          option={getOption()}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          className="echarts-for-react"
        />
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3 sm:py-3 sm:px-4 font-medium">Jahr</th>
                <th className="text-right py-2 px-3 sm:py-3 sm:px-4 font-medium">Gesamtausgaben</th>
                <th className="text-right py-2 px-3 sm:py-3 sm:px-4 font-medium">% vom Durchschnitt</th>
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
                <td className="py-2 px-3 sm:py-3 sm:px-4">Durchschnitt</td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">{formatCurrency(averageSpend)}</td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-right">100%</td>
              </tr>
              <tr className="font-medium bg-muted/20">
                <td className="py-2 px-3 sm:py-3 sm:px-4">Gesamt</td>
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
