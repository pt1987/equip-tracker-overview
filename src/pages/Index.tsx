
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
          <div className="p-6 space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse border">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
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
        
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Asset Type Distribution */}
              <ModernWidget 
                title="Asset-Typen"
                subtitle="Verteilung nach Kategorien"
                icon={Package}
                className="lg:col-span-1"
              >
                <div className="h-80">
                  <ModernPieChart data={assetTypeChartData} height={320} />
                </div>
              </ModernWidget>

              {/* Asset Status Distribution */}
              <ModernWidget 
                title="Asset Status"
                subtitle="Aktuelle Verteilung"
                icon={TrendingUp}
                className="lg:col-span-1"
              >
                <div className="h-80">
                  <ModernDonutChart 
                    data={assetStatusChartData} 
                    centerLabel="Total"
                    centerValue={actualTotal.toString()}
                    height={320}
                  />
                </div>
              </ModernWidget>
            </div>

            {/* Budget and Monthly Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Budget Overview */}
              <ModernWidget 
                title="Budget Übersicht"
                subtitle="Aktuelle Nutzung"
                icon={DollarSign}
                className="lg:col-span-1"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gesamtbudget</span>
                    <span className="text-lg font-bold">€{dashboardStats.totalBudget?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verwendet</span>
                    <span className="text-lg font-bold text-emerald-600">€{dashboardStats.totalBudgetUsed?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-4 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.min(100, (dashboardStats.totalBudgetUsed / dashboardStats.totalBudget) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {Math.round((dashboardStats.totalBudgetUsed / dashboardStats.totalBudget) * 100)}%
                    </span>
                    <p className="text-sm text-gray-500">Budget genutzt</p>
                  </div>
                </div>
              </ModernWidget>

              {/* Monthly Trends */}
              <ModernWidget 
                title="Monatliche Entwicklung"
                subtitle="Assets und Mitarbeiter Trend"
                icon={TrendingUp}
                className="lg:col-span-2"
              >
                <div className="h-80">
                  <ModernBarChart 
                    data={monthlyData} 
                    dataKeys={barChartKeys}
                    height={320}
                  />
                </div>
              </ModernWidget>
            </div>

            {/* Recent Assets Table */}
            <ModernWidget 
              title="Neueste Assets"
              subtitle="Zuletzt hinzugefügte Assets"
              icon={Package}
            >
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Asset Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Typ</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-900 hidden md:table-cell">Kaufdatum</th>
                        <th className="text-right py-4 px-4 font-semibold text-gray-900">Preis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAssets.slice(0, 5).map((asset) => (
                        <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{asset.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {asset.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              asset.status === 'in_use' ? 'bg-green-100 text-green-800' :
                              asset.status === 'pool' ? 'bg-yellow-100 text-yellow-800' : 
                              asset.status === 'defective' ? 'bg-red-100 text-red-800' :
                              asset.status === 'available' ? 'bg-blue-100 text-blue-800' :
                              asset.status === 'maintenance' ? 'bg-orange-100 text-orange-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {asset.status === 'in_use' ? 'Zugewiesen' :
                               asset.status === 'pool' ? 'Pool' :
                               asset.status === 'defective' ? 'Defekt' :
                               asset.status === 'available' ? 'Verfügbar' :
                               asset.status === 'maintenance' ? 'Wartung' : asset.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-500 hidden md:table-cell">
                            {new Date(asset.purchaseDate).toLocaleDateString('de-DE')}
                          </td>
                          <td className="py-4 px-4 text-right font-semibold text-gray-900">
                            €{asset.price.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ModernWidget>
          </div>
        </div>
      </ModernDashboardLayout>
    </PageTransition>
  );
};

export default IndexPage;
