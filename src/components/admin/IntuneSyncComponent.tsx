
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useIntuneDevices } from "@/hooks/use-intune";
import { Loader2, RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function IntuneSyncComponent() {
  const { toast } = useToast();
  const { devices, isLoading, error, refetch } = useIntuneDevices();
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncResults, setSyncResults] = useState<Array<{ device: string; status: 'success' | 'error'; message: string }>>([]);

  const startSync = async () => {
    if (devices.length === 0) {
      toast({
        title: "Keine Geräte gefunden",
        description: "Es wurden keine Intune-Geräte gefunden, die synchronisiert werden können.",
        variant: "destructive",
      });
      return;
    }

    setSyncInProgress(true);
    setSyncProgress(0);
    setSyncResults([]);

    const results = [];
    
    // Simulate synchronization progress
    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];
      const progress = Math.round(((i + 1) / devices.length) * 100);
      
      // Simulate API call to create or update asset
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const success = Math.random() > 0.2; // 80% success rate for simulation
      
      results.push({
        device: device.deviceName,
        status: success ? 'success' : 'error',
        message: success ? 
          "Gerät erfolgreich synchronisiert" : 
          "Synchronisierung fehlgeschlagen: Gerät konnte nicht aktualisiert werden"
      });
      
      setSyncProgress(progress);
    }
    
    setSyncResults(results);
    setSyncInProgress(false);
    
    const successCount = results.filter(r => r.status === 'success').length;
    
    toast({
      title: "Synchronisierung abgeschlossen",
      description: `${successCount} von ${devices.length} Geräten wurden erfolgreich synchronisiert.`,
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw size={18} />
          <span>Intune-Geräte synchronisieren</span>
        </CardTitle>
        <CardDescription>
          Synchronisieren Sie Ihre Intune-Geräte mit dem Asset Management System
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {devices.length > 0 && (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gerätename</TableHead>
                  <TableHead>Betriebssystem</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Letzter Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.slice(0, 5).map((device, index) => (
                  <TableRow key={index}>
                    <TableCell>{device.deviceName}</TableCell>
                    <TableCell>{device.operatingSystem} {device.osVersion}</TableCell>
                    <TableCell>{device.complianceState || 'Unbekannt'}</TableCell>
                    <TableCell>{formatDateTime(device.lastLoggedOnDateTime)}</TableCell>
                  </TableRow>
                ))}
                {devices.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      {devices.length - 5} weitere Geräte verfügbar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        
        {syncInProgress && (
          <div className="space-y-2">
            <Progress value={syncProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Synchronisiere Geräte... {syncProgress}%
            </p>
          </div>
        )}
        
        {syncResults.length > 0 && (
          <div className="max-h-60 overflow-y-auto border rounded-md p-2">
            <h4 className="font-medium mb-2">Synchronisierungsergebnisse</h4>
            <div className="space-y-1">
              {syncResults.map((result, i) => (
                <div key={i} className="flex items-center text-sm">
                  {result.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="flex-1 truncate">{result.device}</span>
                  <span className={result.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                    {result.status === 'success' ? 'Erfolg' : 'Fehler'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={refetch}
          disabled={isLoading || syncInProgress}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Geräte aktualisieren
        </Button>
        
        <Button
          onClick={startSync}
          disabled={isLoading || syncInProgress || devices.length === 0}
        >
          {syncInProgress ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {syncInProgress ? "Synchronisiere..." : "Synchronisierung starten"}
        </Button>
      </CardFooter>
    </Card>
  );
}
