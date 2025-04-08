
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getWarrantyDefectReport } from "@/data/reports";
import { WarrantyDefectReport } from "@/lib/types";
import { getCommonOptions, getColorOptions } from "@/lib/echarts-theme";
import * as echarts from 'echarts';

export default function WarrantyDefectsReport() {
  const [warrantyData, setWarrantyData] = useState<WarrantyDefectReport | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWarrantyDefectReport();
      setWarrantyData(data);
    };
    
    fetchData();
  }, []);

  if (!warrantyData) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-muted-foreground">Lade Daten...</div>
    </div>;
  }

  const pieData = [
    { name: "Mit Garantie", value: warrantyData.withWarranty.count },
    { name: "Ohne Garantie", value: warrantyData.withoutWarranty.count }
  ];

  const COLORS = ["#16a34a", "#dc2626"];
  const totalDefective = warrantyData.withWarranty.count + warrantyData.withoutWarranty.count;

  const getOption = (): echarts.EChartsOption => {
    const options: echarts.EChartsOption = {
      ...getCommonOptions(),
      color: COLORS,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const percent = (params.value / totalDefective * 100).toFixed(1);
          return `
            <div class="font-medium mb-1">${params.name}</div>
            <div>Anzahl: ${params.value}</div>
            <div>Prozent: ${percent}%</div>
          `;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        data: pieData.map(item => item.name),
        textStyle: {
          color: 'var(--muted-foreground)',
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'Garantiestatus',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            color: 'var(--foreground)',
            fontSize: 12,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            }
          },
          labelLine: {
            show: true,
            smooth: 0.2,
            length: 10,
            length2: 15,
          },
          data: pieData,
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function () {
            return Math.random() * 200;
          }
        }
      ]
    };
    
    return options;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[300px] md:h-[350px] w-full">
          <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            className="echarts-for-react"
          />
        </div>
        
        <div className="flex items-center justify-center">
          <div className="space-y-6 w-full max-w-md">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Defekte Hardware Übersicht</h3>
              <p className="text-muted-foreground">
                Gesamtanzahl defekter Geräte: {totalDefective}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border bg-secondary/30">
                <h4 className="font-medium text-green-600 dark:text-green-500">Mit Garantie</h4>
                <div className="mt-2 text-2xl font-bold">
                  {warrantyData.withWarranty.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {warrantyData.withWarranty.percentage.toFixed(1)}% der defekten Geräte
                </div>
              </div>
              
              <div className="p-4 rounded-lg border bg-secondary/30">
                <h4 className="font-medium text-red-600 dark:text-red-500">Ohne Garantie</h4>
                <div className="mt-2 text-2xl font-bold">
                  {warrantyData.withoutWarranty.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {warrantyData.withoutWarranty.percentage.toFixed(1)}% der defekten Geräte
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-2 px-4 font-medium">Garantiestatus</th>
              <th className="text-center py-2 px-4 font-medium">Anzahl</th>
              <th className="text-right py-2 px-4 font-medium">Prozent</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-muted/30">
              <td className="py-2 px-4">Mit Garantie</td>
              <td className="py-2 px-4 text-center">{warrantyData.withWarranty.count}</td>
              <td className="py-2 px-4 text-right">
                {warrantyData.withWarranty.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr className="border-b hover:bg-muted/30">
              <td className="py-2 px-4">Ohne Garantie</td>
              <td className="py-2 px-4 text-center">{warrantyData.withoutWarranty.count}</td>
              <td className="py-2 px-4 text-right">
                {warrantyData.withoutWarranty.percentage.toFixed(1)}%
              </td>
            </tr>
            <tr className="font-medium bg-muted/20">
              <td className="py-2 px-4">Gesamt</td>
              <td className="py-2 px-4 text-center">{totalDefective}</td>
              <td className="py-2 px-4 text-right">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
