
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
