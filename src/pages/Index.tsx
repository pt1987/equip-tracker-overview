
import { useEffect } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AssetDistributionChart from "@/components/dashboard/AssetDistributionChart";
import AssetStatusCard from "@/components/dashboard/AssetStatusCard";
import RecentAssetsList from "@/components/dashboard/RecentAssetsList";
import RecentEmployeesList from "@/components/dashboard/RecentEmployeesList";
import ExternalAssetsCard from "@/components/dashboard/ExternalAssetsCard";
import WarrantyExpiryCard from "@/components/dashboard/WarrantyExpiryCard";
import ExternalReturnsCard from "@/components/dashboard/ExternalReturnsCard";
import StatusChangesCard from "@/components/dashboard/StatusChangesCard";
import EmployeeChangesCard from "@/components/dashboard/EmployeeChangesCard";
import DraggableGrid from "@/components/dashboard/DraggableGrid";
import DashboardWidget from "@/components/dashboard/DashboardWidget";
import { DashboardLayoutProvider } from "@/hooks/useDashboardLayout";
import { CardHeader, CardTitle } from "@/components/ui/card";

const IndexPage = () => {
  const {
    loading,
    dashboardStats,
    assetTypeDistribution,
    assetStatusDistribution,
    recentAssets,
    recentEmployees,
    ownerCompanyDistribution
  } = useDashboardData();
  
  // Widget-Titel für die Verwendung im DraggableGrid
  const widgetHeaders: Record<string, string> = {
    assetDistribution: "Asset-Verteilung",
    warrantyExpiry: "Garantie-Ablauf",
    externalReturns: "Externe Assets (Rückgabe)",
    statusChanges: "Status-Änderungen",
    employeeChanges: "Mitarbeiterzuweisungen",
    assetStatus: "Asset-Status",
    recentAssets: "Neueste Assets",
    recentEmployees: "Neueste Mitarbeiter",
    externalAssets: "Externe Assets",
  };
  
  const renderWidgetHeader = (id: string) => {
    return <span className="font-medium">{widgetHeaders[id] || id}</span>;
  };
  
  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col gap-4 p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-muted-foreground">Loading dashboard data...</div>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <DashboardLayoutProvider>
        <div className="flex flex-col gap-6 p-6">
          {/* Dashboard Header bleibt fix außerhalb des Grids */}
          <DashboardHeader dashboardStats={dashboardStats} />
          
          {/* Draggable Grid für alle anderen Widgets */}
          <DraggableGrid renderWidgetHeader={renderWidgetHeader}>
            {/* Asset Distribution Chart */}
            <DashboardWidget id="assetDistribution">
              <AssetDistributionChart assetTypeDistribution={assetTypeDistribution} />
            </DashboardWidget>

            {/* Warranty Expiry Card */}
            <DashboardWidget id="warrantyExpiry">
              <WarrantyExpiryCard />
            </DashboardWidget>

            {/* External Returns Card */}
            <DashboardWidget id="externalReturns">
              <ExternalReturnsCard />
            </DashboardWidget>

            {/* Status Changes Card */}
            <DashboardWidget id="statusChanges">
              <StatusChangesCard />
            </DashboardWidget>

            {/* Employee Changes Card */}
            <DashboardWidget id="employeeChanges">
              <EmployeeChangesCard />
            </DashboardWidget>

            {/* Asset Status Card */}
            <DashboardWidget id="assetStatus">
              <AssetStatusCard assetStatusDistribution={assetStatusDistribution} />
            </DashboardWidget>

            {/* Recent Assets List */}
            <DashboardWidget id="recentAssets">
              <RecentAssetsList recentAssets={recentAssets} />
            </DashboardWidget>

            {/* Recent Employees List */}
            <DashboardWidget id="recentEmployees">
              <RecentEmployeesList recentEmployees={recentEmployees} />
            </DashboardWidget>

            {/* External Assets Card */}
            <DashboardWidget id="externalAssets">
              <ExternalAssetsCard ownerCompanyDistribution={ownerCompanyDistribution} />
            </DashboardWidget>
          </DraggableGrid>
        </div>
      </DashboardLayoutProvider>
    </PageTransition>
  );
};

export default IndexPage;
