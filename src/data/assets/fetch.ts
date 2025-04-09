import { Asset, AssetHistoryEntry } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbAssetToAsset } from "./mappers";

// Helper function to get an asset by ID
export const getAssetById = async (id: string): Promise<Asset | null> => {
  console.log(`Fetching asset by ID: ${id}`);
  
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching asset by ID:", error);
      throw error;
    }
    
    if (!data) {
      console.log(`No asset found with ID: ${id}`);
      return null;
    }
    
    console.log(`Asset found:`, data);
    
    return mapDbAssetToAsset(data);
  } catch (error) {
    console.error(`Error in getAssetById for ${id}:`, error);
    throw error;
  }
};

// Helper function to get all assets
export const getAssets = async (): Promise<Asset[]> => {
  console.log("Getting all assets from Supabase...");
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Auth session state:", session ? "User is authenticated" : "No active session");
    
    const { data, error } = await supabase
      .from('assets')
      .select('*');
    
    if (error) {
      console.error("Error fetching assets:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No assets found in database");
      return [];
    }
    
    console.log(`Retrieved ${data.length} assets from database`);
    
    return data.map(mapDbAssetToAsset);
  } catch (error) {
    console.error("Error in getAssets:", error);
    throw error;
  }
};

// Helper function to get assets by employee ID
export const getAssetsByEmployeeId = async (employeeId: string): Promise<Asset[]> => {
  console.log(`Fetching assets for employee: ${employeeId}`);
  
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('employee_id', employeeId);
    
    if (error) {
      console.error("Error fetching assets by employee ID:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log(`No assets found for employee: ${employeeId}`);
      return [];
    }
    
    console.log(`Found ${data.length} assets for employee: ${employeeId}`);
    
    return data.map(mapDbAssetToAsset);
  } catch (error) {
    console.error(`Error in getAssetsByEmployeeId for ${employeeId}:`, error);
    throw error;
  }
};

// Helper function to get asset history by asset ID
export const getAssetHistoryByAssetId = async (assetId: string): Promise<AssetHistoryEntry[]> => {
  const { data, error } = await supabase
    .from('asset_history')
    .select('*')
    .eq('asset_id', assetId)
    .order('date', { ascending: false });
  
  if (error || !data) return [];
  
  return data.map(item => ({
    id: item.id,
    assetId: item.asset_id,
    date: item.date,
    action: item.action as "purchase" | "assign" | "status_change" | "return",
    employeeId: item.employee_id,
    notes: item.notes || ""
  }));
};
