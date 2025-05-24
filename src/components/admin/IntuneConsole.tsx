
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LockIcon, ServerIcon, KeyIcon, SaveIcon, TrashIcon } from "lucide-react";
import { useIntuneConfig, IntuneConfig } from "@/hooks/use-intune";

interface IntuneConsoleProps {
  onConfigUpdate?: (config: IntuneConfig) => void;
}

export default function IntuneConsole({ onConfigUpdate }: IntuneConsoleProps) {
  const { toast } = useToast();
  const { config, updateConfig, clearConfig } = useIntuneConfig();
  
  const [tenantId, setTenantId] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [configExists, setConfigExists] = useState(false);

  // Load existing configuration if available
  useEffect(() => {
    if (config) {
      setTenantId(config.tenantId || '');
      setClientId(config.clientId || '');
      setClientSecret(config.clientSecret || '');
      setConfigExists(true);
    }
  }, [config]);

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
      // Update the configuration
      const newConfig = {
        tenantId,
        clientId,
        clientSecret
      };
      
      updateConfig(newConfig);
      
      if (onConfigUpdate) {
        onConfigUpdate(newConfig);
      }
      
      toast({
        title: "Konfiguration gespeichert",
        description: "Die Intune-Konfiguration wurde erfolgreich gespeichert.",
      });
      
      setConfigExists(true);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Konfiguration konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClearConfig = () => {
    clearConfig();
    setTenantId('');
    setClientId('');
    setClientSecret('');
    setConfigExists(false);
    
    toast({
      title: "Konfiguration gelöscht",
      description: "Die Intune-Konfiguration wurde erfolgreich gelöscht.",
    });
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

        <div className="flex gap-2 pt-4">
          <Button 
            className="flex-1" 
            onClick={handleSaveConfig}
            disabled={isConnecting}
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {isConnecting ? "Verbinde..." : configExists ? "Konfiguration aktualisieren" : "Konfiguration speichern"}
          </Button>
          
          {configExists && (
            <Button 
              variant="destructive" 
              onClick={handleClearConfig}
              disabled={isConnecting}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Löschen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
