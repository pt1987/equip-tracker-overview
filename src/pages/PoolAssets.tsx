
import { useQuery } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchFilter from "@/components/shared/SearchFilter";
import { useState } from "react";
import { mockAssets } from "@/data/mockData";
import { AssetCard } from "@/components/assets/AssetCard";
import { Asset } from "@/lib/types";

export default function PoolAssets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: () => mockAssets,
    initialData: mockAssets,
  });

  // Filter assets with status "pool"
  const poolAssets = assets.filter(asset => 
    asset.status === "pool" && 
    (activeCategory === "all" || asset.category === activeCategory) &&
    (
      asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Get unique categories from pool assets
  const assetCategories = Array.from(new Set(
    assets.filter(asset => asset.status === "pool").map(asset => asset.category)
  ));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <PageTransition>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Pool Assets</h1>
                <p className="text-muted-foreground">
                  Verwaltung von nicht zugewiesenen Geräten
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <SearchFilter 
                  onSearch={handleSearch} 
                  placeholder="Assets durchsuchen..." 
                />
                <Button>
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
                  {assetCategories.map(category => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeCategory} className="mt-0">
                  {poolAssets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {poolAssets.map((asset: Asset) => (
                        <AssetCard key={asset.id} asset={asset} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/40 rounded-lg">
                      <p className="text-muted-foreground">Keine Pool-Assets gefunden</p>
                      <Button variant="outline" className="mt-4">
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
      </div>
    </div>
  );
}
