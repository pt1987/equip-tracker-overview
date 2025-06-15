
import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DamageIncidentsTable } from "@/components/damage-management/DamageIncidentsTable";
import { DialogDamageIncident } from "@/components/damage-management/DialogDamageIncident";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DamageManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncidentId, setEditingIncidentId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const handleEditIncident = (id: string) => {
    setEditingIncidentId(id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (success?: boolean) => {
    setIsDialogOpen(false);
    setEditingIncidentId(null);
    
    if (success) {
      // Hier würden wir normalerweise die Daten neu laden
      console.log("Incident saved successfully");
    }
  };

  const handleNewIncident = () => {
    setEditingIncidentId(null);
    setIsDialogOpen(true);
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6">
          <div className={`flex flex-col ${isMobile ? 'gap-4' : 'md:flex-row md:items-center justify-between gap-4'}`}>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <AlertTriangle className="h-8 w-8" />
                <span>Schadensmanagement</span>
              </h1>
              <p className="text-muted-foreground">
                ISO 27001 konformes Schadensmanagement für Assets
              </p>
            </div>
            <Button 
              onClick={handleNewIncident}
              className={`${isMobile ? 'w-full' : 'flex-shrink-0'} flex items-center gap-2`}
              size={isMobile ? "default" : "default"}
            >
              <span>Neuen Schadensfall melden</span>
            </Button>
          </div>
          
          <Card className="shadow-sm border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Schadensfall-Verwaltung</CardTitle>
                  <CardDescription>Übersicht und Bearbeitung von gemeldeten Schadensfällen</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DamageIncidentsTable onEditIncident={handleEditIncident} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <DialogDamageIncident
        open={isDialogOpen}
        onClose={handleCloseDialog}
        incidentId={editingIncidentId}
      />
    </PageTransition>
  );
}
