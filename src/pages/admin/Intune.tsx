
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import IntuneIntegration from "@/components/admin/IntuneIntegration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Terminal, AlertCircle, PlayCircle, Trash2, Download } from "lucide-react";
import { getAllDevices, getDeviceByName, getCompliancePolicies } from "@/utils/intuneClient";
import { cn } from "@/lib/utils";

interface ConsoleLog {
  id: string;
  type: "info" | "error" | "request" | "response";
  message: string;
  timestamp: Date;
}

export default function IntuneAdminPage() {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [intuneConfig, setIntuneConfig] = useState({
    tenantId: "",
    clientId: "",
    clientSecret: ""
  });
  const [isConfigValid, setIsConfigValid] = useState(false);

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

  const handleIntuneConfigUpdate = (config: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
  }) => {
    setIntuneConfig(config);
    setIsConfigValid(!!config.tenantId && !!config.clientId && !!config.clientSecret);
    logToConsole("info", "Intune-Konfiguration aktualisiert");
  };

  const executeGraphRequest = async (operation: string) => {
    if (!isConfigValid) {
      logToConsole("error", "Intune-Konfiguration ist nicht vollständig konfiguriert");
      return;
    }

    const { tenantId, clientId, clientSecret } = intuneConfig;
    
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

  return (
    <PageTransition>
      <div className="flex flex-col gap-8 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microsoft Intune Integration</h1>
          <p className="text-muted-foreground">
            Verbinden Sie Asset Tracker mit Ihrer Microsoft Intune-Umgebung
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <IntuneIntegration onConfigUpdate={handleIntuneConfigUpdate} />
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle size={18} />
                  <span>GraphAPI-Operationen</span>
                </CardTitle>
                <CardDescription>
                  Führen Sie Microsoft Graph API-Anfragen durch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => executeGraphRequest("getAllDevices")} 
                    disabled={!isConfigValid}
                    variant="outline"
                    size="sm"
                  >
                    Alle Geräte abrufen
                  </Button>
                  <Button 
                    onClick={() => executeGraphRequest("getDeviceByName")} 
                    disabled={!isConfigValid}
                    variant="outline"
                    size="sm"
                  >
                    Gerät nach Namen suchen
                  </Button>
                  <Button 
                    onClick={() => executeGraphRequest("getCompliancePolicies")} 
                    disabled={!isConfigValid}
                    variant="outline"
                    size="sm"
                  >
                    Compliance-Richtlinien abrufen
                  </Button>
                </div>
                
                <div className={cn(
                  "text-xs text-center py-1 px-2 rounded",
                  isConfigValid ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : 
                  "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                )}>
                  {isConfigValid 
                    ? "Konfiguration vorhanden - API-Anfragen können durchgeführt werden" 
                    : "Konfiguration unvollständig - Bitte konfigurieren Sie die Intune-Verbindung"}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal size={18} />
                    <span>GraphAPI-Konsole</span>
                  </CardTitle>
                  <CardDescription>
                    API-Anfragen, Antworten und Fehler werden hier angezeigt
                  </CardDescription>
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
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full border rounded-md bg-muted/20 p-2">
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
          
          <div className="md:col-span-2">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Sicherheitshinweise</h3>
              <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
                <li>
                  Das Client Secret sollte im produktiven Einsatz nicht im Frontend gespeichert werden.
                </li>
                <li>
                  Erstellen Sie einen dedizierten Service Principal mit minimalen Berechtigungen für die Integration.
                </li>
                <li>
                  Aktivieren Sie die Conditional Access Policies, um den Zugriff auf die API zu beschränken.
                </li>
                <li>
                  Überwachen Sie die API-Nutzung regelmäßig in Azure AD.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
