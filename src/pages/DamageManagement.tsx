
import { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  AlertTriangle, 
  Calendar, 
  Shield, 
  Check, 
  PlusCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DamageIncidentForm } from "@/components/damage-management/DamageIncidentForm";
import { DamageIncidentsTable } from "@/components/damage-management/DamageIncidentsTable";
import { DamageReportView } from "@/components/damage-management/DamageReportView";
import { DialogDamageIncident } from "@/components/damage-management/DialogDamageIncident";

export default function DamageManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("incidents");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const { toast } = useToast();

  const handleAddNewIncident = () => {
    setSelectedIncidentId(null);
    setOpenDialog(true);
  };

  const handleEditIncident = (id: string) => {
    setSelectedIncidentId(id);
    setOpenDialog(true);
  };

  const handleDialogClose = (success?: boolean) => {
    setOpenDialog(false);
    if (success) {
      toast({
        title: selectedIncidentId ? "Schadensfall aktualisiert" : "Schadensfall erstellt",
        description: selectedIncidentId 
          ? "Der Schadensfall wurde erfolgreich aktualisiert." 
          : "Der Schadensfall wurde erfolgreich erfasst.",
        variant: "default",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Schadensmanagement | Asset Tracker</title>
      </Helmet>
      
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schadensmanagement</h1>
            <p className="text-muted-foreground mt-1">
              ISO 27001 konformes Schadensmanagement für Assets
            </p>
          </div>
          <Button onClick={handleAddNewIncident}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Neuen Schadensfall melden
          </Button>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Offene Fälle</CardTitle>
              <CardDescription>Aktuell offene Schadensfälle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
            </CardContent>
            <CardFooter className="pt-0">
              <span className="text-xs text-muted-foreground">
                <AlertTriangle className="inline-block h-3 w-3 mr-1" />
                3 mit hohem Risiko
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Bearbeitungszeit</CardTitle>
              <CardDescription>Durchschnittliche Bearbeitungszeit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 Tage</div>
            </CardContent>
            <CardFooter className="pt-0">
              <span className="text-xs text-muted-foreground">
                <Calendar className="inline-block h-3 w-3 mr-1" />
                Letzte 30 Tage
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Abgeschlossene Fälle</CardTitle>
              <CardDescription>Im letzten Monat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
            <CardFooter className="pt-0">
              <span className="text-xs text-muted-foreground">
                <Check className="inline-block h-3 w-3 mr-1" />
                Alle ISO konform dokumentiert
              </span>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
              <CardDescription>ISO 27001 Konformität</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">97%</div>
            </CardContent>
            <CardFooter className="pt-0">
              <span className="text-xs text-muted-foreground">
                <Shield className="inline-block h-3 w-3 mr-1" />
                Letzte Prüfung: vor 7 Tagen
              </span>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="incidents">Schadensfälle</TabsTrigger>
            <TabsTrigger value="reports">Berichte & Dokumentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="incidents" className="space-y-4 mt-4">
            <DamageIncidentsTable onEditIncident={handleEditIncident} />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4 mt-4">
            <DamageReportView />
          </TabsContent>
        </Tabs>
      </div>

      <DialogDamageIncident 
        open={openDialog}
        onClose={handleDialogClose}
        incidentId={selectedIncidentId}
      />
    </>
  );
}
