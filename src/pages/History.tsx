
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatCurrency } from "@/lib/utils";
import SearchFilter from "@/components/shared/SearchFilter";
import { useState } from "react";
import { mockAssets, mockEmployees } from "@/data/mockData";
import { StatusBadge } from "@/components/assets/StatusBadge";

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: () => mockAssets,
    initialData: mockAssets,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: () => mockEmployees,
    initialData: mockEmployees,
  });

  // Sort assets by purchase date, newest first
  const sortedAssets = [...assets].sort((a, b) => 
    new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  const filteredAssets = sortedAssets.filter(asset => 
    asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getEmployeeName(asset.assignedTo).toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getEmployeeName(employeeId: string | null): string {
    if (!employeeId) return "Nicht zugewiesen";
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unbekannt";
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <PageTransition>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Asset Historie</h1>
                <p className="text-muted-foreground">
                  Chronologische Übersicht aller Assets nach Kaufdatum
                </p>
              </div>
              <SearchFilter 
                onSearch={handleSearch} 
                placeholder="Assets durchsuchen..." 
                className="w-full md:w-auto"
              />
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Anschaffungshistorie</CardTitle>
                <CardDescription>
                  Alle Assets, sortiert nach Kaufdatum (neueste zuerst)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kaufdatum</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Kategorie</TableHead>
                      <TableHead>Preis</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Zugewiesen an</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{formatDate(asset.purchaseDate)}</TableCell>
                        <TableCell>{asset.manufacturer} {asset.model}</TableCell>
                        <TableCell>{asset.category}</TableCell>
                        <TableCell>{formatCurrency(asset.price)}</TableCell>
                        <TableCell><StatusBadge status={asset.status} /></TableCell>
                        <TableCell>{getEmployeeName(asset.assignedTo)}</TableCell>
                      </TableRow>
                    ))}
                    {filteredAssets.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Keine Assets gefunden
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
