import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
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
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import StatusBadge from "@/components/assets/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileText, Check } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: assetData = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });

  const { data: employeeData = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  // Sort assets by purchase date, newest first
  const sortedAssets = [...assetData].sort((a, b) => 
    new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  const filteredAssets = sortedAssets.filter(asset => 
    asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getEmployeeName(asset.employeeId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getEmployeeName(employeeId: string | null): string {
    if (!employeeId) return "Nicht zugewiesen";
    const employee = employeeData.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unbekannt";
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Prepare data for export
  const prepareExportData = () => {
    return filteredAssets.map(asset => ({
      purchaseDate: formatDate(asset.purchaseDate),
      asset: `${asset.manufacturer} ${asset.model}`,
      category: asset.category,
      price: formatCurrency(asset.price),
      status: asset.status,
      assignedTo: getEmployeeName(asset.employeeId)
    }));
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ["Kaufdatum", "Asset", "Kategorie", "Preis", "Status", "Zugewiesen an"];
    const csvContent = filteredAssets.map(asset => [
      formatDate(asset.purchaseDate),
      `${asset.manufacturer} ${asset.model}`,
      asset.category,
      asset.price.toString(),
      asset.status,
      getEmployeeName(asset.employeeId)
    ]);
    
    const csvString = [
      headers.join(','),
      ...csvContent.map(row => row.join(','))
    ].join('\n');
    
    downloadFile(csvString, 'asset-history.csv', 'text/csv');
    toast({
      title: "Export erfolgreich",
      description: "Die Daten wurden als CSV exportiert.",
    });
  };

  const exportToXLSX = () => {
    const exportData = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Asset History");
    
    // Generate and save the file
    XLSX.writeFile(workbook, "asset-history.xlsx");
    
    toast({
      title: "Export erfolgreich",
      description: "Die Daten wurden als Excel-Datei exportiert.",
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const exportData = prepareExportData();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Asset History", 14, 22);
    doc.setFontSize(11);
    doc.text(`Exported on ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Create table
    autoTable(doc, {
      head: [['Kaufdatum', 'Asset', 'Kategorie', 'Preis', 'Status', 'Zugewiesen an']],
      body: exportData.map(item => [
        item.purchaseDate,
        item.asset,
        item.category,
        item.price,
        item.status,
        item.assignedTo
      ]),
      startY: 35,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    // Save the PDF
    doc.save('asset-history.pdf');
    
    toast({
      title: "Export erfolgreich",
      description: "Die Daten wurden als PDF exportiert.",
    });
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Asset Historie</h1>
              <p className="text-muted-foreground">
                Chronologische Übersicht aller Assets nach Kaufdatum
              </p>
            </div>
            <div className="flex gap-2">
              <SearchFilter 
                onSearch={handleSearch} 
                placeholder="Assets durchsuchen..." 
                className="w-full md:w-auto"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download size={16} />
                    <span>Exportieren</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer gap-2">
                    <FileText size={16} />
                    <span>Als CSV exportieren</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToXLSX} className="cursor-pointer gap-2">
                    <FileSpreadsheet size={16} />
                    <span>Als Excel exportieren</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer gap-2">
                    <Check size={16} />
                    <span>Als PDF exportieren</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                      <TableCell>{getEmployeeName(asset.employeeId)}</TableCell>
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
      </div>
    </PageTransition>
  );
}
