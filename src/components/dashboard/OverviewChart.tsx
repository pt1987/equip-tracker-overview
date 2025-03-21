
import ReactECharts from "echarts-for-react";
import { cn } from "@/lib/utils";
import { getCommonOptions, getColorOptions } from "@/lib/echarts-theme";
import * as echarts from 'echarts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface OverviewChartProps {
  data: ChartData[];
  title: string;
  className?: string;
}

export default function OverviewChart({ data, title, className }: OverviewChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const getOption = (): echarts.EChartsOption => {
    const options: echarts.EChartsOption = {
      ...getCommonOptions(),
      color: data.map(item => item.color),
      title: {
        text: total.toString(),
        subtext: 'Gesamt',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 28,
          fontWeight: 'bold',
          color: 'var(--foreground)',
        },
        subtextStyle: {
          fontSize: 12,
          color: 'var(--muted-foreground)',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const percent = ((params.value / total) * 100).toFixed(0);
          return `
            <div class="font-medium">${params.name}</div>
            <div>${params.value} (${percent}%)</div>
          `;
        }
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['60%', '80%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            scale: true,
            scaleSize: 5,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            }
          },
          data: data,
          animationType: 'scale',
          animationEasing: 'elasticOut',
        }
      ],
      animation: true,
      animationEasing: 'elasticOut',
    };
    
    return options;
  };

  return (
    <div className={cn("glass-card p-6", className)}>
      <h3 className="font-medium mb-4">{title}</h3>
      
      <div className="relative h-[240px]">
        <ReactECharts
          option={getOption()}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          className="echarts-for-react"
        />
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.value}</span>
              <span className="text-xs text-muted-foreground">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
