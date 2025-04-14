
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDeviceByName } from '@/utils/intuneClient';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';

const IntuneIntegration = () => {
  const [tenantId, setTenantId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    if (!tenantId || !clientId || !clientSecret || !deviceName) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getDeviceByName(tenantId, clientId, clientSecret, deviceName);
      
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.device);
      }
    } catch (err: any) {
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Microsoft Intune Integration</CardTitle>
        <CardDescription>
          Verbinden Sie Ihre Microsoft Intune-Umgebung mit dem Asset Tracker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tenantId">Tenant ID</Label>
          <Input 
            id="tenantId" 
            value={tenantId} 
            onChange={(e) => setTenantId(e.target.value)} 
            placeholder="z.B. 12345678-1234-1234-1234-1234567890ab"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientId">Client/Application ID</Label>
          <Input 
            id="clientId" 
            value={clientId} 
            onChange={(e) => setClientId(e.target.value)} 
            placeholder="z.B. 12345678-1234-1234-1234-1234567890ab"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientSecret">Client Secret</Label>
          <Input 
            id="clientSecret" 
            type="password"
            value={clientSecret} 
            onChange={(e) => setClientSecret(e.target.value)} 
            placeholder="Ihr Client Secret"
          />
          <p className="text-xs text-muted-foreground">
            Hinweis: Das Client Secret sollte im produktiven Einsatz nicht im Frontend gespeichert werden.
          </p>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Test der Verbindung</h3>
          <div className="space-y-2">
            <Label htmlFor="deviceName">Gerätename</Label>
            <div className="flex space-x-2">
              <Input 
                id="deviceName" 
                value={deviceName} 
                onChange={(e) => setDeviceName(e.target.value)} 
                placeholder="z.B. LAPTOP-ABC123"
              />
              <Button onClick={testConnection} disabled={loading}>
                {loading ? 'Wird geladen...' : 'Testen'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="mt-4 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircledIcon className="h-4 w-4" />
            <AlertTitle>Gerät gefunden</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="font-semibold">Name:</span>
                <span>{result.deviceName}</span>
                
                <span className="font-semibold">Compliance:</span>
                <span>{result.complianceState}</span>
                
                <span className="font-semibold">Letzter Login:</span>
                <span>{result.lastLoggedOnDateTime ? new Date(result.lastLoggedOnDateTime).toLocaleString() : 'N/A'}</span>
                
                <span className="font-semibold">Benutzer:</span>
                <span>{result.userPrincipalName || 'N/A'}</span>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default IntuneIntegration;
