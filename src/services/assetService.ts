
import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetHistoryEntry, AssetStatus, AssetType } from "@/lib/types";
import { toast } from "sonner";

export const getAssets = async (): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching assets:", error);
    toast.error("Failed to fetch assets");
    return [];
  }
};

export const getAssetById = async (id: string): Promise<Asset | null> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    toast.error("Failed to fetch asset details");
    return null;
  }
};

export const getAssetsByEmployeeId = async (employeeId: string): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('employee_id', employeeId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching assets for employee ${employeeId}:`, error);
    toast.error("Failed to fetch employee assets");
    return [];
  }
};

export const getAssetHistoryByAssetId = async (assetId: string): Promise<AssetHistoryEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('asset_history')
      .select('*')
      .eq('asset_id', assetId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching history for asset ${assetId}:`, error);
    toast.error("Failed to fetch asset history");
    return [];
  }
};

export const getAssetsByStatus = async (status: AssetStatus): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('status', status);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching assets with status ${status}:`, error);
    toast.error("Failed to fetch assets");
    return [];
  }
};

export const getAssetTypeDistribution = async () => {
  try {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('type');
    
    if (error) throw error;
    
    // Count assets by type
    const types: AssetType[] = ['laptop', 'smartphone', 'tablet', 'mouse', 'keyboard', 'accessory'];
    return types.map(type => ({
      type,
      count: assets.filter(asset => asset.type === type).length
    }));
  } catch (error) {
    console.error("Error fetching asset type distribution:", error);
    toast.error("Failed to fetch asset statistics");
    return [];
  }
};

export const getAssetStatusDistribution = async () => {
  try {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('status');
    
    if (error) throw error;
    
    // Count assets by status
    const statuses: AssetStatus[] = ['ordered', 'delivered', 'in_use', 'defective', 'repair', 'pool'];
    return statuses.map(status => ({
      status,
      count: assets.filter(asset => asset.status === status).length
    }));
  } catch (error) {
    console.error("Error fetching asset status distribution:", error);
    toast.error("Failed to fetch asset statistics");
    return [];
  }
};

export const createAsset = async (asset: Omit<Asset, 'id'>): Promise<Asset | null> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .insert([asset])
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Asset created successfully");
    return data;
  } catch (error) {
    console.error("Error creating asset:", error);
    toast.error("Failed to create asset");
    return null;
  }
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset | null> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .update(asset)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Asset updated successfully");
    return data;
  } catch (error) {
    console.error(`Error updating asset ${id}:`, error);
    toast.error("Failed to update asset");
    return null;
  }
};

export const deleteAsset = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success("Asset deleted successfully");
    return true;
  } catch (error) {
    console.error(`Error deleting asset ${id}:`, error);
    toast.error("Failed to delete asset");
    return false;
  }
};

export const createAssetHistoryEntry = async (entry: Omit<AssetHistoryEntry, 'id'>): Promise<AssetHistoryEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('asset_history')
      .insert([entry])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating asset history entry:", error);
    toast.error("Failed to record asset history");
    return null;
  }
};
