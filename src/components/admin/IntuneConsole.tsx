
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LockIcon, ServerIcon, KeyIcon } from "lucide-react";

interface IntuneConfigProps {
  onConfigUpdate?: (config: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }) => void;
}

export default function IntuneConsole({ onConfigUpdate }: IntuneConfigProps) {
  const [tenantId, setTenantId] = React.useState('');
  const [clientId, setClientId] = React.useState('');
  const [clientSecret, setClientSecret] = React.useState('');
  const [isConnecting, setIsConnecting] = React.useState(false);
  const { toast } = useToast();

  const handleSaveConfig = async () => {
    if (!tenantId || !clientId || !clientSecret) {
      toast({
        title: "Fehlerhafte Konfiguration",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate API connection check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onConfigUpdate) {
        onConfigUpdate({
          tenantId,
          clientId,
          clientSecret
        });
      }
      
      toast({
        title: "Konfiguration gespeichert",
        description: "Die Intune-Konfiguration wurde erfolgreich gespeichert.",
      });
    } catch (error) {
      toast({
        title: "Verbindungsfehler",
        description: "Die Verbindung zu Microsoft Intune konnte nicht hergestellt werden.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ServerIcon size={18} />
          <span>Intune-Konfiguration</span>
        </CardTitle>
        <CardDescription>
          Konfigurieren Sie die Verbindung zu Microsoft Intune
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tenant-id">
            <span className="flex items-center gap-1">
              <LockIcon className="h-3.5 w-3.5" />
              <span>Azure AD Tenant ID</span>
            </span>
          </Label>
          <Input
            id="tenant-id"
            placeholder="11111111-2222-3333-4444-555555555555"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Die Tenant-ID Ihres Azure Active Directory
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-id">
            <span className="flex items-center gap-1">
              <KeyIcon className="h-3.5 w-3.5" />
              <span>Client ID</span>
            </span>
          </Label>
          <Input
            id="client-id"
            placeholder="66666666-7777-8888-9999-000000000000"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Die Client-ID Ihrer registrierten App in Azure AD
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-secret">
            <span className="flex items-center gap-1">
              <KeyIcon className="h-3.5 w-3.5" />
              <span>Client Secret</span>
            </span>
          </Label>
          <Input
            id="client-secret"
            placeholder="Ihr Client Secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            type="password"
          />
          <p className="text-xs text-muted-foreground">
            Das Client Secret Ihrer registrierten App
          </p>
        </div>

        <Button 
          className="w-full mt-6" 
          onClick={handleSaveConfig}
          disabled={isConnecting}
        >
          {isConnecting ? "Verbinde..." : "Konfiguration speichern"}
        </Button>
      </CardContent>
    </Card>
  );
}
