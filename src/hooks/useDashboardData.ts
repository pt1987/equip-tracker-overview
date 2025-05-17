
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  getDashboardStats
} from "@/data/helpers";
import { 
  getAssetStatusPercentages,
  getAssetTypeDistribution,
  getAssetStatusDistribution,
  getTotalAssetCount,
  getOwnerCompanyDistribution
} from "@/data/assets/stats";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";

// Track if dashboard data has been loaded to avoid unnecessary notifications
let dataLoaded = false;

// Helper functions moved from Index.tsx
const getRecentAssets = async (limit = 5) => {
  const assets = await getAssets();
  return assets
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, limit);
};

const getRecentEmployees = async (limit = 5) => {
  const employees = await getEmployees();
  return employees
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, limit);
};

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  
  // Get dashboard stats
  const {
    data: dashboardStats = {
      totalAssets: 0,
      assignedAssets: 0,
      poolAssets: 0,
      defectiveAssets: 0,
      totalBudget: 0,
      totalBudgetUsed: 0
    },
    refetch: refetchDashboardStats
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,  // 10 minutes
  });
  
  // Get asset type distribution
  const {
    data: assetTypeDistribution = [],
    refetch: refetchAssetTypeDistribution
  } = useQuery({
    queryKey: ["assetTypeDistribution"],
    queryFn: getAssetTypeDistribution,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  // Get asset status distribution
  const {
    data: assetStatusDistribution = [],
    refetch: refetchAssetStatusDistribution
  } = useQuery({
    queryKey: ["assetStatusDistribution"],
    queryFn: getAssetStatusDistribution,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  // Get recent assets
  const {
    data: recentAssets = [],
    refetch: refetchRecentAssets
  } = useQuery({
    queryKey: ["recentAssets"],
    queryFn: () => getRecentAssets(5),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  // Get recent employees
  const {
    data: recentEmployees = [],
    refetch: refetchRecentEmployees
  } = useQuery({
    queryKey: ["recentEmployees"],
    queryFn: () => getRecentEmployees(5),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  // Get asset status percentages
  const {
    data: statusPercentages = {},
    refetch: refetchStatusPercentages
  } = useQuery({
    queryKey: ["assetStatusPercentages"],
    queryFn: getAssetStatusPercentages,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch asset percentages:", error);
        // Only show toast once
        if (dataLoaded) {
          toast({
            title: "Fehler",
            description: "Prozentdaten konnten nicht geladen werden.",
            variant: "destructive"
          });
        }
      }
    }
  });
  
  // Get total asset count
  const {
    data: totalAssetCount = 0,
    refetch: refetchTotalAssetCount
  } = useQuery({
    queryKey: ["totalAssetCount"],
    queryFn: getTotalAssetCount,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  // Get owner company distribution
  const {
    data: ownerCompanyDistribution = [],
    refetch: refetchOwnerCompanyDistribution
  } = useQuery({
    queryKey: ["ownerCompanyDistribution"],
    queryFn: getOwnerCompanyDistribution,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  // Function to refresh all data
  const refetchDashboardData = useCallback(() => {
    console.log("Refreshing all dashboard data");
    refetchDashboardStats();
    refetchAssetTypeDistribution();
    refetchAssetStatusDistribution();
    refetchRecentAssets();
    refetchRecentEmployees();
    refetchStatusPercentages();
    refetchTotalAssetCount();
    refetchOwnerCompanyDistribution();
  }, [
    refetchDashboardStats,
    refetchAssetTypeDistribution,
    refetchAssetStatusDistribution,
    refetchRecentAssets,
    refetchRecentEmployees,
    refetchStatusPercentages,
    refetchTotalAssetCount,
    refetchOwnerCompanyDistribution
  ]);
  
  useEffect(() => {
    if (dashboardStats && assetTypeDistribution && assetStatusDistribution) {
      setLoading(false);
      // Mark as loaded once we have data
      dataLoaded = true;
    }
  }, [dashboardStats, assetTypeDistribution, assetStatusDistribution]);
  
  return {
    loading,
    dashboardStats,
    assetTypeDistribution,
    assetStatusDistribution,
    recentAssets,
    recentEmployees,
    statusPercentages,
    totalAssetCount,
    ownerCompanyDistribution,
    refetchDashboardData
  };
};
