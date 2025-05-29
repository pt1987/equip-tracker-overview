
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
    return () => {
      console.log("Modern Dashboard unmounted");
    };
  }, []);
  
  if (loading) {
    return (
      <PageTransition>
        <ModernDashboardLayout>
          <ModernDashboardHeader />
          <div className="dashboard-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="dashboard-widget animate-pulse">
                <div className="h-6 sm:h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-24 sm:h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </ModernDashboardLayout>
      </PageTransition>
    );
  }

  // Prepare chart data
  const assetTypeChartData = assetTypeDistribution.map(item => ({
    name: item.type === 'laptop' ? 'Laptops' : 
          item.type === 'smartphone' ? 'Smartphones' : 
          item.type === 'tablet' ? 'Tablets' : 
          item.type === 'mouse' ? 'Mäuse' :
          item.type === 'keyboard' ? 'Tastaturen' : 'Zubehör',
    value: item.count
  }));

  const assetStatusChartData = assetStatusDistribution.map(item => ({
    name: item.status === 'in_use' ? 'Zugewiesen' :
          item.status === 'pool' ? 'Pool' :
          item.status === 'defective' ? 'Defekt' : 'Sonstiges',
    value: item.count
  }));

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
        
        <div className="dashboard-grid">
          {/* Stat Cards */}
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

          {/* Asset Type Distribution */}
          <ModernWidget 
            title="Asset-Typen"
            subtitle="Übersicht aller Kategorien"
            icon={Package}
            className="col-span-1"
            headerAction={
              <Button variant="outline" size="sm" className="dashboard-button-secondary text-xs">
                Details
              </Button>
            }
          >
            <ModernPieChart data={assetTypeChartData} height={isMobile ? 200 : 250} />
          </ModernWidget>

          {/* Asset Status Distribution */}
          <ModernWidget 
            title="Asset Status"
            subtitle="Aktuelle Verteilung"
            icon={TrendingUp}
            className="col-span-1"
          >
            <ModernDonutChart 
              data={assetStatusChartData} 
              centerLabel="Total"
              centerValue={dashboardStats.totalAssets.toString()}
              height={isMobile ? 200 : 250}
            />
          </ModernWidget>

          {/* Monthly Trends - Takes full width on mobile, 2 columns on larger screens */}
          <ModernWidget 
            title="Monatliche Entwicklung"
            subtitle="Assets und Mitarbeiter"
            icon={TrendingUp}
            className="col-span-2"
            headerAction={
              <div className="flex space-x-1 sm:space-x-2">
                <Button variant="outline" size="sm" className="dashboard-button-secondary text-xs">
                  Export
                </Button>
                <Button size="sm" className="dashboard-button text-xs">
                  Bericht
                </Button>
              </div>
            }
          >
            <ModernBarChart 
              data={monthlyData} 
              dataKeys={barChartKeys}
              height={isMobile ? 200 : 280}
            />
          </ModernWidget>

          {/* Budget Overview */}
          <ModernWidget 
            title="Budget"
            subtitle="Aktuelle Nutzung"
            icon={DollarSign}
            className="col-span-1"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Gesamtbudget</span>
                <span className="font-semibold text-sm sm:text-base">€{dashboardStats.totalBudget?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Verwendet</span>
                <span className="font-semibold text-green-600 text-sm sm:text-base">€{dashboardStats.totalBudgetUsed?.toLocaleString() || '0'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-gradient-to-r from-green-600 to-teal-500 h-2 sm:h-3 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, (dashboardStats.totalBudgetUsed / dashboardStats.totalBudget) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {Math.round((dashboardStats.totalBudgetUsed / dashboardStats.totalBudget) * 100)}% genutzt
              </div>
            </div>
          </ModernWidget>

          {/* Recent Assets Table */}
          <ModernWidget 
            title="Neueste Assets"
            subtitle="Zuletzt hinzugefügt"
            icon={Package}
            className="col-span-2"
          >
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Typ</th>
                    <th>Status</th>
                    <th>Kaufdatum</th>
                    <th>Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssets.slice(0, 5).map((asset) => (
                    <tr key={asset.id}>
                      <td data-label="Name" className="font-medium">{asset.name}</td>
                      <td data-label="Typ">
                        <span className="dashboard-status-badge dashboard-status-active">
                          {asset.type}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span className={`dashboard-status-badge ${
                          asset.status === 'in_use' ? 'dashboard-status-active' :
                          asset.status === 'pool' ? 'dashboard-status-warning' : 'dashboard-status-error'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td data-label="Kaufdatum">{new Date(asset.purchaseDate).toLocaleDateString('de-DE')}</td>
                      <td data-label="Preis" className="font-semibold">€{asset.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ModernWidget>
        </div>
      </ModernDashboardLayout>
    </PageTransition>
  );
};

export default IndexPage;
