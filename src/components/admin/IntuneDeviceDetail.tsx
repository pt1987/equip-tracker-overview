
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIntuneDevice } from "@/hooks/use-intune";
import { Search, AlertCircle, Loader2, Server, Settings } from "lucide-react";
import { format } from "date-fns";

interface IntuneDeviceDetailProps {
  initialDeviceName?: string;
}

export default function IntuneDeviceDetail({ initialDeviceName }: IntuneDeviceDetailProps) {
  const [deviceName, setDeviceName] = useState(initialDeviceName || '');
  const [searchQuery, setSearchQuery] = useState(initialDeviceName || '');
  const { device, isLoading, error, refetch } = useIntuneDevice(searchQuery);

  const handleSearch = () => {
    if (deviceName.trim()) {
      setSearchQuery(deviceName.trim());
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server size={18} />
          <span>Intune-Geräteinformationen</span>
        </CardTitle>
        <CardDescription>
          Suchen Sie nach einem Gerät in Intune
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="device-name" className="sr-only">Gerätename</Label>
            <Input
              id="device-name"
              placeholder="Gerätename eingeben (z.B. LAPTOP-ABC123)"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading || !deviceName.trim()}>
            <Search className="h-4 w-4 mr-2" />
            Suchen
          </Button>
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {device && (
          <div className="space-y-4 border rounded-md p-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{device.deviceName}</h3>
              <div className={`px-2 py-1 text-xs rounded-full ${
                device.complianceState === 'compliant' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : device.complianceState === 'noncompliant'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
              }`}>
                {device.complianceState || 'Unbekannt'}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Betriebssystem:</span>
                  <p className="font-medium">{device.operatingSystem} {device.osVersion}</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Letzter Login:</span>
                  <p className="font-medium">{formatDateTime(device.lastLoggedOnDateTime)}</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Benutzer:</span>
                  <p className="font-medium">{device.userPrincipalName || 'Nicht zugewiesen'}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Hersteller:</span>
                  <p className="font-medium">{device.manufacturer || 'N/A'}</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Modell:</span>
                  <p className="font-medium">{device.model || 'N/A'}</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Seriennummer:</span>
                  <p className="font-medium">{device.serialNumber || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {device && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={refetch} disabled={isLoading}>
            <Settings className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
