
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { 
  getDashboardStats
} from "@/data/helpers";
import { 
  getAssetStatusPercentages,
  getAssetTypeDistribution,
  getAssetStatusDistribution,
  getTotalAssetCount 
} from "@/data/assets/stats";
import { getAssets } from "@/data/assets";
import { getEmployees } from "@/data/employees";
import { Asset, AssetType, AssetStatus } from "@/lib/types";

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
    }
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats
  });
  
  // Get asset type distribution
  const {
    data: assetTypeDistribution = []
  } = useQuery({
    queryKey: ["assetTypeDistribution"],
    queryFn: getAssetTypeDistribution
  });
  
  // Get asset status distribution
  const {
    data: assetStatusDistribution = []
  } = useQuery({
    queryKey: ["assetStatusDistribution"],
    queryFn: getAssetStatusDistribution
  });
  
  // Get recent assets
  const {
    data: recentAssets = []
  } = useQuery({
    queryKey: ["recentAssets"],
    queryFn: () => getRecentAssets(5)
  });
  
  // Get recent employees
  const {
    data: recentEmployees = []
  } = useQuery({
    queryKey: ["recentEmployees"],
    queryFn: () => getRecentEmployees(5)
  });
  
  // Get asset status percentages
  const {
    data: statusPercentages = {}
  } = useQuery({
    queryKey: ["assetStatusPercentages"],
    queryFn: getAssetStatusPercentages,
    meta: {
      onError: (error: Error) => {
        console.error("Failed to fetch asset percentages:", error);
        toast({
          title: "Fehler",
          description: "Prozentdaten konnten nicht geladen werden.",
          variant: "destructive"
        });
      }
    }
  });
  
  // Get total asset count
  const {
    data: totalAssetCount = 0
  } = useQuery({
    queryKey: ["totalAssetCount"],
    queryFn: getTotalAssetCount
  });
  
  useEffect(() => {
    if (dashboardStats && assetTypeDistribution && assetStatusDistribution) {
      setLoading(false);
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
    totalAssetCount
  };
};
