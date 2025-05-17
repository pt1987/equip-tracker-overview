
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ReplacementAsset {
  assetId: string;
  assetName: string;
  category: string;
  purchaseDate: string;
  recommendedReplaceDate: string;
  ageInMonths: number;
  conditionScore: number;
  replacementPriority: 'high' | 'medium' | 'low';
  estimatedReplacementCost: number;
}

interface PriorityCount {
  name: string;
  count: number;
  value: number;
  color: string;
}

interface CategoryData {
  category: string;
  high: number;
  medium: number;
  low: number;
  total: number;
  cost: number;
}

const getReplacementPlanningData = async (dateRange?: any): Promise<ReplacementAsset[]> => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { assetId: "A1001", assetName: "MacBook Pro 2020", category: "Laptops", purchaseDate: "2020-08-15", recommendedReplaceDate: "2023-08-15", ageInMonths: 36, conditionScore: 6.5, replacementPriority: "high", estimatedReplacementCost: 2400 },
    { assetId: "A1002", assetName: "Dell XPS 13 2021", category: "Laptops", purchaseDate: "2021-02-05", recommendedReplaceDate: "2024-02-05", ageInMonths: 30, conditionScore: 7.1, replacementPriority: "medium", estimatedReplacementCost: 1800 },
    { assetId: "A1003", assetName: "Lenovo X1 2021", category: "Laptops", purchaseDate: "2021-05-20", recommendedReplaceDate: "2024-05-20", ageInMonths: 27, conditionScore: 7.8, replacementPriority: "low", estimatedReplacementCost: 1700 },
    { assetId: "A1004", assetName: "iPhone 12 Pro", category: "Smartphones", purchaseDate: "2020-11-10", recommendedReplaceDate: "2023-11-10", ageInMonths: 33, conditionScore: 5.8, replacementPriority: "high", estimatedReplacementCost: 1100 },
    { assetId: "A1005", assetName: "Samsung Galaxy S21", category: "Smartphones", purchaseDate: "2021-03-18", recommendedReplaceDate: "2024-03-18", ageInMonths: 29, conditionScore: 6.9, replacementPriority: "medium", estimatedReplacementCost: 950 },
    { assetId: "A1006", assetName: "iPad Pro 2020", category: "Tablets", purchaseDate: "2020-07-22", recommendedReplaceDate: "2023-07-22", ageInMonths: 37, conditionScore: 6.2, replacementPriority: "high", estimatedReplacementCost: 1300 },
    { assetId: "A1007", assetName: "Surface Pro 7", category: "Tablets", purchaseDate: "2021-01-15", recommendedReplaceDate: "2024-01-15", ageInMonths: 31, conditionScore: 7.0, replacementPriority: "medium", estimatedReplacementCost: 1100 }
  ];
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case "high":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Hoch</Badge>;
    case "medium":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Mittel</Badge>;
    case "low":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Niedrig</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981'
};

export default function ReplacementPlanningReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['replacementPlanning', dateRange],
    queryFn: () => getReplacementPlanningData(dateRange)
  });

  const priorityData = React.useMemo(() => {
    if (!data) return [];
    
    const counts = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    const costs = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    data.forEach(item => {
      counts[item.replacementPriority]++;
      costs[item.replacementPriority] += item.estimatedReplacementCost;
    });
    
    return [
      { name: "Hohe Priorität", count: counts.high, value: costs.high, color: COLORS.high },
      { name: "Mittlere Priorität", count: counts.medium, value: costs.medium, color: COLORS.medium },
      { name: "Niedrige Priorität", count: counts.low, value: costs.low, color: COLORS.low }
    ];
  }, [data]);

  const categoryData = React.useMemo(() => {
    if (!data) return [];
    
    const categories: Record<string, CategoryData> = {};
    
    data.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = {
          category: item.category,
          high: 0,
          medium: 0,
          low: 0,
          total: 0,
          cost: 0
        };
      }
      
      categories[item.category][item.replacementPriority]++;
      categories[item.category].total++;
      categories[item.category].cost += item.estimatedReplacementCost;
    });
    
    return Object.values(categories);
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

  const totalReplacementCost = data.reduce((sum, item) => sum + item.estimatedReplacementCost, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Gesamte Ersatzkosten</div>
            <div className="text-2xl font-bold mt-2">{formatCurrency(totalReplacementCost)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Hohe Priorität</div>
            <div className="text-2xl font-bold mt-2 flex items-center">
              {priorityData[0].count} <span className="text-red-500 ml-2">●</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Mittlere Priorität</div>
            <div className="text-2xl font-bold mt-2 flex items-center">
              {priorityData[1].count} <span className="text-amber-500 ml-2">●</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Niedrige Priorität</div>
            <div className="text-2xl font-bold mt-2 flex items-center">
              {priorityData[2].count} <span className="text-green-500 ml-2">●</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <RefreshCcw className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Ersatzkosten nach Priorität</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
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
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <RefreshCcw className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Ersatzbedarf nach Kategorie</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: number, name: string) => {
                  if (name === "high") return [value, "Hohe Priorität"];
                  if (name === "medium") return [value, "Mittlere Priorität"];
                  if (name === "low") return [value, "Niedrige Priorität"];
                  return [value, name];
                }} />
                <Legend />
                <Bar dataKey="high" name="Hohe Priorität" stackId="a" fill={COLORS.high} />
                <Bar dataKey="medium" name="Mittlere Priorität" stackId="a" fill={COLORS.medium} />
                <Bar dataKey="low" name="Niedrige Priorität" stackId="a" fill={COLORS.low} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierter Ersatzplan</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3">Kaufdatum</th>
                  <th className="p-3">Empf. Ersatz</th>
                  <th className="p-3">Alter (Monate)</th>
                  <th className="p-3">Zustand (1-10)</th>
                  <th className="p-3">Priorität</th>
                  <th className="p-3">Geschätzte Kosten</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.assetId} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.assetName}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{formatDate(item.purchaseDate)}</td>
                    <td className="p-3">{formatDate(item.recommendedReplaceDate)}</td>
                    <td className="p-3">{item.ageInMonths}</td>
                    <td className="p-3">{item.conditionScore.toFixed(1)}</td>
                    <td className="p-3"><PriorityBadge priority={item.replacementPriority} /></td>
                    <td className="p-3">{formatCurrency(item.estimatedReplacementCost)}</td>
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
