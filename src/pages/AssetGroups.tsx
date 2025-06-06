
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/data/assets";
import { Asset } from "@/lib/types";
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilter from "@/components/shared/SearchFilter";

export default function AssetGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("category");
  
  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets,
  });

  const groupBy = <T extends Record<string, any>>(array: T[], key: keyof T | ((item: T) => string)) => {
    return array.reduce((result: Record<string, T[]>, currentValue: T) => {
      const groupKey = typeof key === 'function' ? key(currentValue) : String(currentValue[key]);
      result[groupKey] = result[groupKey] || [];
      result[groupKey].push(currentValue);
      return result;
    }, {});
  };

  const assetsByCategory = groupBy(assets, (asset: Asset) => asset.category);
  const assetsByManufacturer = groupBy(assets, (asset: Asset) => asset.manufacturer);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  const renderGroups = (groups: Record<string, Asset[]>) => {
    return Object.entries(groups)
      .filter(([groupName]) => groupName.toLowerCase().includes(searchQuery))
      .map(([groupName, groupAssets]) => (
        <Card key={groupName} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Folder className="h-6 w-6 text-primary" />
                {groupName}
              </CardTitle>
              <span className="text-muted-foreground text-sm bg-secondary rounded-full px-3 py-1">
                {groupAssets.length}
              </span>
            </div>
            <CardDescription>
              {activeTab === "category" 
                ? `Alle ${groupName}-Geräte` 
                : `Alle Geräte von ${groupName}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {groupAssets.slice(0, 5).map((asset: Asset) => (
                <span key={asset.id} className="bg-secondary/50 text-xs px-2 py-1 rounded">
                  {asset.model}
                </span>
              ))}
              {groupAssets.length > 5 && (
                <span className="bg-secondary/50 text-xs px-2 py-1 rounded">
                  +{groupAssets.length - 5} weitere
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ));
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Gruppen</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Assets nach Kategorien und Herstellern
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Neue Gruppe
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Tabs 
              defaultValue="category" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="category">Nach Kategorie</TabsTrigger>
                <TabsTrigger value="manufacturer">Nach Hersteller</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-full md:w-auto md:ml-auto">
              <SearchFilter 
                onSearch={handleSearch} 
                placeholder="Gruppen durchsuchen..." 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <TabsContent value="category" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0 w-full">
              {renderGroups(assetsByCategory)}
            </TabsContent>
            <TabsContent value="manufacturer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0 w-full">
              {renderGroups(assetsByManufacturer)}
            </TabsContent>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
