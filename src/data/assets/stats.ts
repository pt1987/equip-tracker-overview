
import { AssetType, AssetStatus, AssetTypeDistribution, AssetStatusDistribution } from "@/lib/types";
import { getAssets } from "./fetch";

// Function to get asset type distribution data
export const getAssetTypeDistribution = async (): Promise<AssetTypeDistribution[]> => {
  const assets = await getAssets();
  const typeCount: Record<string, number> = {};
  
  assets.forEach(asset => {
    if (!typeCount[asset.type]) {
      typeCount[asset.type] = 0;
    }
    typeCount[asset.type]++;
  });
  
  return Object.entries(typeCount).map(([type, count]) => ({
    type: type as AssetType,
    count
  }));
};

// Function to get asset status distribution data
export const getAssetStatusDistribution = async (): Promise<AssetStatusDistribution[]> => {
  const assets = await getAssets();
  const statusCount: Record<string, number> = {};
  
  assets.forEach(asset => {
    if (!statusCount[asset.status]) {
      statusCount[asset.status] = 0;
    }
    statusCount[asset.status]++;
  });
  
  return Object.entries(statusCount).map(([status, count]) => ({
    status: status as AssetStatus,
    count
  }));
};

// Function to calculate percentages of assets by status
export const getAssetStatusPercentages = async (): Promise<Record<AssetStatus, number>> => {
  const assets = await getAssets();
  const totalAssets = assets.length;
  const statusCount: Record<string, number> = {};
  
  assets.forEach(asset => {
    if (!statusCount[asset.status]) {
      statusCount[asset.status] = 0;
    }
    statusCount[asset.status]++;
  });
  
  const percentages: Record<AssetStatus, number> = {} as Record<AssetStatus, number>;
  
  Object.entries(statusCount).forEach(([status, count]) => {
    percentages[status as AssetStatus] = Math.round((count / totalAssets) * 100);
  });
  
  return percentages;
};

// Function to get total asset count
export const getTotalAssetCount = async (): Promise<number> => {
  const assets = await getAssets();
  return assets.length;
};
