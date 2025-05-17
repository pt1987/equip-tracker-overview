
import React from "react";
import { FileBarChart, FileLineChart, Calendar } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import ReportsNavigation from "@/components/layout/ReportsNavigation";
import { reportRoutes } from "@/components/layout/ReportsNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function ReportingOverview() {
  // Remove overview link from navigation cards
  const reportLinks = reportRoutes.filter(route => route.path !== "/reporting");
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileBarChart className="h-8 w-8" />
              <span>Reporting</span>
            </h1>
            <p className="text-muted-foreground">
              Detaillierte Berichte und Analysen für Ihre Assets und Mitarbeiter
            </p>
          </div>
          
          <ReportsNavigation />
          
          <div className="bg-muted/30 border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-medium">Zeitraumfilter verfügbar</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Alle Berichte unterstützen jetzt Zeitraumfilter. Sie können zwischen vordefinierten Zeiträumen wählen oder
              einen benutzerdefinierten Zeitraum über den Datumsauswähler eingeben. Damit können Sie gezielt Daten für bestimmte
              Quartale, Jahre oder benutzerdefinierte Zeiträume analysieren.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportLinks.map((report) => (
              <Link key={report.path} to={report.path}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <report.icon className="h-5 w-5" />
                      {report.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Klicken Sie hier, um den detaillierten Bericht anzuzeigen.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
