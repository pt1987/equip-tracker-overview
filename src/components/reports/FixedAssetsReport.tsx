
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAssets } from "@/data/assets";
import { isFixedAsset, isGWG, calculateAssetBookValue } from "@/lib/depreciation-utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Asset } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function FixedAssetsReport() {
  // Add state for pagination
  const [fixedAssetsPage, setFixedAssetsPage] = useState(1);
  const [gwgAssetsPage, setGwgAssetsPage] = useState(1);
  const itemsPerPage = 10;

  const { data: assets = [], isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: getAssets
  });

  // Process assets data
  const fixedAssets = assets.filter(asset => isFixedAsset(asset));
  const gwgAssets = assets.filter(asset => isGWG(asset));
  
  const totalAssets = assets.length;
  const fixedAssetCount = fixedAssets.length;
  const gwgAssetCount = gwgAssets.length;
  const otherAssetCount = totalAssets - fixedAssetCount - gwgAssetCount;
  
  // Calculate total values
  const fixedAssetValue = fixedAssets.reduce((sum, asset) => sum + (asset.netPurchasePrice || asset.price / 1.19), 0);
  const gwgValue = gwgAssets.reduce((sum, asset) => sum + (asset.netPurchasePrice || asset.price / 1.19), 0);
  
  // Calculate current book values
  const currentFixedAssetValue = fixedAssets.reduce((sum, asset) => {
    const bookValue = calculateAssetBookValue(asset);
    return sum + bookValue.currentBookValue;
  }, 0);
  
  // Calculate depreciation amount
  const totalDepreciationAmount = fixedAssetValue - currentFixedAssetValue;
  
  // Data for asset distribution chart (count)
  const assetDistributionData = [
    { name: "Anlagevermögen", value: fixedAssetCount },
    { name: "GWG", value: gwgAssetCount },
    { name: "Sonstige", value: otherAssetCount }
  ];
  
  // Data for asset value distribution chart
  const assetValueData = [
    { name: "Anlagevermögen", value: fixedAssetValue },
    { name: "GWG", value: gwgValue }
  ];
  
  // Data for fixed assets by category
  const fixedAssetsByCategory = fixedAssets.reduce((acc, asset) => {
    const category = asset.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);
  
  const fixedAssetsByCategoryData = Object.entries(fixedAssetsByCategory).map(
    ([category, count]) => ({ category, count })
  );
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Helper function to format numbers with German thousands separator
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE').format(num);
  };

  // Calculate total pages for pagination
  const totalFixedAssetPages = Math.ceil(fixedAssets.length / itemsPerPage);
  const totalGwgAssetPages = Math.ceil(gwgAssets.length / itemsPerPage);

  // Get paginated assets
  const paginatedFixedAssets = fixedAssets.slice(
    (fixedAssetsPage - 1) * itemsPerPage, 
    fixedAssetsPage * itemsPerPage
  );
  
  const paginatedGwgAssets = gwgAssets.slice(
    (gwgAssetsPage - 1) * itemsPerPage, 
    gwgAssetsPage * itemsPerPage
  );
  
  // Helper function to generate pagination items
  const generatePaginationItems = (currentPage: number, totalPages: number, setPage: (page: number) => void) => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => setPage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i <= 1 || i >= totalPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => setPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Lade Daten...</p>
    </div>;
  }
  
  if (error) {
    return <div className="bg-red-50 p-4 rounded-md">
      <p className="text-red-600">Fehler beim Laden der Daten</p>
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm text-muted-foreground mb-1">Anlagevermögen</h3>
          <p className="text-2xl font-bold">{formatNumber(fixedAssetCount)}</p>
          <p className="text-xs text-muted-foreground mt-1">von {formatNumber(totalAssets)} Assets</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm text-muted-foreground mb-1">GWG</h3>
          <p className="text-2xl font-bold">{formatNumber(gwgAssetCount)}</p>
          <p className="text-xs text-muted-foreground mt-1">von {formatNumber(totalAssets)} Assets</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm text-muted-foreground mb-1">Anschaffungswert (netto)</h3>
          <p className="text-2xl font-bold">{formatCurrency(fixedAssetValue + gwgValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">Gesamtwert aller Assets</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <h3 className="text-sm text-muted-foreground mb-1">Aktueller Buchwert</h3>
          <p className="text-2xl font-bold">{formatCurrency(currentFixedAssetValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">Gesamt-AfA: {formatCurrency(totalDepreciationAmount)}</p>
        </div>
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium mb-4">Asset-Verteilung</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {assetDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <h3 className="font-medium mb-4">Anlagevermögen nach Kategorie</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fixedAssetsByCategoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Bar dataKey="count" fill="#0088FE" name="Anzahl" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Asset Tables */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
          <h3 className="font-medium p-4 border-b">Anlagevermögen ({fixedAssetCount})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Kategorie</th>
                  <th className="text-left p-3">Anschaffung</th>
                  <th className="text-right p-3">AW (netto)</th>
                  <th className="text-right p-3">Buchwert</th>
                  <th className="text-right p-3">AfA %</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFixedAssets.map(asset => {
                  const bookValue = calculateAssetBookValue(asset);
                  const netPrice = asset.netPurchasePrice || asset.price / 1.19;
                  return (
                    <tr key={asset.id} className="border-t hover:bg-muted/20">
                      <td className="p-3">
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.manufacturer} {asset.model}</div>
                      </td>
                      <td className="p-3">{asset.category}</td>
                      <td className="p-3">{formatDate(asset.purchaseDate)}</td>
                      <td className="p-3 text-right">{formatCurrency(netPrice)}</td>
                      <td className="p-3 text-right">{formatCurrency(bookValue.currentBookValue)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, bookValue.depreciationPercentage)}%` }}
                            />
                          </div>
                          <span className="text-xs">{Math.round(bookValue.depreciationPercentage)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {fixedAssets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center">
                      <span className="text-muted-foreground">Keine Anlagegüter gefunden</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Add pagination for fixed assets */}
          {fixedAssets.length > 0 && (
            <div className="py-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setFixedAssetsPage(p => Math.max(1, p - 1))}
                      className={fixedAssetsPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {generatePaginationItems(fixedAssetsPage, totalFixedAssetPages, setFixedAssetsPage)}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setFixedAssetsPage(p => Math.min(totalFixedAssetPages, p + 1))}
                      className={fixedAssetsPage === totalFixedAssetPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
          <h3 className="font-medium p-4 border-b">Geringwertige Wirtschaftsgüter ({gwgAssetCount})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Kategorie</th>
                  <th className="text-left p-3">Anschaffung</th>
                  <th className="text-right p-3">Wert (netto)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGwgAssets.map(asset => {
                  const netPrice = asset.netPurchasePrice || asset.price / 1.19;
                  return (
                    <tr key={asset.id} className="border-t hover:bg-muted/20">
                      <td className="p-3">
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{asset.manufacturer} {asset.model}</div>
                      </td>
                      <td className="p-3">{asset.category}</td>
                      <td className="p-3">{formatDate(asset.purchaseDate)}</td>
                      <td className="p-3 text-right">{formatCurrency(netPrice)}</td>
                    </tr>
                  );
                })}
                
                {gwgAssets.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center">
                      <span className="text-muted-foreground">Keine GWG gefunden</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Add pagination for GWG assets */}
          {gwgAssets.length > 0 && (
            <div className="py-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setGwgAssetsPage(p => Math.max(1, p - 1))}
                      className={gwgAssetsPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {generatePaginationItems(gwgAssetsPage, totalGwgAssetPages, setGwgAssetsPage)}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setGwgAssetsPage(p => Math.min(totalGwgAssetPages, p + 1))}
                      className={gwgAssetsPage === totalGwgAssetPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
