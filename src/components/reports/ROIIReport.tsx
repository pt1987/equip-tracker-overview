
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ROIIData {
  category: string;
  initialInvestment: number;
  operationalCost: number;
  businessValue: number;
  roi: number;
  paybackPeriodMonths: number;
}

interface PieDataItem {
  name: string;
  value: number;
}

interface TotalStats {
  totalInvestment: number;
  totalValue: number;
  overallROI: number;
}

const getROIIData = async (dateRange?: any): Promise<ROIIData[]> => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { category: "Laptops", initialInvestment: 125000, operationalCost: 25000, businessValue: 180000, roi: 36.0, paybackPeriodMonths: 22 },
    { category: "Smartphones", initialInvestment: 75000, operationalCost: 15000, businessValue: 105000, roi: 17.0, paybackPeriodMonths: 26 },
    { category: "Tablets", initialInvestment: 45000, operationalCost: 10000, businessValue: 68000, roi: 23.6, paybackPeriodMonths: 24 },
    { category: "Workstations", initialInvestment: 180000, operationalCost: 50000, businessValue: 310000, roi: 35.0, paybackPeriodMonths: 20 },
    { category: "Server", initialInvestment: 250000, operationalCost: 120000, businessValue: 580000, roi: 57.0, paybackPeriodMonths: 16 },
    { category: "Netzwerkhardware", initialInvestment: 95000, operationalCost: 40000, businessValue: 175000, roi: 30.0, paybackPeriodMonths: 21 }
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ROIIReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['roii', dateRange],
    queryFn: () => getROIIData(dateRange)
  });

  const totalStats = React.useMemo(() => {
    if (!data) return { totalInvestment: 0, totalValue: 0, overallROI: 0 };
    
    const totalInvestment = data.reduce((sum, item) => sum + item.initialInvestment + item.operationalCost, 0);
    const totalValue = data.reduce((sum, item) => sum + item.businessValue, 0);
    const overallROI = ((totalValue - totalInvestment) / totalInvestment) * 100;
    
    return { totalInvestment, totalValue, overallROI };
  }, [data]);

  const pieData = React.useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      name: item.category,
      value: item.businessValue
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-muted-foreground">Fehler beim Laden der Daten</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Gesamtinvestition</div>
            <div className="text-2xl font-bold mt-2">{formatCurrency(totalStats.totalInvestment)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Geschäftswert</div>
            <div className="text-2xl font-bold mt-2">{formatCurrency(totalStats.totalValue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Gesamte ROI</div>
            <div className="text-2xl font-bold mt-2">{totalStats.overallROI.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">ROI nach Kategorie</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 'dataMax + 10']} />
                <Tooltip formatter={(value: number, name: string) => {
                  if (name === "roi") return [`${value}%`, "ROI"];
                  return [value, name];
                }} />
                <Legend />
                <Bar dataKey="roi" name="ROI (%)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Geschäftswertverteilung</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Amortisationszeit nach Kategorie</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 'dataMax + 5']} />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === "paybackPeriodMonths") return [`${value} Monate`, "Amortisationszeit"];
                return [value, name];
              }} />
              <Legend />
              <Line type="monotone" dataKey="paybackPeriodMonths" name="Amortisationszeit (Monate)" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierte ROI-Analyse</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3">Anfangsinvestition</th>
                  <th className="p-3">Betriebskosten</th>
                  <th className="p-3">Gesamtkosten</th>
                  <th className="p-3">Geschäftswert</th>
                  <th className="p-3">ROI</th>
                  <th className="p-3">Amortisationszeit</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3">{formatCurrency(item.initialInvestment)}</td>
                    <td className="p-3">{formatCurrency(item.operationalCost)}</td>
                    <td className="p-3">{formatCurrency(item.initialInvestment + item.operationalCost)}</td>
                    <td className="p-3">{formatCurrency(item.businessValue)}</td>
                    <td className="p-3">{item.roi.toFixed(1)}%</td>
                    <td className="p-3">{item.paybackPeriodMonths} Monate</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
