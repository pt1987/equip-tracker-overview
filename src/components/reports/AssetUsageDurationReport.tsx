
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getAssetUsageDurationReport } from "@/data/reports";
import { AssetUsageDurationReport as AssetUsageReport } from "@/lib/types";
import { localizeCategory } from "@/lib/utils";
import { getCommonOptions, getAxisOptions, getColorOptions } from "@/lib/echarts-theme";

export default function AssetUsageDurationReport() {
  const [usageData, setUsageData] = useState<AssetUsageReport[]>([]);

  useEffect(() => {
    const fetchData = () => {
      const data = getAssetUsageDurationReport();
      // Sort data by average months descending for better visualization
      data.sort((a, b) => b.averageMonths - a.averageMonths);
      setUsageData(data);
    };
    
    fetchData();
  }, []);

  const categoryColors: Record<string, string> = {
    notebook: "#2563eb",
    smartphone: "#16a34a",
    tablet: "#9333ea",
    peripheral: "#ca8a04",
    monitor: "#dc2626", 
    audio: "#0891b2"
  };

  // Calculate average usage duration across all categories
  const averageUsage = usageData.length > 0
    ? usageData.reduce((sum, item) => sum + item.averageMonths, 0) / usageData.length
    : 0;

  const getOption = () => {
    return {
      ...getCommonOptions(),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0].data;
          const item = usageData[params[0].dataIndex];
          return `
            <div class="font-medium mb-1">${localizeCategory(item.category)}</div>
            <div>Durchschnittliche Nutzungsdauer: ${data} Monate</div>
            <div>Anzahl Geräte: ${item.count}</div>
            ${averageUsage > 0 ? 
              `<div class="mt-1">
                ${data > averageUsage 
                  ? `<span class="text-green-500">+${((data / averageUsage - 1) * 100).toFixed(0)}%</span> über dem Durchschnitt` 
                  : `<span class="text-red-500">-${((1 - data / averageUsage) * 100).toFixed(0)}%</span> unter dem Durchschnitt`}
              </div>` 
              : ''}
          `;
        }
      },
      grid: {
        left: '15%',
        right: '5%',
        bottom: '5%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: 'Monate',
        nameLocation: 'end',
        nameGap: 10,
        nameTextStyle: {
          color: 'var(--muted-foreground)',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: 'var(--border)',
          },
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: 'var(--border)',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: usageData.map(item => localizeCategory(item.category)),
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: 'var(--muted-foreground)',
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'Durchschnittliche Nutzungsdauer',
          type: 'bar',
          data: usageData.map(item => item.averageMonths),
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: (params: any) => {
              const item = usageData[params.dataIndex];
              return categoryColors[item.category] || '#8884d8';
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
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
          position: 'middle',
          distance: 10,
        },
        lineStyle: {
          type: 'dashed',
          color: '#888',
        },
        data: [
          { 
            type: 'value', 
            xAxis: averageUsage,
          }
        ]
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="h-[350px] md:h-[400px] w-full border rounded-lg p-4">
        <ReactECharts
          option={getOption()}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          className="echarts-for-react"
        />
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium">Kategorie</th>
              <th className="text-center py-3 px-4 font-medium">Anzahl Geräte</th>
              <th className="text-right py-3 px-4 font-medium">Durchschnittliche Nutzung (Monate)</th>
              <th className="text-right py-3 px-4 font-medium">vs. Durchschnitt</th>
            </tr>
          </thead>
          <tbody>
            {usageData.map((item, index) => (
              <tr key={index} className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">{localizeCategory(item.category)}</td>
                <td className="py-3 px-4 text-center">{item.count}</td>
                <td className="py-3 px-4 text-right font-medium">{item.averageMonths}</td>
                <td className="py-3 px-4 text-right">
                  {averageUsage > 0 ? (
                    <span className={item.averageMonths > averageUsage ? "text-green-600" : "text-red-600"}>
                      {item.averageMonths > averageUsage 
                        ? `+${((item.averageMonths / averageUsage - 1) * 100).toFixed(0)}%` 
                        : `-${((1 - item.averageMonths / averageUsage) * 100).toFixed(0)}%`}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            ))}
            <tr className="font-medium bg-muted/20">
              <td className="py-3 px-4">Durchschnitt</td>
              <td className="py-3 px-4 text-center">
                {usageData.reduce((sum, item) => sum + item.count, 0)}
              </td>
              <td className="py-3 px-4 text-right">{averageUsage.toFixed(1)}</td>
              <td className="py-3 px-4 text-right">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
