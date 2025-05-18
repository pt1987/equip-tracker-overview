
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { DepartmentAssetData } from "./DepartmentAssetsReport";

interface DepartmentAssetChartsProps {
  data: DepartmentAssetData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const DepartmentAssetCharts = ({ data }: DepartmentAssetChartsProps) => {
  const pieData = React.useMemo(() => {
    return data.map(item => ({
      name: item.department,
      value: item.assetCount
    }));
  }, [data]);

  const valuePieData = React.useMemo(() => {
    return data.map(item => ({
      name: item.department,
      value: item.totalValue
    }));
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Asset-Verteilung nach Abteilung</h3>
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
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} Assets`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Asset-Wertverteilung nach Abteilung</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={valuePieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {valuePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Assets pro Mitarbeiter nach Abteilung</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === "assetsPerEmployee") return [`${value.toFixed(2)}`, "Assets pro Mitarbeiter"];
                if (name === "employeeCount") return [`${value}`, "Anzahl Mitarbeiter"];
                return [value, name];
              }} />
              <Legend />
              <Bar dataKey="assetsPerEmployee" name="Assets pro Mitarbeiter" fill="#8884d8" />
              <Bar dataKey="employeeCount" name="Anzahl Mitarbeiter" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export default DepartmentAssetCharts;
