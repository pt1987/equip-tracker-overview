
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
import BudgetUsageCard from "@/components/dashboard/BudgetUsageCard";
import DraggableGrid from "@/components/dashboard/DraggableGrid";

// Track if dashboard has been rendered once to avoid unnecessary rerenders
let dashboardRendered = false;

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
  
  // Log only on first render
  useEffect(() => {
    if (!dashboardRendered) {
      console.log("Dashboard page mounted for the first time");
      dashboardRendered = true;
    }
    
    // Cleanup function runs when component unmounts
    return () => {
      console.log("Dashboard component unmounted");
    };
  }, []);
  
  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col gap-4 p-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="text-muted-foreground">Lade Dashboard-Daten...</div>
        </div>
      </PageTransition>
    );
  }
  
  const dashboardItems = [
    {
      id: "asset-distribution",
      content: <AssetDistributionChart assetTypeDistribution={assetTypeDistribution} />,
      defaultSize: { w: 2, h: 1 }
    },
    {
      id: "warranty-expiry",
      content: <WarrantyExpiryCard />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "external-returns",
      content: <ExternalReturnsCard />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "status-changes",
      content: <StatusChangesCard />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "employee-changes",
      content: <EmployeeChangesCard />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "asset-status",
      content: <AssetStatusCard assetStatusDistribution={assetStatusDistribution} />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "recent-assets",
      content: <RecentAssetsList recentAssets={recentAssets} />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "recent-employees",
      content: <RecentEmployeesList recentEmployees={recentEmployees} />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "external-assets",
      content: <ExternalAssetsCard ownerCompanyDistribution={ownerCompanyDistribution} />,
      defaultSize: { w: 1, h: 1 }
    },
    {
      id: "budget-usage",
      content: <BudgetUsageCard dashboardStats={dashboardStats} />,
      defaultSize: { w: 1, h: 1 }
    }
  ];
  
  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6">
        <DashboardHeader dashboardStats={dashboardStats} />
        <DraggableGrid items={dashboardItems} />
      </div>
    </PageTransition>
  );
};

export default IndexPage;
