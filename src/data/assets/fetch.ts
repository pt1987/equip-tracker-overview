
import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetHistoryAction, AssetHistoryEntry } from "@/lib/types"; 
import { mapDbAssetToAsset } from "./mappers";

// Get a single asset by ID
export const getAssetById = async (id: string): Promise<Asset | null> => {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting asset by ID:", error);
    throw error;
  }

  return data ? mapDbAssetToAsset(data) : null;
};

// Get all assets
export const getAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from("assets")
    .select("*");

  if (error) {
    console.error("Error getting assets:", error);
    throw error;
  }

  return data ? data.map(mapDbAssetToAsset) : [];
};

// Get assets assigned to an employee
export const getAssetsByEmployeeId = async (employeeId: string): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("employee_id", employeeId);

  if (error) {
    console.error("Error getting assets by employee ID:", error);
    throw error;
  }

  return data ? data.map(mapDbAssetToAsset) : [];
};

// Get asset history entries for an asset
export const getAssetHistoryByAssetId = async (assetId: string): Promise<AssetHistoryEntry[]> => {
  try {
    console.log(`Fetching history for asset: ${assetId}`);
    const { data, error } = await supabase
      .from("asset_history")
      .select("*")
      .eq("asset_id", assetId)
      .order("date", { ascending: false });
    
    if (error) {
      console.error("Error getting asset history:", error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} history entries for asset ${assetId}`);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Map database results to our types, ensuring action is cast to AssetHistoryAction
    const historyEntries: AssetHistoryEntry[] = data.map(entry => ({
      id: entry.id,
      assetId: entry.asset_id,
      date: entry.date,
      action: entry.action as AssetHistoryAction,  // Cast string to enum type
      employeeId: entry.employee_id,
      userId: null,  // Set to null by default since user_id doesn't exist in the response
      notes: entry.notes || ""
    }));
    
    return historyEntries;
  } catch (error) {
    console.error("Failed to get asset history:", error);
    throw error;
  }
};
