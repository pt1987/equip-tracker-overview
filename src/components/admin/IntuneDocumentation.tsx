
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Shield, Settings, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function IntuneDocumentation() {
  return (
    <div className="space-y-6">
      {/* Übersicht */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={18} />
            Microsoft Intune Integration - Dokumentation
          </CardTitle>
          <CardDescription>
            Vollständige Anleitung zur Einrichtung und Verwendung der Microsoft Intune Integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Wichtiger Hinweis</AlertTitle>
            <AlertDescription>
              Diese Integration verwendet eine Multi-Tenant App-Registrierung. Die Daten werden sicher im localStorage Ihres Browsers gespeichert.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Schritt 1: App-Registrierung */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Schritt 1: Azure App-Registrierung erstellen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-2">1.1 Azure Portal öffnen</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Öffnen Sie das Azure Portal und navigieren Sie zu "Azure Active Directory"
              </p>
              <Button variant="outline" size="sm" onClick={() => window.open('https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps', '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Azure Portal öffnen
              </Button>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-2">1.2 App-Registrierung erstellen</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Klicken Sie auf "App-Registrierungen" → "Neue Registrierung"</li>
                <li><strong>Name:</strong> Asset Tracker Intune Integration</li>
                <li><strong>Unterstützte Kontotypen:</strong> Nur Konten in diesem Organisationsverzeichnis</li>
                <li><strong>Umleitungs-URI:</strong> Leer lassen (wird nicht benötigt)</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-2">1.3 Wichtige Werte notieren</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Nach der Erstellung finden Sie auf der Übersichtsseite:
              </p>
              <div className="space-y-2">
                <Badge variant="outline">Anwendungs-ID (Client-ID)</Badge>
                <Badge variant="outline">Verzeichnis-ID (Tenant-ID)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schritt 2: Client Secret */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Schritt 2: Client Secret erstellen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-semibold mb-2">2.1 Secret erstellen</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Navigieren Sie zu "Zertifikate und Geheimnisse"</li>
                <li>Klicken Sie auf "Neues Clientgeheimnis"</li>
                <li><strong>Beschreibung:</strong> Asset Tracker Integration</li>
                <li><strong>Ablauf:</strong> 24 Monate (empfohlen)</li>
                <li><strong>Wichtig:</strong> Kopieren Sie den Wert sofort - er wird nur einmal angezeigt!</li>
              </ul>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Sicherheitshinweis</AlertTitle>
              <AlertDescription>
                Das Client Secret wird nur einmal angezeigt. Notieren Sie es sich sofort und speichern Sie es sicher.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Schritt 3: API-Berechtigungen */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Schritt 3: API-Berechtigungen konfigurieren
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-2">3.1 Erforderliche Berechtigungen</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Navigieren Sie zu "API-Berechtigungen" und fügen Sie folgende Microsoft Graph-Berechtigungen hinzu:
              </p>
              
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-md">
                  <h5 className="font-medium text-sm mb-2">Application Permissions (empfohlen):</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Badge variant="secondary">DeviceManagementManagedDevices.Read.All</Badge>
                    <Badge variant="secondary">DeviceManagementConfiguration.Read.All</Badge>
                    <Badge variant="secondary">Device.Read.All</Badge>
                    <Badge variant="secondary">User.Read.All</Badge>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                  <h5 className="font-medium text-sm mb-2">Alternative: Delegated Permissions:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Badge variant="outline">DeviceManagementManagedDevices.Read</Badge>
                    <Badge variant="outline">DeviceManagementConfiguration.Read</Badge>
                    <Badge variant="outline">Device.Read</Badge>
                    <Badge variant="outline">User.Read</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold mb-2">3.2 Admin-Zustimmung erteilen</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Klicken Sie auf "Administratorzustimmung für [Tenant] erteilen"</li>
                <li>Bestätigen Sie die Zustimmung</li>
                <li>Status sollte "Erteilt für [Tenant]" anzeigen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schritt 4: Datenspeicherung */}
      <Card>
        <CardHeader>
          <CardTitle>Schritt 4: Datenspeicherung und Sicherheit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold mb-2">4.1 Lokale Datenspeicherung</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Konfigurationsdaten werden im <code className="bg-muted px-1 rounded">localStorage</code> gespeichert</li>
                <li>Daten bleiben nur in Ihrem Browser und werden nicht an externe Server übertragen</li>
                <li>Bei Browser-Cache-Löschung müssen Sie die Konfiguration erneut eingeben</li>
                <li>Jeder Benutzer muss die Konfiguration einmalig in seinem Browser vornehmen</li>
              </ul>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Sicherheitshinweise</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>• Das Client Secret wird verschlüsselt im Browser gespeichert</p>
                <p>• Verwenden Sie diese Integration nur auf vertrauenswürdigen Geräten</p>
                <p>• Erstellen Sie einen dedizierten Service Principal mit minimalen Berechtigungen</p>
                <p>• Überwachen Sie die API-Nutzung regelmäßig im Azure Portal</p>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Schritt 5: Konfiguration testen */}
      <Card>
        <CardHeader>
          <CardTitle>Schritt 5: Integration konfigurieren und testen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold mb-2">5.1 Werte eingeben</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Wechseln Sie zum "Konfiguration"-Tab und geben Sie die folgenden Werte ein:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li><strong>Tenant ID:</strong> Die Verzeichnis-ID aus Schritt 1.3</li>
                <li><strong>Client ID:</strong> Die Anwendungs-ID aus Schritt 1.3</li>
                <li><strong>Client Secret:</strong> Das Secret aus Schritt 2.1</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold mb-2">5.2 Verbindung testen</h4>
              <p className="text-sm text-muted-foreground">
                Nach dem Speichern der Konfiguration können Sie die API-Operationen testen und die anderen Tabs verwenden.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Häufige Probleme und Lösungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-md">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Fehler: "Insufficient privileges"</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Stellen Sie sicher, dass die Admin-Zustimmung erteilt wurde und die korrekten API-Berechtigungen gesetzt sind.
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Fehler: "Invalid client secret"</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Überprüfen Sie das Client Secret. Erstellen Sie bei Bedarf ein neues Secret.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Keine Geräte gefunden</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Stellen Sie sicher, dass Geräte in Intune registriert sind und die Berechtigungen korrekt gesetzt sind.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
