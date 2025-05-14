
import type { Asset } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbAssetToAsset } from "@/data/assets/mappers";
import { getAssetsByEmployeeId as fetchAssetsByEmployeeIdFromFetch } from "../assets/fetch";

// Get a summary of an employee's assets
export const getEmployeeAssetsSummary = async (employeeId: string): Promise<{
  totalAssets: number;
  laptopCount: number;
  phoneCount: number;
  otherCount: number;
  totalValue: number;
}> => {
  const assets = await fetchAssetsByEmployeeIdFromFetch(employeeId);
  
  return {
    totalAssets: assets.length,
    laptopCount: assets.filter(asset => asset.type === 'laptop').length,
    phoneCount: assets.filter(asset => asset.type === 'smartphone').length,
    otherCount: assets.filter(asset => !['laptop', 'smartphone'].includes(asset.type)).length,
    totalValue: assets.reduce((sum, asset) => sum + asset.price, 0)
  };
};

// Get all assets assigned to an employee with details
export async function getEmployeeAssetsDetailed(employeeId: string): Promise<Asset[]> {
  try {
    // Fetch data from the database
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("employee_id", employeeId);

    if (error) {
      console.error("Error getting assets by employee ID:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map database results to application types
    return data.map(mapDbAssetToAsset);
  } catch (error) {
    console.error("Error in getEmployeeAssetsDetailed:", error);
    throw error;
  }
}

// For backward compatibility
export const getAssetsByEmployeeId = fetchAssetsByEmployeeIdFromFetch;
