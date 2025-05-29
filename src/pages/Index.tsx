
import { useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { useDashboardData } from "@/hooks/useDashboardData";
import ModernDashboardLayout from "@/components/dashboard/ModernDashboardLayout";
import ModernDashboardHeader from "@/components/dashboard/ModernDashboardHeader";
import ModernWidget from "@/components/dashboard/ModernWidget";
import ModernStatCard from "@/components/dashboard/ModernStatCard";
import ModernPieChart from "@/components/dashboard/charts/ModernPieChart";
import ModernDonutChart from "@/components/dashboard/charts/ModernDonutChart";
import ModernBarChart from "@/components/dashboard/charts/ModernBarChart";
import { Package, Users, Coins, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import "@/styles/dashboard-theme.css";

const IndexPage = () => {
  const {
    loading,
    dashboardStats,
    assetTypeDistribution,
    assetStatusDistribution,
    recentAssets,
    recentEmployees,
    ownerCompanyDistribution,
    refetchDashboardData
  } = useDashboardData();
  
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log("Modern Dashboard mounted");
    console.log("Dashboard stats:", dashboardStats);
    console.log("Asset status distribution:", assetStatusDistribution);
    return () => {
      console.log("Modern Dashboard unmounted");
    };
  }, [dashboardStats, assetStatusDistribution]);
  
  if (loading) {
    return (
      <PageTransition>
        <ModernDashboardLayout>
          <ModernDashboardHeader />
          <div className="p-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </ModernDashboardLayout>
      </PageTransition>
    );
  }

  // Prepare chart data with proper German labels
  const assetTypeChartData = assetTypeDistribution.map(item => ({
    name: item.type === 'laptop' ? 'Laptops' : 
          item.type === 'smartphone' ? 'Smartphones' : 
          item.type === 'tablet' ? 'Tablets' : 
          item.type === 'mouse' ? 'Mäuse' :
          item.type === 'keyboard' ? 'Tastaturen' : 'Zubehör',
    value: item.count
  }));

  // Fixed German labels for asset status
  const assetStatusChartData = assetStatusDistribution.map(item => ({
    name: item.status === 'in_use' ? 'Zugewiesen' :
          item.status === 'pool' ? 'Pool' :
          item.status === 'defective' ? 'Defekt' : 
          item.status === 'available' ? 'Verfügbar' :
          item.status === 'maintenance' ? 'Wartung' : 'Sonstiges',
    value: item.count
  }));

  // Calculate the actual total from the status distribution
  const actualTotal = assetStatusDistribution.reduce((sum, item) => sum + item.count, 0);

  const monthlyData = [
    { name: 'Jan', assets: 120, employees: 45 },
    { name: 'Feb', assets: 135, employees: 48 },
    { name: 'Mar', assets: 148, employees: 52 },
    { name: 'Apr', assets: 160, employees: 55 },
    { name: 'Mai', assets: 175, employees: 58 },
    { name: 'Jun', assets: 190, employees: 62 }
  ];

  const barChartKeys = [
    { key: 'assets', name: 'Assets', color: '#1a4d3a' },
    { key: 'employees', name: 'Mitarbeiter', color: '#20b2aa' }
  ];

  return (
    <PageTransition>
      <ModernDashboardLayout>
        <ModernDashboardHeader />
        
        <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {/* Stat Cards - Mobile Stack */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <ModernStatCard
              title="Gesamt Assets"
              value={dashboardStats.totalAssets}
              icon={Package}
              change={{ value: '+12%', trend: 'up' }}
            />
            
            <ModernStatCard
              title="Zugewiesene Assets"
              value={dashboardStats.assignedAssets}
              icon={Users}
              change={{ value: '+8%', trend: 'up' }}
            />
            
            <ModernStatCard
              title="Pool Assets"
              value={dashboardStats.poolAssets}
              icon={Coins}
              change={{ value: '-3%', trend: 'down' }}
            />
            
            <ModernStatCard
              title="Defekte Assets"
              value={dashboardStats.defectiveAssets}
              icon={AlertTriangle}
              change={{ value: '+2%', trend: 'up' }}
            />
          </div>

          {/* Charts Section - Mobile Friendly */}
          <div className="space-y-4 sm:space-y-6">
            {/* Asset Type Distribution */}
            <ModernWidget 
              title="Asset-Typen"
              subtitle="Übersicht aller Kategorien"
              icon={Package}
              headerAction={
                !isMobile && (
                  <Button variant="outline" size="sm" className="text-xs">
                    Details
                  </Button>
                )
              }
            >
              <div className="h-48 sm:h-64">
                <ModernPieChart data={assetTypeChartData} height={isMobile ? 192 : 240} />
              </div>
            </ModernWidget>

            {/* Asset Status Distribution */}
            <ModernWidget 
              title="Asset Status"
              subtitle="Aktuelle Verteilung"
              icon={TrendingUp}
            >
              <div className="h-48 sm:h-64">
                <ModernDonutChart 
                  data={assetStatusChartData} 
                  centerLabel="Total"
                  centerValue={actualTotal.toString()}
                  height={isMobile ? 192 : 240}
                />
              </div>
            </ModernWidget>

            {/* Budget Overview */}
            <ModernWidget 
              title="Budget"
              subtitle="Aktuelle Nutzung"
              icon={DollarSign}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Gesamtbudget</span>
                  <span className="font-semibold">€{dashboardStats.totalBudget?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verwendet</span>
                  <span className="font-semibold text-green-600">€{dashboardStats.totalBudgetUsed?.toLocaleString() || '0'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-teal-500 h-3 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(100, (dashboardStats.totalBudgetUsed / dashboardStats.totalBudget) * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {Math.round((dashboardStats.totalBudgetUsed / dashboardStats.totalBudget) * 100)}% genutzt
                </div>
              </div>
            </ModernWidget>

            {/* Monthly Trends */}
            <ModernWidget 
              title="Monatliche Entwicklung"
              subtitle="Assets und Mitarbeiter"
              icon={TrendingUp}
              headerAction={
                !isMobile && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Export
                    </Button>
                    <Button size="sm" className="text-xs">
                      Bericht
                    </Button>
                  </div>
                )
              }
            >
              <div className="h-48 sm:h-64">
                <ModernBarChart 
                  data={monthlyData} 
                  dataKeys={barChartKeys}
                  height={isMobile ? 192 : 240}
                />
              </div>
            </ModernWidget>

            {/* Recent Assets Table */}
            <ModernWidget 
              title="Neueste Assets"
              subtitle="Zuletzt hinzugefügt"
              icon={Package}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 sm:p-3 font-medium text-xs sm:text-sm">Name</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-xs sm:text-sm">Typ</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-xs sm:text-sm">Status</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-xs sm:text-sm hidden sm:table-cell">Kaufdatum</th>
                      <th className="text-left p-2 sm:p-3 font-medium text-xs sm:text-sm">Preis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAssets.slice(0, 5).map((asset) => (
                      <tr key={asset.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">{asset.name}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {asset.type}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            asset.status === 'in_use' ? 'bg-green-100 text-green-800' :
                            asset.status === 'pool' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {asset.status === 'in_use' ? 'Zugewiesen' :
                             asset.status === 'pool' ? 'Pool' :
                             asset.status === 'defective' ? 'Defekt' :
                             asset.status === 'available' ? 'Verfügbar' :
                             asset.status === 'maintenance' ? 'Wartung' : asset.status}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">{new Date(asset.purchaseDate).toLocaleDateString('de-DE')}</td>
                        <td className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">€{asset.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernWidget>
          </div>
        </div>
      </ModernDashboardLayout>
    </PageTransition>
  );
};

export default IndexPage;
