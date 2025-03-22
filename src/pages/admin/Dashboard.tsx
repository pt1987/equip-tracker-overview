
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, UserPlus, Users, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

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
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}, {user?.name || "Admin"}</h1>
          <p className="text-muted-foreground">
            Hier finden Sie eine Übersicht über Ihre Benutzer und Aktivitäten
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Benutzer gesamt</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registrierte Benutzer</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Neue Benutzer</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newUsers}</div>
              <p className="text-xs text-muted-foreground">Im letzten Monat</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Benutzer</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">In den letzten 30 Tagen</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sicherheitshinweise</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.securityAlerts}</div>
              <p className="text-xs text-muted-foreground">Offene Hinweise</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Letzte Aktivitäten</CardTitle>
              <CardDescription>
                Die neuesten Benutzeraktivitäten im System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
