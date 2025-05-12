
import { useState } from "react";
import { FileText, Download, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockReports = [
  {
    id: "rep-001",
    title: "Monatlicher ISO 27001 Schadensbericht - April 2023",
    createdBy: "System",
    createdAt: "2023-05-01",
    type: "monthly",
    format: "pdf",
    size: "1.2MB"
  },
  {
    id: "rep-002",
    title: "Quartalsreport Q1 2023 - Schadensmanagement",
    createdBy: "System",
    createdAt: "2023-04-05",
    type: "quarterly",
    format: "xlsx",
    size: "3.4MB"
  },
  {
    id: "rep-003",
    title: "Schadensfall Detail-Dokumentation: Laptop Displayschaden",
    createdBy: "Max Mustermann",
    createdAt: "2023-04-16",
    type: "incident",
    format: "pdf",
    size: "0.8MB"
  },
  {
    id: "rep-004",
    title: "Prüfbericht ISO 27001 Compliance - Schadensmanagement",
    createdBy: "Anna Schmidt",
    createdAt: "2023-03-22",
    type: "audit",
    format: "pdf",
    size: "2.1MB"
  },
  {
    id: "rep-005",
    title: "Sicherheitsvorfall - Smartphone Wasserschaden",
    createdBy: "Thomas Weber",
    createdAt: "2023-04-11",
    type: "incident",
    format: "pdf",
    size: "0.6MB"
  }
];

export function DamageReportView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // Filter reports based on search term and type filter
  const filteredReports = mockReports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "" || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (reportId: string) => {
    // In a real app, this would trigger the download of the report
    console.log(`Downloading report: ${reportId}`);
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case "pdf":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-800">PDF</Badge>;
      case "xlsx":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-800">XLSX</Badge>;
      default:
        return <Badge>{format.toUpperCase()}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="max-w-sm w-full">
          <Input 
            placeholder="Berichte durchsuchen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alle Berichtstypen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Alle Berichtstypen</SelectItem>
              <SelectItem value="monthly">Monatliche Berichte</SelectItem>
              <SelectItem value="quarterly">Quartalsberichte</SelectItem>
              <SelectItem value="incident">Vorfallsberichte</SelectItem>
              <SelectItem value="audit">Prüfberichte</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-2 rounded-md">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Erstellt am {report.createdAt} von {report.createdBy}
                      </span>
                      <div className="flex gap-2">
                        {getFormatBadge(report.format)}
                        <span className="text-xs text-muted-foreground">{report.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="whitespace-nowrap"
                  onClick={() => handleDownload(report.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReports.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Keine Berichte gefunden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
