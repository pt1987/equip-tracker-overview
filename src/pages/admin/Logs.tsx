
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { FileDown, Search, Filter, Calendar, ArrowUpDown, RefreshCcw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

// Interface for log entries
interface LogEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// Interface for log stats
interface LogStats {
  totalLogs: number;
  loginAttempts: number;
  failedLogins: number;
  userChanges: number;
  roleChanges: number;
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [resourceFilter, setResourceFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState({
    user: true,
    action: true,
    resource: true,
    details: true,
    ipAddress: true,
    timestamp: true
  });
  const [stats, setStats] = useState<LogStats>({
    totalLogs: 0,
    loginAttempts: 0,
    failedLogins: 0,
    userChanges: 0,
    roleChanges: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // In einer echten Anwendung würden hier die Logs von einer API oder Datenbank geladen
    // Für jetzt lassen wir die Tabelle leer, da keine Mockup-Daten verwendet werden sollen
    setLogs([]);
    setStats({
      totalLogs: 0,
      loginAttempts: 0,
      failedLogins: 0,
      userChanges: 0,
      roleChanges: 0
    });
  }, []);

  // Function to handle log filtering
  const filteredLogs = logs
    .filter(log => {
      // Text search
      const matchesSearch = searchQuery === "" || 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Action filter
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      
      // Resource filter
      const matchesResource = resourceFilter === "all" || log.resource === resourceFilter;
      
      // Date filter
      const matchesDate = !selectedDate || format(new Date(log.timestamp), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
      
      return matchesSearch && matchesAction && matchesResource && matchesDate;
    })
    .sort((a, b) => {
      // Sort by timestamp
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Function to handle export
  const handleExport = (format: string) => {
    toast({
      title: "Export gestartet",
      description: `Die Logs werden als ${format.toUpperCase()} exportiert.`,
    });
    
    // In a real application, this would trigger an actual export
    console.log(`Exporting logs as ${format}...`);
  };

  // Function to get action badge style
  const getActionBadge = (action: string) => {
    switch (action) {
      case "login":
        return <Badge className="bg-green-500">Login</Badge>;
      case "logout":
        return <Badge className="bg-blue-500">Logout</Badge>;
      case "create":
        return <Badge className="bg-purple-500">Erstellen</Badge>;
      case "update":
        return <Badge className="bg-yellow-500">Aktualisieren</Badge>;
      case "delete":
        return <Badge className="bg-red-500">Löschen</Badge>;
      case "backup":
        return <Badge className="bg-teal-500">Backup</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit-Logs</h1>
            <p className="text-muted-foreground">
              Überwachen Sie alle Aktivitäten im System
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportieren
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem onClick={() => handleExport("csv")}>
                  CSV-Datei
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleExport("json")}>
                  JSON-Datei
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleExport("pdf")}>
                  PDF-Dokument
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={() => toast({
              title: "Aktualisiert",
              description: "Die Logs wurden aktualisiert.",
            })}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Aktualisieren
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt-Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLogs}</div>
              <p className="text-xs text-muted-foreground">Im System erfasst</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Login-Versuche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.loginAttempts}</div>
              <p className="text-xs text-muted-foreground">
                Davon {stats.failedLogins} fehlgeschlagen
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Benutzeränderungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.userChanges}</div>
              <p className="text-xs text-muted-foreground">
                Erstellungen, Aktualisierungen, Löschungen
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rollenänderungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.roleChanges}</div>
              <p className="text-xs text-muted-foreground">
                Änderungen an Rollen und Berechtigungen
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche in Logs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Aktion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Aktionen</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="create">Erstellen</SelectItem>
                  <SelectItem value="update">Aktualisieren</SelectItem>
                  <SelectItem value="delete">Löschen</SelectItem>
                </SelectContent>
              </Select>
              <Select value={resourceFilter} onValueChange={setResourceFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Ressource" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Ressourcen</SelectItem>
                  <SelectItem value="auth">Auth</SelectItem>
                  <SelectItem value="user">Benutzer</SelectItem>
                  <SelectItem value="role">Rolle</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[130px] justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "Datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.user}
                    onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, user: checked})}
                  >
                    Benutzer
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.action}
                    onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, action: checked})}
                  >
                    Aktion
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.resource}
                    onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, resource: checked})}
                  >
                    Ressource
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.details}
                    onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, details: checked})}
                  >
                    Details
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.ipAddress}
                    onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, ipAddress: checked})}
                  >
                    IP-Adresse
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.timestamp}
                    onCheckedChange={(checked) => setVisibleColumns({...visibleColumns, timestamp: checked})}
                  >
                    Zeitstempel
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.user && <TableHead>Benutzer</TableHead>}
                  {visibleColumns.action && <TableHead>Aktion</TableHead>}
                  {visibleColumns.resource && <TableHead>Ressource</TableHead>}
                  {visibleColumns.details && <TableHead>Details</TableHead>}
                  {visibleColumns.ipAddress && <TableHead>IP-Adresse</TableHead>}
                  {visibleColumns.timestamp && <TableHead>Zeitstempel</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      {visibleColumns.user && <TableCell className="font-medium">{log.user}</TableCell>}
                      {visibleColumns.action && <TableCell>{getActionBadge(log.action)}</TableCell>}
                      {visibleColumns.resource && <TableCell>{log.resource}</TableCell>}
                      {visibleColumns.details && <TableCell>{log.details}</TableCell>}
                      {visibleColumns.ipAddress && <TableCell>{log.ipAddress}</TableCell>}
                      {visibleColumns.timestamp && (
                        <TableCell>
                          {format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss")}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell 
                      colSpan={Object.values(visibleColumns).filter(Boolean).length} 
                      className="h-24 text-center"
                    >
                      Keine Logs gefunden. Die Audit-Log-Funktion ist in Entwicklung.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
