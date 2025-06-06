import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getYearlyAssetPurchasesReport } from "@/data/reports";
import { AssetType, YearlyAssetPurchaseReport } from "@/lib/types";
import { getCommonOptions, getAxisOptions, getColorOptions } from "@/lib/echarts-theme";
import * as echarts from 'echarts';

export default function AssetPurchasesReport() {
  const [purchaseData, setPurchaseData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getYearlyAssetPurchasesReport();
        
        // Transform data for the stacked bar chart
        const formattedData = Array.isArray(data) ? data.map(item => {
          const result: any = { year: item.year };
          
          // Add each asset type count
          Object.entries(item.assetsByType).forEach(([type, count]) => {
            result[type] = count;
          });
          
          return result;
        }) : [];
        
        setPurchaseData(formattedData);
      } catch (error) {
        console.error("Error fetching purchase data:", error);
        setPurchaseData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const assetTypes: AssetType[] = ['laptop', 'smartphone', 'tablet', 'mouse', 'keyboard', 'accessory'];
  
  const assetColors: Record<string, string> = {
    laptop: "#2563eb",
    smartphone: "#16a34a",
    tablet: "#9333ea",
    mouse: "#ca8a04",
    keyboard: "#dc2626",
    accessory: "#0891b2"
  };

  const assetTypeLabels: Record<string, string> = {
    laptop: "Laptops",
    smartphone: "Smartphones",
    tablet: "Tablets",
    mouse: "Mäuse",
    keyboard: "Tastaturen",
    accessory: "Zubehör"
  };

  const getOption = (): echarts.EChartsOption => {
    const options: echarts.EChartsOption = {
      ...getCommonOptions(),
      color: assetTypes.map(type => assetColors[type] || '#8884d8'),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          let content = `<div class="font-medium mb-2">Jahr: ${params[0].axisValue}</div>`;
          let total = 0;
          
          params.forEach((item: any) => {
            content += `
              <div class="flex items-center justify-between gap-2 mb-1">
                <div class="flex items-center gap-1">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background-color:${item.color};"></span>
                  <span>${assetTypeLabels[item.seriesName] || item.seriesName}:</span>
                </div>
                <span class="font-medium">${item.value}</span>
              </div>`;
            total += item.value;
          });
          
          content += `
            <div class="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-muted">
              <span class="font-medium">Gesamt:</span>
              <span class="font-medium">${total}</span>
            </div>`;
          
          return content;
        }
      },
      legend: {
        data: assetTypes.map(type => assetTypeLabels[type] || type),
        bottom: 0,
        orient: 'horizontal',
        textStyle: {
          color: 'var(--muted-foreground)',
          fontSize: 12,
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: purchaseData.map(item => item.year),
        axisLabel: {
          fontSize: 12,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Anzahl',
        nameTextStyle: {
          color: 'var(--muted-foreground)',
          fontSize: 12,
        },
      },
      series: assetTypes.map(type => ({
        name: assetTypeLabels[type] || type,
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: purchaseData.map(item => item[type] || 0),
        itemStyle: {
          borderRadius: type === 'accessory' ? [4, 4, 0, 0] : [0, 0, 0, 0],
        },
        animationDelay: (idx: number) => idx * 50 + assetTypes.indexOf(type) * 100,
      })),
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
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

  if (purchaseData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No purchase data available.</div>
      </div>
    );
  }

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
              <th className="text-left py-3 px-4 font-medium">Jahr</th>
              {assetTypes.map(type => (
                <th key={type} className="text-center py-3 px-4 font-medium">
                  {assetTypeLabels[type] || type}
                </th>
              ))}
              <th className="text-right py-3 px-4 font-medium">Gesamt</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.map((item) => (
              <tr key={item.year} className="border-b hover:bg-muted/30">
                <td className="py-3 px-4">{item.year}</td>
                {assetTypes.map(type => (
                  <td key={type} className="py-3 px-4 text-center">
                    {item[type] || 0}
                  </td>
                ))}
                <td className="py-3 px-4 text-right font-medium">
                  {assetTypes.reduce((sum, type) => sum + (item[type] || 0), 0)}
                </td>
              </tr>
            ))}
            <tr className="font-medium bg-muted/20">
              <td className="py-3 px-4">Gesamt</td>
              {assetTypes.map(type => (
                <td key={type} className="py-3 px-4 text-center">
                  {purchaseData.reduce((sum, item) => sum + (item[type] || 0), 0)}
                </td>
              ))}
              <td className="py-3 px-4 text-right">
                {purchaseData.reduce(
                  (sum, item) => sum + assetTypes.reduce((typeSum, type) => typeSum + (item[type] || 0), 0), 
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
