
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Plus, Search, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Roles() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rollenverwaltung</h1>
            <p className="text-muted-foreground">
              Verwalten Sie die Benutzerrollen und Berechtigungen im System
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Rolle hinzufügen
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche nach Rollennamen"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Keine Rollen definiert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Erstellen Sie eine neue Rolle, um Berechtigungen zu definieren.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
