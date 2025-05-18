
import React from "react";
import { useROIIData } from "./roii/useROIIData";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ROIIReport() {
  const { dateRange } = useDateRangeFilter();
  const { data, isLoading, isError } = useROIIData(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[300px] w-full rounded-md" />
        <Skeleton className="h-[200px] w-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-muted-foreground">Fehler beim Laden der Daten</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">Keine ROI-Daten verfügbar für den gewählten Zeitraum</div>;
  }

  // Calculate totals
  const totalInvestment = data.reduce((sum, item) => sum + item.investment, 0);
  const totalReturn = data.reduce((sum, item) => sum + item.return, 0);
  const overallROI = ((totalReturn / totalInvestment) - 1) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-muted-foreground text-sm">Gesamtinvestition</div>
              <div className="text-2xl font-bold mt-2">{formatCurrency(totalInvestment)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-muted-foreground text-sm">Gesamtertrag</div>
              <div className="text-2xl font-bold mt-2">{formatCurrency(totalReturn)}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-muted-foreground text-sm">Gesamtrendite</div>
              <div className="text-2xl font-bold mt-2 flex items-center">
                <TrendingUp className={`mr-1 h-5 w-5 ${overallROI >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={overallROI >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {overallROI.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Investitionen und Erträge nach Kategorie</h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis 
                    tickFormatter={(value) => 
                      value >= 1000 
                        ? `${(value / 1000).toFixed(0)}k` 
                        : value.toString()
                    }
                  />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'investment') return [formatCurrency(Number(value)), 'Investition'];
                    if (name === 'return') return [formatCurrency(Number(value)), 'Ertrag'];
                    return [value, name];
                  }} />
                  <Legend />
                  <Bar dataKey="investment" name="Investition" fill="#8884d8" />
                  <Bar dataKey="return" name="Ertrag" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">ROI nach Kategorie</h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="roi"
                    nameKey="category"
                    label={({ category, roi }) => `${category}: ${Number(roi).toFixed(1)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, 'ROI']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierte ROI-Übersicht</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Kategorie</th>
                  <th className="p-3 text-right">Investition</th>
                  <th className="p-3 text-right">Ertrag</th>
                  <th className="p-3 text-right">ROI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3 text-right">{formatCurrency(item.investment)}</td>
                    <td className="p-3 text-right">{formatCurrency(item.return)}</td>
                    <td className={`p-3 text-right font-medium ${item.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.roi.toFixed(2)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-medium">
                  <td className="p-3">Gesamt</td>
                  <td className="p-3 text-right">{formatCurrency(totalInvestment)}</td>
                  <td className="p-3 text-right">{formatCurrency(totalReturn)}</td>
                  <td className={`p-3 text-right ${overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {overallROI.toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
