
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

// Define types for our data
interface AssetUtilizationItem {
  assetId: string;
  assetName: string;
  category: string;
  utilizationRatio: number;
  totalBookings: number;
  totalBookingDays: number;
  idleDays: number;
  availabilityRate: number;
}

interface CategoryAverage {
  category: string;
  avgUtilization: number;
  avgAvailability: number;
  avgBookings: number;
  assetCount: number;
}

const getAssetUtilizationData = async (dateRange?: any): Promise<AssetUtilizationItem[]> => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { assetId: "P1001", assetName: "MacBook Pro 16", category: "Laptops", utilizationRatio: 84, totalBookings: 12, totalBookingDays: 45, idleDays: 5, availabilityRate: 92 },
    { assetId: "P1002", assetName: "Dell XPS 15", category: "Laptops", utilizationRatio: 78, totalBookings: 9, totalBookingDays: 38, idleDays: 12, availabilityRate: 88 },
    { assetId: "P1003", assetName: "iPad Pro 12.9", category: "Tablets", utilizationRatio: 62, totalBookings: 8, totalBookingDays: 25, idleDays: 15, availabilityRate: 95 },
    { assetId: "P1004", assetName: "Surface Pro 9", category: "Tablets", utilizationRatio: 58, totalBookings: 7, totalBookingDays: 22, idleDays: 18, availabilityRate: 90 },
    { assetId: "P1005", assetName: "iPhone 15 Pro", category: "Smartphones", utilizationRatio: 45, totalBookings: 5, totalBookingDays: 15, idleDays: 25, availabilityRate: 96 },
    { assetId: "P1006", assetName: "Samsung S24 Ultra", category: "Smartphones", utilizationRatio: 42, totalBookings: 6, totalBookingDays: 14, idleDays: 26, availabilityRate: 94 },
    { assetId: "P1007", assetName: "4K Projektor", category: "Conference", utilizationRatio: 35, totalBookings: 10, totalBookingDays: 10, idleDays: 30, availabilityRate: 98 }
  ];
};

const getCategoryAverages = (data: AssetUtilizationItem[] | undefined): CategoryAverage[] => {
  if (!data || !data.length) return [];
  
  const categories: Record<string, {
    category: string;
    count: number;
    totalUtilization: number;
    totalAvailability: number;
    totalBookings: number;
  }> = {};
  
  data.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = {
        category: item.category,
        count: 0,
        totalUtilization: 0,
        totalAvailability: 0,
        totalBookings: 0
      };
    }
    
    categories[item.category].count++;
    categories[item.category].totalUtilization += item.utilizationRatio;
    categories[item.category].totalAvailability += item.availabilityRate;
    categories[item.category].totalBookings += item.totalBookings;
  });
  
  return Object.values(categories).map(cat => ({
    category: cat.category,
    avgUtilization: cat.totalUtilization / cat.count,
    avgAvailability: cat.totalAvailability / cat.count,
    avgBookings: cat.totalBookings / cat.count,
    assetCount: cat.count
  }));
};

export default function AssetUtilizationReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assetUtilization', dateRange],
    queryFn: () => getAssetUtilizationData(dateRange)
  });

  const categoryData = React.useMemo(() => {
    return getCategoryAverages(data);
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

  const overallUtilization = data.reduce((sum, item) => sum + item.utilizationRatio, 0) / data.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Gesamtnutzungsrate</div>
            <div className="text-2xl font-bold mt-2">{overallUtilization.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Pool-Geräte</div>
            <div className="text-2xl font-bold mt-2">{data.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Gesamtzahl Buchungen</div>
            <div className="text-2xl font-bold mt-2">{data.reduce((sum, item) => sum + item.totalBookings, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Kategorien</div>
            <div className="text-2xl font-bold mt-2">{categoryData.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Nutzungsrate nach Gerät</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="assetName" type="category" width={150} />
              <Tooltip formatter={(value: number) => [`${value}%`, 'Nutzungsrate']} />
              <Legend />
              <Bar dataKey="utilizationRatio" name="Nutzungsrate" fill="#8884d8" />
              <Bar dataKey="availabilityRate" name="Verfügbarkeit" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Durchschnittliche Nutzung nach Kategorie</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === "avgUtilization" || name === "avgAvailability") return [`${value.toFixed(1)}%`, name === "avgUtilization" ? "Nutzungsrate" : "Verfügbarkeit"];
                if (name === "avgBookings") return [`${value.toFixed(1)}`, "Durchschn. Buchungen"];
                if (name === "assetCount") return [`${value}`, "Anzahl Geräte"];
                return [value, name];
              }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="avgUtilization" name="Nutzungsrate" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line yAxisId="left" type="monotone" dataKey="avgAvailability" name="Verfügbarkeit" stroke="#82ca9d" />
              <Line yAxisId="right" type="monotone" dataKey="avgBookings" name="Durchschn. Buchungen" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierte Gerätenutzung</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3">Nutzungsrate</th>
                  <th className="p-3">Buchungen</th>
                  <th className="p-3">Buchungstage</th>
                  <th className="p-3">Leerlauftage</th>
                  <th className="p-3">Verfügbarkeitsrate</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.assetId} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.assetName}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.utilizationRatio}%</td>
                    <td className="p-3">{item.totalBookings}</td>
                    <td className="p-3">{item.totalBookingDays}</td>
                    <td className="p-3">{item.idleDays}</td>
                    <td className="p-3">{item.availabilityRate}%</td>
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
