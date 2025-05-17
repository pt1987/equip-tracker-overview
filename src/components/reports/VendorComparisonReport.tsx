
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const getVendorComparisonData = async (dateRange?: any) => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { vendor: "Dell", assetCount: 82, totalSpent: 180000, reliabilityScore: 87, defectRate: 4.5, avgResponseTimeDays: 1.2, satisfactionScore: 4.2, onTimeDeliveryRate: 95 },
    { vendor: "Apple", assetCount: 65, totalSpent: 195000, reliabilityScore: 92, defectRate: 2.1, avgResponseTimeDays: 1.5, satisfactionScore: 4.5, onTimeDeliveryRate: 94 },
    { vendor: "Lenovo", assetCount: 58, totalSpent: 115000, reliabilityScore: 85, defectRate: 5.2, avgResponseTimeDays: 1.8, satisfactionScore: 3.8, onTimeDeliveryRate: 90 },
    { vendor: "HP", assetCount: 45, totalSpent: 95000, reliabilityScore: 83, defectRate: 5.8, avgResponseTimeDays: 2.1, satisfactionScore: 3.7, onTimeDeliveryRate: 88 },
    { vendor: "Microsoft", assetCount: 35, totalSpent: 105000, reliabilityScore: 86, defectRate: 4.2, avgResponseTimeDays: 1.7, satisfactionScore: 4.0, onTimeDeliveryRate: 92 },
    { vendor: "Samsung", assetCount: 42, totalSpent: 65000, reliabilityScore: 82, defectRate: 6.1, avgResponseTimeDays: 2.4, satisfactionScore: 3.6, onTimeDeliveryRate: 85 }
  ];
};

// Normalize data for radar chart (0-100 scale)
const normalizeData = (data) => {
  if (!data) return [];
  
  return data.map(vendor => {
    return {
      vendor: vendor.vendor,
      // Already on 0-100 scale
      reliability: vendor.reliabilityScore, 
      // Lower is better, so invert (0-10% scale, convert to 0-100)
      defectRate: 100 - vendor.defectRate * 10,
      // Lower is better, so invert (0-5 days scale, convert to 0-100)
      responseTime: 100 - (vendor.avgResponseTimeDays / 5) * 100,
      // 0-5 scale, convert to 0-100
      satisfaction: (vendor.satisfactionScore / 5) * 100,
      // Already on 0-100 scale
      delivery: vendor.onTimeDeliveryRate
    };
  });
};

export default function VendorComparisonReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendorComparison', dateRange],
    queryFn: () => getVendorComparisonData(dateRange)
  });

  const normalizedData = React.useMemo(() => normalizeData(data), [data]);

  // Calculate total spend and average scores
  const totals = React.useMemo(() => {
    if (!data) return { totalSpent: 0, avgReliability: 0, avgSatisfaction: 0 };
    
    const totalSpent = data.reduce((sum, item) => sum + item.totalSpent, 0);
    const avgReliability = data.reduce((sum, item) => sum + item.reliabilityScore, 0) / data.length;
    const avgSatisfaction = data.reduce((sum, item) => sum + item.satisfactionScore, 0) / data.length;
    
    return { totalSpent, avgReliability, avgSatisfaction };
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
            <div className="text-muted-foreground text-sm">Gesamtausgaben</div>
            <div className="text-2xl font-bold mt-2">{formatCurrency(totals.totalSpent)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Durchschn. Zuverlässigkeit</div>
            <div className="text-2xl font-bold mt-2">{totals.avgReliability.toFixed(1)}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Durchschn. Zufriedenheit</div>
            <div className="text-2xl font-bold mt-2">{totals.avgSatisfaction.toFixed(1)}/5</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Building className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Anbieter-Vergleichsradar</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={normalizedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="vendor" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Apple" dataKey="reliability" stroke="#FF5733" fill="#FF5733" fillOpacity={0.2} />
              <Radar name="Dell" dataKey="defectRate" stroke="#33FF57" fill="#33FF57" fillOpacity={0.2} />
              <Radar name="Lenovo" dataKey="responseTime" stroke="#3357FF" fill="#3357FF" fillOpacity={0.2} />
              <Radar name="HP" dataKey="satisfaction" stroke="#F3FF33" fill="#F3FF33" fillOpacity={0.2} />
              <Radar name="Microsoft" dataKey="delivery" stroke="#FF33F3" fill="#FF33F3" fillOpacity={0.2} />
              <Legend />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === "defectRate") return [`${(100 - value) / 10}%`, "Defektrate"];
                  if (name === "responseTime") return [`${(5 * (100 - value) / 100).toFixed(1)} Tage`, "Reaktionszeit"];
                  if (name === "satisfaction") return [`${(value / 100 * 5).toFixed(1)}/5`, "Zufriedenheit"];
                  if (name === "delivery") return [`${value}%`, "Pünktliche Lieferung"];
                  if (name === "reliability") return [`${value}/100`, "Zuverlässigkeit"];
                  return [value, name];
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Ausgaben nach Anbieter</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendor" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="totalSpent" name="Ausgaben" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Defektrate nach Anbieter</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vendor" />
                <YAxis domain={[0, 'dataMax + 1']} />
                <Tooltip formatter={(value) => [`${value}%`, "Defektrate"]} />
                <Legend />
                <Bar dataKey="defectRate" name="Defektrate (%)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierter Anbietervergleich</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Anbieter</th>
                  <th className="p-3">Assets</th>
                  <th className="p-3">Gesamtausgaben</th>
                  <th className="p-3">Zuverlässigkeit</th>
                  <th className="p-3">Defektrate</th>
                  <th className="p-3">Reaktionszeit</th>
                  <th className="p-3">Zufriedenheit</th>
                  <th className="p-3">Pünktl. Lieferung</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.vendor}</td>
                    <td className="p-3">{item.assetCount}</td>
                    <td className="p-3">{formatCurrency(item.totalSpent)}</td>
                    <td className="p-3">{item.reliabilityScore}/100</td>
                    <td className="p-3">{item.defectRate}%</td>
                    <td className="p-3">{item.avgResponseTimeDays} Tage</td>
                    <td className="p-3">{item.satisfactionScore}/5</td>
                    <td className="p-3">{item.onTimeDeliveryRate}%</td>
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
