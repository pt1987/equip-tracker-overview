
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import IntuneConsole from "@/components/admin/IntuneConsole";
import IntuneSyncComponent from "@/components/admin/IntuneSyncComponent";
import IntuneComplianceComponent from "@/components/admin/IntuneComplianceComponent";
import IntuneDeviceDetail from "@/components/admin/IntuneDeviceDetail";
import IntuneDocumentation from "@/components/admin/IntuneDocumentation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Terminal, AlertCircle, PlayCircle, Trash2, Download, Server, ChevronDown } from "lucide-react";
import { getAllDevices, getDeviceByName, getCompliancePolicies } from "@/utils/intuneClient";
import { cn } from "@/lib/utils";
import { useIntuneConfig } from "@/hooks/use-intune";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConsoleLog {
  id: string;
  type: "info" | "error" | "request" | "response";
  message: string;
  timestamp: Date;
}

const navigationItems = [
  { key: "documentation", label: "Dokumentation", requiresConfig: false },
  { key: "configuration", label: "Konfiguration", requiresConfig: false },
  { key: "sync", label: "Synchronisierung", requiresConfig: true },
  { key: "compliance", label: "Compliance", requiresConfig: true },
  { key: "device", label: "Gerätedetails", requiresConfig: true },
];

export default function IntuneAdminPage() {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const { config, isConfigured } = useIntuneConfig();
  const [activeSection, setActiveSection] = useState<string>("documentation");

  const logToConsole = (type: "info" | "error" | "request" | "response", message: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        message,
        timestamp: new Date()
      }
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const logsText = logs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.type.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intune-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const executeGraphRequest = async (operation: string) => {
    if (!isConfigured || !config) {
      logToConsole("error", "Intune-Konfiguration ist nicht vollständig konfiguriert");
      return;
    }

    const { tenantId, clientId, clientSecret } = config;
    
    try {
      logToConsole("request", `API-Anfrage: ${operation}`);
      
      let result;
      switch (operation) {
        case "getAllDevices":
          result = await getAllDevices(tenantId, clientId, clientSecret);
          break;
        case "getDeviceByName":
          const deviceName = prompt("Gerätename eingeben:");
          if (!deviceName) {
            logToConsole("info", "Operation abgebrochen");
            return;
          }
          result = await getDeviceByName(tenantId, clientId, clientSecret, deviceName);
          break;
        case "getCompliancePolicies":
          result = await getCompliancePolicies(tenantId, clientId, clientSecret);
          break;
        default:
          logToConsole("error", `Unbekannte Operation: ${operation}`);
          return;
      }

      if (result.error) {
        logToConsole("error", `Fehler: ${result.error}${result.details ? ` - ${result.details}` : ""}`);
      } else {
        logToConsole("response", `Erfolgreich: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (error: any) {
      logToConsole("error", `Exception: ${error.message || "Unbekannter Fehler"}`);
    }
  };

  const currentItem = navigationItems.find(item => item.key === activeSection);
  const availableItems = navigationItems.filter(item => !item.requiresConfig || isConfigured);

  const renderContent = () => {
    switch (activeSection) {
      case "documentation":
        return <IntuneDocumentation />;
      
      case "configuration":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-1">
                <IntuneConsole />
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <h3 className="text-lg font-semibold mb-2">GraphAPI-Operationen</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Führen Sie Microsoft Graph API-Anfragen durch
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => executeGraphRequest("getAllDevices")} 
                        disabled={!isConfigured}
                        variant="outline"
                        size="sm"
                      >
                        Alle Geräte abrufen
                      </Button>
                      <Button 
                        onClick={() => executeGraphRequest("getDeviceByName")} 
                        disabled={!isConfigured}
                        variant="outline"
                        size="sm"
                      >
                        Gerät nach Namen suchen
                      </Button>
                      <Button 
                        onClick={() => executeGraphRequest("getCompliancePolicies")} 
                        disabled={!isConfigured}
                        variant="outline"
                        size="sm"
                      >
                        Compliance-Richtlinien abrufen
                      </Button>
                    </div>
                    
                    <div className={cn(
                      "text-xs text-center py-1 px-2 rounded",
                      isConfigured ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : 
                      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    )}>
                      {isConfigured 
                        ? "Konfiguration vorhanden - API-Anfragen können durchgeführt werden" 
                        : "Konfiguration unvollständig - Bitte konfigurieren Sie die Intune-Verbindung"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Terminal size={18} />
                      <span>GraphAPI-Konsole</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      API-Anfragen, Antworten und Fehler werden hier angezeigt
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearLogs}
                      className="h-8 px-2 lg:px-3"
                    >
                      <Trash2 className="h-4 w-4 mr-0 lg:mr-2" />
                      <span className="hidden lg:inline">Löschen</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={downloadLogs}
                      className="h-8 px-2 lg:px-3"
                      disabled={logs.length === 0}
                    >
                      <Download className="h-4 w-4 mr-0 lg:mr-2" />
                      <span className="hidden lg:inline">Exportieren</span>
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[400px] w-full border rounded-md bg-muted/20 p-2 mt-4">
                  {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <Terminal className="h-8 w-8 mb-2 opacity-50" />
                      <p>Keine Logs verfügbar</p>
                      <p className="text-xs">API-Anfragen werden hier angezeigt</p>
                    </div>
                  ) : (
                    <div className="space-y-1 font-mono text-xs">
                      {logs.map((log) => (
                        <div 
                          key={log.id} 
                          className={cn(
                            "py-1 px-2 rounded flex items-start",
                            log.type === "error" ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950" : 
                            log.type === "request" ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950" :
                            log.type === "response" ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950" :
                            "text-muted-foreground"
                          )}
                        >
                          <div className="flex-shrink-0 mr-2">
                            [{log.timestamp.toLocaleTimeString()}]
                            {log.type === "error" && <AlertCircle className="inline-block ml-1 h-3 w-3" />}
                          </div>
                          <div className="whitespace-pre-wrap overflow-auto max-w-full">
                            {log.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );
      
      case "sync":
        return isConfigured ? (
          <IntuneSyncComponent />
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">Intune-Konfiguration erforderlich</h3>
              <p className="text-muted-foreground">
                Bitte konfigurieren Sie zuerst die Intune-Verbindung im Konfigurationsbereich.
              </p>
              <Button onClick={() => setActiveSection("configuration")}>
                Zur Konfiguration
              </Button>
            </div>
          </Card>
        );
      
      case "compliance":
        return isConfigured ? (
          <IntuneComplianceComponent />
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">Intune-Konfiguration erforderlich</h3>
              <p className="text-muted-foreground">
                Bitte konfigurieren Sie zuerst die Intune-Verbindung im Konfigurationsbereich.
              </p>
              <Button onClick={() => setActiveSection("configuration")}>
                Zur Konfiguration
              </Button>
            </div>
          </Card>
        );
      
      case "device":
        return isConfigured ? (
          <IntuneDeviceDetail />
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <h3 className="text-lg font-medium">Intune-Konfiguration erforderlich</h3>
              <p className="text-muted-foreground">
                Bitte konfigurieren Sie zuerst die Intune-Verbindung im Konfigurationsbereich.
              </p>
              <Button onClick={() => setActiveSection("configuration")}>
                Zur Konfiguration
              </Button>
            </div>
          </Card>
        );
      
      default:
        return <IntuneDocumentation />;
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microsoft Intune Integration</h1>
          <p className="text-muted-foreground">
            Verbinden Sie Asset Tracker mit Ihrer Microsoft Intune-Umgebung
          </p>
        </div>
        
        <div className="w-full">
          <div className="mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-between min-w-[200px]">
                  <span>{currentItem?.label || "Bereich auswählen"}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] bg-background">
                {availableItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    disabled={item.requiresConfig && !isConfigured}
                    className="cursor-pointer"
                  >
                    {item.label}
                    {item.requiresConfig && !isConfigured && (
                      <span className="ml-2 text-xs text-muted-foreground">(Konfiguration erforderlich)</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
