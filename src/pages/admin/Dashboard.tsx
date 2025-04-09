
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, UserPlus, Users, ShieldAlert, CalendarClock, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data
const mockStats = {
  totalUsers: 148,
  newUsers: 12,
  activeUsers: 86,
  securityAlerts: 3,
  recentActivity: [
    { id: 1, user: "Thomas Schmidt", action: "Hat sich angemeldet", time: "Vor 5 Minuten" },
    { id: 2, user: "Maria Wagner", action: "Hat Benutzerberechtigungen geändert", time: "Vor 27 Minuten" },
    { id: 3, user: "Lukas Müller", action: "Hat einen neuen Benutzer erstellt", time: "Vor 2 Stunden" },
    { id: 4, user: "Sarah Fischer", action: "Hat Passwort zurückgesetzt", time: "Vor 3 Stunden" },
    { id: 5, user: "Admin", action: "Systemwartung durchgeführt", time: "Vor 6 Stunden" }
  ]
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(mockStats);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Guten Morgen");
    else if (hour < 18) setGreeting("Guten Tag");
    else setGreeting("Guten Abend");
  }, []);

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
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Zuwachs</span>
                    <span className="text-green-500">+{Math.round((stats.newUsers / stats.totalUsers) * 100)}%</span>
                  </div>
                  <Progress value={(stats.newUsers / stats.totalUsers) * 100} className="h-1 mt-1" />
                </div>
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
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Aktivitätsrate</span>
                    <span className="text-amber-500">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}%</span>
                  </div>
                  <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className="h-1 mt-1" />
                </div>
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
            transition={{ delay: 0.5 }}
            className="col-span-1"
          >
            <Card className="glass-card h-full">
              <CardHeader>
                <CardTitle>Letzte Aktivitäten</CardTitle>
                <CardDescription>
                  Die neuesten Benutzeraktivitäten im System
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
                        <div className="mt-1">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarClock size={12} className="mr-1" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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
                <CardTitle>Systemnachrichten</CardTitle>
                <CardDescription>
                  Wichtige Informationen und Updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 pb-4 border-b">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Systemupdate geplant</p>
                        <p className="text-xs text-muted-foreground">
                          Das nächste Systemupdate ist für den 15.05.2023 um 22:00 Uhr geplant.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarClock size={12} className="mr-1" />
                          Vor 1 Tag
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 pb-4 border-b">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Neue Funktionen verfügbar</p>
                        <p className="text-xs text-muted-foreground">
                          Die Asset Management Funktionen wurden erweitert. Entdecken Sie die neuen Möglichkeiten!
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarClock size={12} className="mr-1" />
                          Vor 3 Tagen
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 pb-4 border-b">
                      <div className="mt-1">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                          <ShieldAlert className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Sicherheitshinweis</p>
                        <p className="text-xs text-muted-foreground">
                          Bitte aktualisieren Sie Ihr Passwort innerhalb der nächsten 7 Tage.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarClock size={12} className="mr-1" />
                          Vor 5 Tagen
                        </div>
                      </div>
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
