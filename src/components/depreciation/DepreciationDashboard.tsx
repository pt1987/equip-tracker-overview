
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAssets } from "@/data/assets";
import { Asset } from "@/lib/types";
import { calculateAssetBookValue, isFixedAsset, isGWG } from "@/lib/depreciation-utils";
import { formatCurrency } from "@/lib/utils";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DepreciationDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "list" | "yearly">("dashboard");
  
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });
  
  // Process assets for depreciation data
  const processedAssets = assets.map(asset => {
    const bookValue = calculateAssetBookValue(asset);
    return {
      ...asset,
      bookValue: bookValue.currentBookValue,
      originalValue: bookValue.originalValue,
      depreciationAmount: bookValue.originalValue - bookValue.currentBookValue,
      depreciationPercentage: bookValue.depreciationPercentage,
      isFixedAsset: isFixedAsset(asset),
      isGWG: isGWG(asset)
    };
  });
  
  // Fixed assets (Anlagevermögen)
  const fixedAssets = processedAssets.filter(asset => asset.isFixedAsset);
  
  // GWG assets
  const gwgAssets = processedAssets.filter(asset => asset.isGWG);
  
  // Calculate totals
  const totalOriginalValue = fixedAssets.reduce((sum, asset) => sum + asset.originalValue, 0);
  const totalCurrentValue = fixedAssets.reduce((sum, asset) => sum + asset.bookValue, 0);
  const totalDepreciation = totalOriginalValue - totalCurrentValue;
  
  // Data for asset type distribution chart
  const assetTypeData = Object.entries(
    fixedAssets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + asset.originalValue;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, value]) => ({
    name: type,
    value
  }));
  
  // Data for yearly depreciation chart
  const currentYear = new Date().getFullYear();
  const yearlyDepreciation = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear + i;
    const amount = fixedAssets.reduce((sum, asset) => {
      const bookValue = calculateAssetBookValue(asset);
      if (bookValue.remainingMonths > i * 12) {
        return sum + Math.min(bookValue.annualDepreciation, bookValue.currentBookValue);
      }
      return sum;
    }, 0);
    
    return {
      year,
      amount
    };
  });
  
  // Colors for chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Lade Abschreibungsdaten...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="list">Anlagevermögensliste</TabsTrigger>
          <TabsTrigger value="yearly">Jährliche Abschreibung</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Anschaffungswert</CardTitle>
                <CardDescription>Gesamt (netto)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totalOriginalValue)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Aktueller Buchwert</CardTitle>
                <CardDescription>Gesamt</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Abschreibungssumme</CardTitle>
                <CardDescription>Bisher</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(totalDepreciation)}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Verteilung nach Assettyp</CardTitle>
                <CardDescription>Anschaffungswerte (netto)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col">
                <ChartContainer 
                  className="w-full h-full" 
                  config={{
                    laptop: { color: COLORS[0] },
                    smartphone: { color: COLORS[1] },
                    tablet: { color: COLORS[2] },
                    mouse: { color: COLORS[3] },
                    keyboard: { color: COLORS[4] },
                    accessory: { color: '#A05195' }
                  }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={assetTypeData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Bar dataKey="value" name="Wert">
                        {assetTypeData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <ChartLegend>
                  <ChartLegendContent
                    className="flex flex-wrap justify-center gap-4"
                    payload={assetTypeData.map((item, index) => ({
                      value: item.name,
                      color: COLORS[index % COLORS.length]
                    }))}
                  />
                </ChartLegend>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Jährliche Abschreibungen</CardTitle>
                <CardDescription>Prognose für die nächsten 5 Jahre</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer 
                  className="w-full h-full" 
                  config={{
                    amount: { color: '#0088FE' }
                  }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={yearlyDepreciation}>
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Bar dataKey="amount" name="AfA" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>GWG - Geringwertige Wirtschaftsgüter</CardTitle>
              <CardDescription>Assets mit einem Anschaffungswert unter 800€ netto</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Gesamtwert: <strong>{formatCurrency(gwgAssets.reduce((sum, asset) => sum + asset.originalValue, 0))}</strong>
                <span className="ml-2 text-sm text-muted-foreground">({gwgAssets.length} Assets)</span>
              </p>
              {gwgAssets.length > 0 ? (
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {gwgAssets.map(asset => (
                      <div key={asset.id} className="p-3 bg-muted/50 rounded-lg flex justify-between">
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-sm text-muted-foreground">{asset.manufacturer} {asset.model}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(asset.originalValue)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(asset.purchaseDate).toLocaleDateString('de-DE')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-8">Keine GWG gefunden</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Anlagevermögen</CardTitle>
              <CardDescription>Übersicht aller Assets mit Anschaffungswert über 800€ netto</CardDescription>
            </CardHeader>
            <CardContent>
              {fixedAssets.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Asset</th>
                        <th className="text-left py-3 px-4">Kaufdatum</th>
                        <th className="text-right py-3 px-4">AW (netto)</th>
                        <th className="text-right py-3 px-4">Buchwert</th>
                        <th className="text-right py-3 px-4">AfA p.a.</th>
                        <th className="text-right py-3 px-4">Abschreibung</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fixedAssets.map(asset => (
                        <tr key={asset.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">{asset.serialNumber || '-'}</p>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(asset.purchaseDate).toLocaleDateString('de-DE')}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {formatCurrency(asset.originalValue)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {formatCurrency(asset.bookValue)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {formatCurrency(calculateAssetBookValue(asset).annualDepreciation)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${Math.min(100, asset.depreciationPercentage)}%` }}
                                />
                              </div>
                              <span className="text-xs">{Math.round(asset.depreciationPercentage)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Keine Anlagegüter gefunden</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="yearly">
          <Card>
            <CardHeader>
              <CardTitle>Jährliche Abschreibungsübersicht</CardTitle>
              <CardDescription>Nach Jahren gruppierte AfA-Beträge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="h-[300px]">
                  <ChartContainer 
                    className="w-full h-full" 
                    config={{
                      amount: { color: '#0088FE' }
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={yearlyDepreciation}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => formatCurrency(value)} />
                        <Bar dataKey="amount" name="AfA" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Abschreibungsprognose</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Jahr</th>
                        <th className="text-right py-3 px-4">AfA Betrag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyDepreciation.map(item => (
                        <tr key={item.year} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{item.year}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      <tr className="border-b bg-muted/50 font-bold">
                        <td className="py-3 px-4">Gesamt</td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(yearlyDepreciation.reduce((sum, item) => sum + item.amount, 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
