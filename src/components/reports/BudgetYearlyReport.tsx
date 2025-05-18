
import { useState } from "react";
import { DateRange } from "react-day-picker";
import ReactECharts from "echarts-for-react";
import { formatCurrency } from "@/lib/utils";
import { getCommonOptions } from "@/lib/echarts-theme";
import * as echarts from 'echarts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { YearlyBudgetReport } from "@/lib/types";

interface BudgetYearlyReportProps {
  dateRange?: DateRange;
}

// Function to fetch yearly budget data from Supabase
const getYearlyBudgetReport = async (dateRange?: DateRange): Promise<YearlyBudgetReport[]> => {
  let query = supabase
    .from('yearly_budget')
    .select('year, spent_amount')
    .order('year', { ascending: true });
  
  // Apply date filter if provided
  if (dateRange?.from && dateRange?.to) {
    const fromYear = new Date(dateRange.from).getFullYear();
    const toYear = new Date(dateRange.to).getFullYear();
    
    query = query
      .gte('year', fromYear)
      .lte('year', toYear);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching yearly budget data:", error);
    throw new Error("Failed to fetch yearly budget data");
  }
  
  // Aggregate data by year
  const yearlyData: Record<number, number> = {};
  
  data?.forEach(item => {
    const { year, spent_amount } = item;
    if (!yearlyData[year]) {
      yearlyData[year] = 0;
    }
    yearlyData[year] += Number(spent_amount);
  });
  
  // Transform into array of objects
  return Object.keys(yearlyData).map(year => ({
    year: parseInt(year),
    totalSpent: yearlyData[parseInt(year)]
  })).sort((a, b) => a.year - b.year);
};

export default function BudgetYearlyReport({ dateRange }: BudgetYearlyReportProps) {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['yearlyBudget', dateRange],
    queryFn: () => getYearlyBudgetReport(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,  // 10 minutes
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading data...</div>
      </div>
    );
  }
  
  if (isError || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No budget data available for the selected period.</div>
      </div>
    );
  }
  
  const chartOption: echarts.EChartsOption = {
    ...getCommonOptions(),
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        const year = params[0].name;
        const value = params[0].value;
        return `<div class="font-medium">${year}</div>
                <div>${formatCurrency(value)}</div>`;
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.year.toString()),
      axisLabel: {
        rotate: data.length > 5 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => formatCurrency(value).replace('EUR', '€')
      }
    },
    series: [
      {
        name: 'Budget',
        type: 'bar',
        data: data.map(item => item.totalSpent),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4ade80' },
            { offset: 1, color: '#22c55e' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#86efac' },
              { offset: 1, color: '#4ade80' }
            ])
          }
        },
        barWidth: '40%'
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '8%',
      containLabel: true
    }
  };

  // Get total budget
  const totalBudget = data.reduce((sum, item) => sum + item.totalSpent, 0);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Gesamtbudget: {formatCurrency(totalBudget)}</h3>
        <p className="text-muted-foreground text-sm">
          Verteilung über {data.length} Jahre
        </p>
      </div>
      
      <div className="h-[350px]">
        <ReactECharts
          option={chartOption}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left px-4 py-2">Jahr</th>
              <th className="text-right px-4 py-2">Budget</th>
              <th className="text-right px-4 py-2">Prozent vom Gesamtbudget</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const percentage = totalBudget > 0 
                ? ((item.totalSpent / totalBudget) * 100).toFixed(1) 
                : '0.0';
              
              return (
                <tr key={item.year} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-2">{item.year}</td>
                  <td className="text-right px-4 py-2">{formatCurrency(item.totalSpent)}</td>
                  <td className="text-right px-4 py-2">{percentage}%</td>
                </tr>
              );
            })}
            <tr className="font-medium bg-muted/20">
              <td className="px-4 py-2">Gesamt</td>
              <td className="text-right px-4 py-2">{formatCurrency(totalBudget)}</td>
              <td className="text-right px-4 py-2">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
