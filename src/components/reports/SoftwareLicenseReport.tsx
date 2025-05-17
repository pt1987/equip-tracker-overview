
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const getSoftwareLicenseData = async (dateRange?: any) => {
  // Sample data - in real implementation, this would fetch from API
  return [
    { name: "Microsoft 365", licenseType: "Subscription", expiryDate: "2025-12-31", assignedCount: 45, totalLicenses: 50, costPerLicense: 120, totalCost: 6000, complianceStatus: "compliant" },
    { name: "Adobe Creative Cloud", licenseType: "Subscription", expiryDate: "2025-10-15", assignedCount: 12, totalLicenses: 15, costPerLicense: 600, totalCost: 9000, complianceStatus: "compliant" },
    { name: "Jetbrains Suite", licenseType: "Subscription", expiryDate: "2025-08-22", assignedCount: 18, totalLicenses: 15, costPerLicense: 500, totalCost: 7500, complianceStatus: "overused" },
    { name: "Slack", licenseType: "Subscription", expiryDate: "2025-11-05", assignedCount: 30, totalLicenses: 50, costPerLicense: 80, totalCost: 4000, complianceStatus: "underused" },
    { name: "Figma", licenseType: "Subscription", expiryDate: "2025-09-18", assignedCount: 8, totalLicenses: 10, costPerLicense: 180, totalCost: 1800, complianceStatus: "compliant" }
  ];
};

const ComplianceBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "compliant":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Konform</Badge>;
    case "overused":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Übernutzung</Badge>;
    case "underused":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Unternutzung</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function SoftwareLicenseReport() {
  const { dateRange } = useDateRangeFilter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['softwareLicenses', dateRange],
    queryFn: () => getSoftwareLicenseData(dateRange)
  });

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!data) return { totalCost: 0, totalLicenses: 0, assignedLicenses: 0, utilizationRate: 0 };
    
    const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
    const totalLicenses = data.reduce((sum, item) => sum + item.totalLicenses, 0);
    const assignedLicenses = data.reduce((sum, item) => sum + item.assignedCount, 0);
    const utilizationRate = totalLicenses > 0 ? (assignedLicenses / totalLicenses) * 100 : 0;
    
    return { totalCost, totalLicenses, assignedLicenses, utilizationRate };
  }, [data]);

  const complianceData = React.useMemo(() => {
    if (!data) return [];
    
    const counts = {
      compliant: 0,
      overused: 0,
      underused: 0
    };
    
    data.forEach(item => {
      counts[item.complianceStatus]++;
    });
    
    return [
      { name: "Konform", value: counts.compliant, color: "#10B981" },
      { name: "Übernutzung", value: counts.overused, color: "#EF4444" },
      { name: "Unternutzung", value: counts.underused, color: "#F59E0B" }
    ];
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Gesamtkosten</div>
            <div className="text-2xl font-bold mt-2">{formatCurrency(stats.totalCost)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Gesamtlizenzen</div>
            <div className="text-2xl font-bold mt-2">{stats.totalLicenses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Zugewiesene Lizenzen</div>
            <div className="text-2xl font-bold mt-2">{stats.assignedLicenses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">Nutzungsrate</div>
            <div className="text-2xl font-bold mt-2">{stats.utilizationRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <KeyRound className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Lizenzzuweisung</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalLicenses" name="Gesamt Lizenzen" fill="#8884d8" />
                <Bar dataKey="assignedCount" name="Zugewiesen" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <KeyRound className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Compliance Status</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">Software Lizenzen</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3">Software</th>
                  <th className="p-3">Lizenztyp</th>
                  <th className="p-3">Ablaufdatum</th>
                  <th className="p-3">Zugewiesen</th>
                  <th className="p-3">Gesamt</th>
                  <th className="p-3">Kosten pro Lizenz</th>
                  <th className="p-3">Gesamtkosten</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">{item.licenseType}</td>
                    <td className="p-3">{formatDate(item.expiryDate)}</td>
                    <td className="p-3">{item.assignedCount}</td>
                    <td className="p-3">{item.totalLicenses}</td>
                    <td className="p-3">{formatCurrency(item.costPerLicense)}</td>
                    <td className="p-3">{formatCurrency(item.totalCost)}</td>
                    <td className="p-3"><ComplianceBadge status={item.complianceStatus} /></td>
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
