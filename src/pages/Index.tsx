
import { useEffect, useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BudgetUsageCard from "@/components/dashboard/BudgetUsageCard";
import AssetDistributionChart from "@/components/dashboard/AssetDistributionChart";
import AssetStatusCard from "@/components/dashboard/AssetStatusCard";
import RecentAssetsList from "@/components/dashboard/RecentAssetsList";
import RecentEmployeesList from "@/components/dashboard/RecentEmployeesList";

const IndexPage = () => {
  const {
    loading,
    dashboardStats,
    assetTypeDistribution,
    assetStatusDistribution,
    recentAssets,
    recentEmployees
  } = useDashboardData();
  
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
      <div className="flex flex-col gap-6 p-6">
        <DashboardHeader dashboardStats={dashboardStats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetUsageCard dashboardStats={dashboardStats} />
          <AssetDistributionChart assetTypeDistribution={assetTypeDistribution} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AssetStatusCard assetStatusDistribution={assetStatusDistribution} />
          <RecentAssetsList recentAssets={recentAssets} />
          <RecentEmployeesList recentEmployees={recentEmployees} />
        </div>
      </div>
    </PageTransition>
  );
};

export default IndexPage;
