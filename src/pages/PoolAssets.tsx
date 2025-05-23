
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilter from "@/components/shared/SearchFilter";
import { useState, useEffect } from "react";
import AssetCard from "@/components/assets/AssetCard";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getAssets } from "@/data/assets";

export default function PoolAssets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use the centralized getAssets function from data/assets.ts
  const { data: allAssets = [], isLoading, error } = useQuery({
    queryKey: ["all-assets"],
    queryFn: async () => {
      console.log("Fetching all assets for pool filtering...");
      try {
        const assets = await getAssets();
        console.log(`Successfully retrieved ${assets.length} total assets`);
        return assets;
      } catch (error) {
        console.error("Error fetching assets:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Laden der Assets",
          description: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten"
        });
        throw error;
      }
    },
  });

  // Filter only pool assets
  const poolAssets = allAssets.filter(asset => asset.status === 'pool');

  useEffect(() => {
    if (poolAssets && poolAssets.length) {
      console.log("Pool assets filtered:", poolAssets.length);
    }
  }, [poolAssets]);

  // Get unique categories from pool assets
  const assetCategories = Array.from(new Set(
    poolAssets.map(asset => asset.category)
  ));

  // Filter assets based on search and category
  const filteredAssets = poolAssets.filter((asset: Asset) => 
    (activeCategory === "all" || asset.category === activeCategory) &&
    (
      asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddAsset = () => {
    navigate('/asset/create');
  };

  // Show more detailed error if one occurs
  if (error) {
    return (
      <PageTransition>
        <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
          <h1 className="text-3xl font-bold tracking-tight">Pool Assets</h1>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
            <h3 className="font-semibold mb-2">Fehler beim Laden der Assets</h3>
            <p>{error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten"}</p>
            <p className="mt-2 text-sm">Bitte stellen Sie sicher, dass Sie angemeldet sind und über die entsprechenden Berechtigungen verfügen.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pool Assets</h1>
            <p className="text-muted-foreground">
              Verwaltung von nicht zugewiesenen Geräten
              {poolAssets ? ` (${poolAssets.length} total)` : ''}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <SearchFilter 
              onSearch={handleSearch} 
              placeholder="Assets durchsuchen..." 
            />
            <Button onClick={handleAddAsset}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Asset hinzufügen
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Tabs 
            defaultValue="all" 
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="mb-4 flex flex-wrap h-auto">
              <TabsTrigger value="all">Alle</TabsTrigger>
              {assetCategories.map((category: string) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAssets.map((asset: Asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/40 rounded-lg">
                  <p className="text-muted-foreground">
                    {allAssets.length > 0 
                      ? "Keine Pool-Assets gefunden" 
                      : "Es sind keine Assets im System verfügbar"}
                  </p>
                  <Button variant="outline" className="mt-4" onClick={handleAddAsset}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Asset zum Pool hinzufügen
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
