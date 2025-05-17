
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getCarbonFootprintData = async (dateRange?: any) => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { category: "Laptops", assetCount: 85, estimatedEnergyUse: 4250, estimatedCO2: 1700, sustainabilityScore: 72, recommendations: ["Energiesparmodus aktivieren", "Eco-zertifizierte Modelle wählen"] },
    { category: "Desktop PCs", assetCount: 35, estimatedEnergyUse: 7000, estimatedCO2: 2800, sustainabilityScore: 45, recommendations: ["Nach Arbeitsende herunterfahren", "Auf energieeffiziente Modelle umstellen"] },
    { category: "Smartphones", assetCount: 95, estimatedEnergyUse: 950, estimatedCO2: 380, sustainabilityScore: 78, recommendations: ["Längere Austauschzyklen", "Recycling-Programme"] },
    { category: "Tablets", assetCount: 42, estimatedEnergyUse: 840, estimatedCO2: 336, sustainabilityScore: 75, recommendations: ["Längere Austauschzyklen"] },
    { category: "Monitore", assetCount: 110, estimatedEnergyUse: 5500, estimatedCO2: 2200, sustainabilityScore: 62, recommendations: ["Auto-Standby einrichten", "Helligkeit reduzieren"] },
    { category: "Server", assetCount: 12, estimatedEnergyUse: 18000, estimatedCO2: 7200, sustainabilityScore: 58, recommendations: ["Virtualisierung erhöhen", "Kühlung optimieren"] },
    { category: "Netzwerkgeräte", assetCount: 25, estimatedEnergyUse: 3750, estimatedCO2: 1500, sustainabilityScore: 65, recommendations: ["Energieeffiziente Switches"] }
  ];
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "#10B981"; // Green
  if (score >= 60) return "#F59E0B"; // Amber
  return "#EF4444"; // Red
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#f39c12'];

export default function CarbonFootprintReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['carbonFootprint', dateRange],
    queryFn: () => getCarbonFootprintData(dateRange)
  });

  const totalStats = React.useMemo(() => {
    if (!data) return { totalCO2: 0, totalEnergy: 0, avgSustainability: 0 };
    
    const totalCO2 = data.reduce((sum, item) => sum + item.estimatedCO2, 0);
    const totalEnergy = data.reduce((sum, item) => sum + item.estimatedEnergyUse, 0);
    const avgSustainability = data.reduce((sum, item) => sum + item.sustainabilityScore, 0) / data.length;
    
    return { totalCO2, totalEnergy, avgSustainability };
  }, [data]);

  const pieData = React.useMemo(() => {
    if (!data) return [];
    return data.map(item => ({
      name: item.category,
      value: item.estimatedCO2
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
            <div className="text-muted-foreground text-sm">Geschätzter CO2-Ausstoß</div>
            <div className="text-2xl font-bold mt-2">{totalStats.totalCO2.toLocaleString()} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Energieverbrauch</div>
            <div className="text-2xl font-bold mt-2">{totalStats.totalEnergy.toLocaleString()} kWh</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Durchschn. Nachhaltigkeitswert</div>
            <div className="text-2xl font-bold mt-2 flex items-center">
              {totalStats.avgSustainability.toFixed(0)}/100
              <span className={`ml-2 h-3 w-3 rounded-full bg-${
                totalStats.avgSustainability >= 80 ? "green" : 
                totalStats.avgSustainability >= 60 ? "amber" : "red"
              }-500`}></span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">CO2-Verteilung nach Kategorie</h3>
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
                <Tooltip formatter={(value) => [`${value} kg`, "CO2"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <Leaf className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Nachhaltigkeitsbewertung</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Nachhaltigkeitswert" dataKey="sustainabilityScore" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip formatter={(value) => [`${value}/100`, "Nachhaltigkeitswert"]} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Leaf className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Energieverbrauch und CO2-Bilanz nach Kategorie</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip formatter={(value, name) => {
                if (name === "estimatedEnergyUse") return [`${value.toLocaleString()} kWh`, "Energieverbrauch"];
                if (name === "estimatedCO2") return [`${value.toLocaleString()} kg`, "CO2-Ausstoß"];
                return [value, name];
              }} />
              <Legend />
              <Bar yAxisId="left" dataKey="estimatedEnergyUse" name="Energieverbrauch (kWh)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="estimatedCO2" name="CO2-Ausstoß (kg)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Detaillierte Nachhaltigkeitsanalyse</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Kategorie</th>
                  <th className="p-3">Geräteanzahl</th>
                  <th className="p-3">Energieverbrauch (kWh)</th>
                  <th className="p-3">CO2-Ausstoß (kg)</th>
                  <th className="p-3">Nachhaltigkeitswert</th>
                  <th className="p-3">Empfehlungen</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.category}</td>
                    <td className="p-3">{item.assetCount}</td>
                    <td className="p-3">{item.estimatedEnergyUse.toLocaleString()}</td>
                    <td className="p-3">{item.estimatedCO2.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        {item.sustainabilityScore}
                        <span className="ml-2 h-2 w-2 rounded-full" style={{ backgroundColor: getScoreColor(item.sustainabilityScore) }}></span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {item.recommendations.map((rec, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-blue-50 text-blue-800 border-blue-200">
                            {rec}
                          </Badge>
                        ))}
                      </div>
                    </td>
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
