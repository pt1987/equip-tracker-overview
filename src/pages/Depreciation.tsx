
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from "@/components/layout/PageTransition";
import { useState } from "react";
import { BarChart3, Calculator } from "lucide-react";
import DepreciationDashboard from "@/components/depreciation/DepreciationDashboard";

export default function Depreciation() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <Calculator className="h-8 w-8" />
                <span>Anlagevermögen & AfA</span>
              </h1>
              <p className="text-muted-foreground">
                Verwaltung und Abschreibung von IT-Assets gemäß steuerlicher Vorgaben
              </p>
            </div>
            
            {/* Moved tabs button group inside a proper Tabs component */}
            <div className="flex items-center gap-2">
              <Tabs value={activeTab} onValueChange={setActiveTab as any}>
                <TabsList>
                  <TabsTrigger 
                    value="dashboard" 
                    className={activeTab === "dashboard" ? "bg-primary text-primary-foreground" : ""}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings"
                    className={activeTab === "settings" ? "bg-primary text-primary-foreground" : ""}
                  >
                    Einstellungen
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab as any} className="space-y-6">
            <TabsContent value="dashboard">
              <DepreciationDashboard />
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="grid grid-cols-1 gap-6">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4">AfA-Einstellungen</h2>
                  <p className="mb-6 text-muted-foreground">
                    Hier können Sie die Standard-Nutzungsdauern gemäß der amtlichen AfA-Tabelle für
                    verschiedene Asset-Typen konfigurieren.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Asset-Typ</th>
                          <th className="text-center py-3 px-4">Standard-Nutzungsdauer</th>
                          <th className="text-center py-3 px-4">Min. Dauer</th>
                          <th className="text-center py-3 px-4">Max. Dauer</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">Notebook</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">5 Jahre</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">Tablet</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">5 Jahre</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">Smartphone</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">5 Jahre</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">Maus</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">1 Jahr</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                        </tr>
                        <tr className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">Tastatur</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">1 Jahr</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                        </tr>
                        <tr className="hover:bg-muted/50">
                          <td className="py-3 px-4">Zubehör</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                          <td className="py-3 px-4 text-center">1 Jahr</td>
                          <td className="py-3 px-4 text-center">3 Jahre</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">GWG-Schwellenwert</h3>
                    <p className="text-muted-foreground">
                      Der aktuelle Schwellenwert für Geringwertige Wirtschaftsgüter (GWG) liegt bei 800 € netto.
                      Assets unterhalb dieses Wertes können im Anschaffungsjahr sofort abgeschrieben werden.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
