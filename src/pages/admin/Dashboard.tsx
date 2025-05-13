
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, UserPlus, Users, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getEmployees } from "@/data/employees";
import { Employee } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface AdminStats {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  securityAlerts: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    securityAlerts: 0
  });
  const [greeting, setGreeting] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Guten Morgen");
    else if (hour < 18) setGreeting("Guten Tag");
    else setGreeting("Guten Abend");
    
    setStats({
      totalUsers: 1,
      newUsers: 0,
      activeUsers: 1,
      securityAlerts: 0
    });

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  // Berechne die Prozentsätze für die Admin-Statistiken
  const newUserPercentage = stats.totalUsers > 0 ? Math.round((stats.newUsers / stats.totalUsers) * 100) : 0;
  const activeUserPercentage = stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;
  const securityAlertPercentage = stats.securityAlerts > 0 ? Math.round((stats.securityAlerts / 10) * 100) : 0; // Basierend auf einer Maximalzahl von 10

  return (
    <PageTransition>
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}, {user?.name || "Admin"}</h1>
          <p className="text-muted-foreground">
            Hier finden Sie eine Übersicht über Ihre Benutzer und Aktivitäten
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Benutzer gesamt</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg text-blue-500">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Registrierte Benutzer</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Neue Benutzer</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg text-green-500">
                  <UserPlus className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Im letzten Monat</p>
                
                {stats.totalUsers > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Zuwachs</span>
                      <span className="text-green-500">+{newUserPercentage}%</span>
                    </div>
                    <Progress 
                      value={newUserPercentage} 
                      className="h-1 mt-1" 
                      label="Benutzer-Zuwachs Prozentsatz"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Aktive Benutzer</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg text-amber-500">
                  <Activity className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">In den letzten 30 Tagen</p>
                
                {stats.totalUsers > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Aktivitätsrate</span>
                      <span className="text-amber-500">{activeUserPercentage}%</span>
                    </div>
                    <Progress 
                      value={activeUserPercentage} 
                      className="h-1 mt-1" 
                      label="Benutzer-Aktivitätsrate Prozentsatz"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium">Sicherheitshinweise</CardTitle>
                <div className="p-2 bg-red-100 rounded-lg text-red-500">
                  <ShieldAlert className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.securityAlerts}</div>
                <p className="text-xs text-muted-foreground mt-1">Offene Hinweise</p>
                
                {stats.securityAlerts > 0 && (
                  <div className={cn(
                    "mt-3 p-2 text-xs rounded-md",
                    stats.securityAlerts > 5 ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {stats.securityAlerts > 5 
                      ? "Kritische Sicherheitsprobleme!" 
                      : "Überprüfen Sie die Sicherheitshinweise"}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="col-span-1 md:col-span-2"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Mitarbeiter</CardTitle>
                <CardDescription>
                  Übersicht aller registrierten Mitarbeiter
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : employees.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Cluster</TableHead>
                        <TableHead>Eintritt</TableHead>
                        <TableHead>Budget</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.slice(0, 5).map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee.imageUrl} alt={`${employee.firstName} ${employee.lastName}`} />
                                <AvatarFallback>{employee.firstName?.[0]}{employee.lastName?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <Link 
                                  to={`/employee/${employee.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {employee.firstName} {employee.lastName}
                                </Link>
                                {employee.email && (
                                  <p className="text-xs text-muted-foreground">{employee.email}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.cluster}</TableCell>
                          <TableCell>
                            {employee.entryDate && format(new Date(employee.entryDate), 'dd.MM.yyyy', { locale: de })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-medium">{employee.usedBudget.toFixed(2)} €</span>
                              <span className="mx-1 text-muted-foreground">/</span>
                              <span>{employee.budget.toFixed(2)} €</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-4 text-center text-muted-foreground">
                    <p>Keine Mitarbeiter gefunden.</p>
                    <Link to="/employees" className="text-primary hover:underline mt-2 inline-block">
                      Mitarbeiter hinzufügen
                    </Link>
                  </div>
                )}
                
                {employees.length > 5 && (
                  <div className="mt-4 text-right">
                    <Link to="/employees" className="text-primary hover:underline text-sm">
                      Alle {employees.length} Mitarbeiter anzeigen
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1"
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>
                  Hinweis zum Systemstatus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-md">
                  <p className="text-green-700 dark:text-green-300">
                    Das Admin-Backend ist einsatzbereit. Benutzerverwaltung und Rollenzuweisungen können jetzt konfiguriert werden.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-1"
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Hinweise</CardTitle>
                <CardDescription>
                  Wichtige Informationen zum System
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] pr-4">
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md">
                      <h4 className="text-sm font-medium">Admin-Bereich erfolgreich eingerichtet</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Der Admin-Bereich wurde erfolgreich eingerichtet. Sie können jetzt Benutzer verwalten und Rollen zuweisen.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h4 className="text-sm font-medium">Microsoft Intune Integration verfügbar</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Die Intune-Integration wurde auf der dedizierten Intune-Seite hinzugefügt.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
