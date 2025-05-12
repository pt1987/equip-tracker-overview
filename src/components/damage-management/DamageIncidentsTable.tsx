
import { useState } from "react";
import { 
  AlertTriangle,
  Clock,
  FileCheck, 
  Pencil, 
  Eye, 
  AlertCircle 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// Mock data - to be replaced with actual API data
const mockIncidents = [
  { 
    id: "1", 
    title: "Laptop Displayschaden", 
    assetId: "A-2023-001", 
    assetName: "MacBook Pro",
    reportedBy: "Max Mustermann",
    reportDate: new Date("2023-04-15"),
    priority: "high",
    status: "open",
    description: "Display wurde fallen gelassen und hat jetzt einen Riss",
  },
  { 
    id: "2", 
    title: "Smartphone Wasserschaden", 
    assetId: "A-2023-015", 
    assetName: "iPhone 13 Pro",
    reportedBy: "Anna Schmidt",
    reportDate: new Date("2023-04-10"),
    priority: "medium",
    status: "in_progress",
    description: "Gerät ist ins Wasser gefallen und startet nicht mehr",
  },
  { 
    id: "3", 
    title: "Tastatur defekt", 
    assetId: "A-2022-102", 
    assetName: "Logitech MX Keys",
    reportedBy: "Thomas Weber",
    reportDate: new Date("2023-04-05"),
    priority: "low",
    status: "resolved",
    description: "Mehrere Tasten funktionieren nicht mehr",
  },
  { 
    id: "4", 
    title: "Monitor Pixelfehler", 
    assetId: "A-2022-078", 
    assetName: "Dell U2720Q",
    reportedBy: "Lisa Müller",
    reportDate: new Date("2023-04-02"),
    priority: "medium",
    status: "open",
    description: "Monitor zeigt mehrere tote Pixel in der Mitte an",
  },
  { 
    id: "5", 
    title: "Laufwerk beschädigt", 
    assetId: "A-2023-042", 
    assetName: "SanDisk Extreme SSD",
    reportedBy: "Jan Becker",
    reportDate: new Date("2023-03-28"),
    priority: "high",
    status: "in_progress",
    description: "SSD zeigt Fehler bei der Datensicherung und kann nicht mehr beschrieben werden",
  }
];

interface DamageIncidentsTableProps {
  onEditIncident: (id: string) => void;
}

export function DamageIncidentsTable({ onEditIncident }: DamageIncidentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredIncidents = mockIncidents.filter((incident) => 
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.assetId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Offen</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-800">In Bearbeitung</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-800">Abgeschlossen</Badge>;
      default:
        return <Badge variant="secondary">Unbekannt</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "low":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="max-w-sm">
          <Input 
            placeholder="Nach Titel, Asset ID oder Asset suchen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Priorität</TableHead>
              <TableHead>Titel</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Gemeldet von</TableHead>
              <TableHead>Meldedatum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {getPriorityIcon(incident.priority)}
                  </div>
                </TableCell>
                <TableCell>{incident.title}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{incident.assetName}</span>
                    <span className="text-xs text-muted-foreground">{incident.assetId}</span>
                  </div>
                </TableCell>
                <TableCell>{incident.reportedBy}</TableCell>
                <TableCell>{format(incident.reportDate, "dd.MM.yyyy")}</TableCell>
                <TableCell>{getStatusBadge(incident.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <span className="sr-only">Menü öffnen</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditIncident(incident.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Bearbeiten</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileCheck className="mr-2 h-4 w-4" />
                        <span>Als abgeschlossen markieren</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
