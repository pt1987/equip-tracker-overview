import React from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { KeyRound } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface SoftwareLicense {
  id: string;
  name: string;
  license_type: string;
  expiry_date: string | null;
  total_licenses: number;
  assigned_count: number;
  cost_per_license: number;
  status: string;
  created_at?: string;
}

const getSoftwareLicenseData = async (dateRange?: any) => {
  console.log("Fetching software license data with date range:", dateRange);
  
  // Query to get software licenses data from Supabase - using the same table as LicenseManagementTable
  let query = supabase
    .from('software_licenses')
    .select('*')
    .order('name');
    
  // Apply date filter if provided (filtering by expiry date)
  if (dateRange?.from && dateRange?.to) {
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    
    query = query
      .gte('expiry_date', fromDate.toISOString())
      .lte('expiry_date', toDate.toISOString());
  }
  
  const { data: licenses, error } = await query;
  
  if (error) {
    console.error("Error fetching software license data:", error);
    throw new Error("Failed to fetch software license data");
  }

  console.log("Fetched licenses data:", licenses); // Debug log

  // Check if we got data
  if (!licenses || licenses.length === 0) {
    console.log("No license data returned from database");
    return [];
  }

  // Calculate derived properties
  return licenses.map((license: SoftwareLicense) => {
    const totalCost = license.cost_per_license * license.total_licenses;
    
    // Determine compliance status if not already set
    let complianceStatus = license.status;
    if (!complianceStatus) {
      if (license.assigned_count > license.total_licenses) {
        complianceStatus = "overused";
      } else if (license.assigned_count < license.total_licenses * 0.8) {
        complianceStatus = "underused";
      } else {
        complianceStatus = "compliant";
      }
    }
    
    return {
      ...license,
      totalCost,
      complianceStatus
    };
  });
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
    queryFn: () => getSoftwareLicenseData(dateRange),
    // Add refetchOnWindowFocus to ensure data syncs when coming back to this page
    refetchOnWindowFocus: true,
    // Add staleTime to prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!data || data.length === 0) return { totalCost: 0, totalLicenses: 0, assignedLicenses: 0, utilizationRate: 0 };
    
    const totalCost = data.reduce((sum, item) => sum + item.totalCost, 0);
    const totalLicenses = data.reduce((sum, item) => sum + item.total_licenses, 0);
    const assignedLicenses = data.reduce((sum, item) => sum + item.assigned_count, 0);
    const utilizationRate = totalLicenses > 0 ? (assignedLicenses / totalLicenses) * 100 : 0;
    
    return { totalCost, totalLicenses, assignedLicenses, utilizationRate };
  }, [data]);

  const complianceData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
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
    return <div className="text-center py-12 text-red-600 font-medium">Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">
      <p>Keine Software-Lizenzdaten verfügbar</p>
      <p className="mt-2 text-sm">Fügen Sie neue Lizenzen über die Lizenzmanagement-Seite hinzu.</p>
    </div>;
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
                <Bar dataKey="total_licenses" name="Gesamt Lizenzen" fill="#8884d8" />
                <Bar dataKey="assigned_count" name="Zugewiesen" fill="#82ca9d" />
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
            {complianceData.some(item => item.value > 0) ? (
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
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Keine Compliance-Daten verfügbar</p>
              </div>
            )}
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
                    <td className="p-3">{item.license_type}</td>
                    <td className="p-3">{item.expiry_date ? formatDate(item.expiry_date) : '-'}</td>
                    <td className="p-3">{item.assigned_count}</td>
                    <td className="p-3">{item.total_licenses}</td>
                    <td className="p-3">{formatCurrency(item.cost_per_license)}</td>
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
