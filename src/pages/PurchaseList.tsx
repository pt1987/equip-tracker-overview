
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseItem, PurchaseListFilter } from "@/lib/purchase-list-types";
import PurchaseListTable from "@/components/purchase-list/PurchaseListTable";
import PurchaseUploader from "@/components/purchase-list/PurchaseUploader";
import PurchaseFilters from "@/components/purchase-list/PurchaseFilters";
import { useToast } from "@/components/ui/use-toast"; // Updated import path
import { Button } from "@/components/ui/button";
import { FileBarChart, FileSpreadsheet, FileUp } from "lucide-react";
import { exportPurchaseList } from "@/utils/purchase-export";
import { usePurchaseItems } from "@/hooks/usePurchaseItems";

export default function PurchaseList() {
  const [activeTab, setActiveTab] = useState<"list" | "upload">("list");
  const [filters, setFilters] = useState<PurchaseListFilter>({});
  const { toast } = useToast();
  
  const { 
    items, 
    isLoading, 
    error, 
    refresh,
    exportToDatev,
    exportForAudit
  } = usePurchaseItems(filters);

  const handleExportDatev = async () => {
    try {
      await exportToDatev();
      toast({
        title: "DATEV-Export erfolgreich",
        description: "Die Buchungsdaten wurden erfolgreich im DATEV-Format exportiert.",
      });
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: "Beim Export der Buchungsdaten ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
      console.error("DATEV export error:", error);
    }
  };

  const handleExportAudit = async () => {
    try {
      await exportForAudit();
      toast({
        title: "Prüfer-Export erfolgreich",
        description: "Die Daten wurden erfolgreich im DSFinV-BF-Format exportiert.",
      });
    } catch (error) {
      toast({
        title: "Export fehlgeschlagen",
        description: "Beim Export der Prüfdaten ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
      console.error("Audit export error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            Einkaufsliste
          </h1>
          <p className="text-muted-foreground">
            Erfassen und verwalten Sie Einkäufe gemäß GoBD, AO, HGB und UStG
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleExportDatev} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            DATEV-Export
          </Button>
          <Button 
            onClick={handleExportAudit} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <FileBarChart className="h-4 w-4" />
            DSFinV-BF-Export
          </Button>
        </div>
      </div>

      <Tabs 
        defaultValue="list" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "list" | "upload")}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Einkaufsliste</TabsTrigger>
            <TabsTrigger value="upload">Beleg erfassen</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter</CardTitle>
              <CardDescription>
                Eingrenzen der angezeigten Einkäufe nach verschiedenen Kriterien
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseFilters filters={filters} setFilters={setFilters} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Einkaufsliste</CardTitle>
              <CardDescription>
                Alle erfassten Einkäufe mit GoBD-Konformitätsstatus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseListTable 
                items={items} 
                isLoading={isLoading} 
                error={error} 
                onRefresh={refresh}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Neuen Beleg erfassen</CardTitle>
              <CardDescription>
                Laden Sie einen neuen Beleg hoch oder erfassen Sie die Daten manuell
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseUploader onSuccess={() => {
                setActiveTab("list");
                refresh();
                toast({
                  title: "Beleg erfolgreich erfasst",
                  description: "Der Beleg wurde erfolgreich hochgeladen und verarbeitet.",
                });
              }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
