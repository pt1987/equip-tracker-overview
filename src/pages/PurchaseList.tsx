
import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseListFilter } from "@/lib/purchase-list-types";
import PurchaseListTable from "@/components/purchase-list/PurchaseListTable";
import PurchaseUploader from "@/components/purchase-list/PurchaseUploader";
import PurchaseFilters from "@/components/purchase-list/PurchaseFilters";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileBarChart, Search } from "lucide-react";
import { usePurchaseItems } from "@/hooks/usePurchaseItems";
import SearchFilter from "@/components/shared/SearchFilter";

export default function PurchaseList() {
  // Use useMemo for initial state values
  const [activeTab, setActiveTab] = useState<"list" | "upload">("list");
  const [filters, setFilters] = useState<PurchaseListFilter>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();
  
  // Combine filters and search term only when they change
  const searchFilters = useMemo(() => {
    return {...filters, searchTerm};
  }, [filters, searchTerm]);
  
  // Use the memoized filters in the hook
  const { 
    items, 
    isLoading, 
    error, 
    refresh,
    exportToDatev,
    exportForAudit
  } = usePurchaseItems(searchFilters);

  // These handlers should be stable between renders
  const handleExportDatev = useCallback(async () => {
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
  }, [exportToDatev, toast]);

  const handleExportAudit = useCallback(async () => {
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
  }, [exportForAudit, toast]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as "list" | "upload");
  }, []);

  const handleFilterChange = useCallback((newFilters: PurchaseListFilter) => {
    setFilters(newFilters);
  }, []);

  const handleUploaderSuccess = useCallback(() => {
    setActiveTab("list");
    refresh();
    toast({
      title: "Beleg erfolgreich erfasst",
      description: "Der Beleg wurde erfolgreich hochgeladen und verarbeitet.",
    });
  }, [refresh, toast]);

  // Memoize components to prevent unnecessary re-renders
  const filterSection = useMemo(() => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filter</CardTitle>
        <CardDescription>
          Eingrenzen der angezeigten Einkäufe nach verschiedenen Kriterien
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchFilter 
              placeholder="Suchbegriff eingeben..." 
              onSearch={handleSearch} 
              className="w-full md:w-1/3" 
            />
            <div className="flex items-center text-sm text-muted-foreground">
              <Search className="h-4 w-4 mr-2" />
              <span>Suche in Lieferanten, Artikelbeschreibungen und Rechnungsnummern</span>
            </div>
          </div>
          <PurchaseFilters filters={filters} setFilters={handleFilterChange} />
        </div>
      </CardContent>
    </Card>
  ), [filters, handleFilterChange, handleSearch]);

  const exportButtons = useMemo(() => (
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
  ), [handleExportAudit, handleExportDatev]);

  const purchaseListContent = useMemo(() => (
    <TabsContent value="list" className="space-y-4">
      {filterSection}

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
  ), [filterSection, items, isLoading, error, refresh]);

  const uploadContent = useMemo(() => (
    <TabsContent value="upload" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Neuen Beleg erfassen</CardTitle>
          <CardDescription>
            Laden Sie einen neuen Beleg hoch oder erfassen Sie die Daten manuell
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseUploader onSuccess={handleUploaderSuccess} />
        </CardContent>
      </Card>
    </TabsContent>
  ), [handleUploaderSuccess]);

  // Return a stable structure for the component
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
        
        {exportButtons}
      </div>

      <Tabs 
        defaultValue="list" 
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Einkaufsliste</TabsTrigger>
            <TabsTrigger value="upload">Beleg erfassen</TabsTrigger>
          </TabsList>
        </div>

        {purchaseListContent}
        {uploadContent}
      </Tabs>
    </div>
  );
}
