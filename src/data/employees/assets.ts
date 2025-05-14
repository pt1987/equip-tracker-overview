
import type { Asset } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbAssetToAsset } from "@/data/assets/mappers";
import { getAssets } from "@/data/assets";

// Get a summary of an employee's assets
export const getEmployeeAssetsSummary = async (employeeId: string): Promise<{
  totalAssets: number;
  laptopCount: number;
  phoneCount: number;
  otherCount: number;
  totalValue: number;
}> => {
  const assets = await fetchAssetsByEmployeeId(employeeId);
  
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

    // Map database results to application types using the mapper function
    return data.map(mapDbAssetToAsset);
  } catch (error) {
    console.error("Error in getEmployeeAssetsDetailed:", error);
    throw error;
  }
}

// Fetch assets assigned to a specific employee
// Renamed to avoid conflict with imported function
export async function fetchAssetsByEmployeeId(employeeId: string): Promise<Asset[]> {
  if (!employeeId) return [];
  
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('employee_id', employeeId);
      
    if (error) {
      console.error("Error fetching employee assets:", error);
      throw error;
    }
    
    return data.map(mapDbAssetToAsset);
  } catch (error) {
    console.error("Error in fetchAssetsByEmployeeId:", error);
    throw error;
  }
}

// Export the original function name for backward compatibility
export { fetchAssetsByEmployeeId as getAssetsByEmployeeId };
