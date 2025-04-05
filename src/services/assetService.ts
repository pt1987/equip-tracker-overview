import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetHistoryEntry, AssetStatus, AssetType } from "@/lib/types";
import { toast } from "sonner";

// Helper to convert database object to our Asset model
function mapDbAssetToAsset(dbAsset: any): Asset {
  return {
    id: dbAsset.id,
    name: dbAsset.name,
    type: dbAsset.type as AssetType,
    manufacturer: dbAsset.manufacturer,
    model: dbAsset.model,
    purchaseDate: dbAsset.purchase_date,
    vendor: dbAsset.vendor,
    price: dbAsset.price,
    status: dbAsset.status as AssetStatus,
    employeeId: dbAsset.employee_id,
    category: dbAsset.category,
    serialNumber: dbAsset.serial_number,
    inventoryNumber: dbAsset.inventory_number,
    additionalWarranty: dbAsset.additional_warranty,
    hasWarranty: dbAsset.has_warranty,
    imei: dbAsset.imei,
    phoneNumber: dbAsset.phone_number,
    provider: dbAsset.provider,
    contractEndDate: dbAsset.contract_end_date,
    contractName: dbAsset.contract_name,
    contractDuration: dbAsset.contract_duration,
    connectedAssetId: dbAsset.connected_asset_id,
    relatedAssetId: dbAsset.related_asset_id,
    imageUrl: dbAsset.image_url,
  };
}

// Helper to convert Asset model to database object
function mapAssetToDbAsset(asset: Partial<Asset>): any {
  const dbAsset: Record<string, any> = {};
  
  if (asset.name !== undefined) dbAsset.name = asset.name;
  if (asset.type !== undefined) dbAsset.type = asset.type;
  if (asset.manufacturer !== undefined) dbAsset.manufacturer = asset.manufacturer;
  if (asset.model !== undefined) dbAsset.model = asset.model;
  if (asset.purchaseDate !== undefined) dbAsset.purchase_date = asset.purchaseDate;
  if (asset.vendor !== undefined) dbAsset.vendor = asset.vendor;
  if (asset.price !== undefined) dbAsset.price = asset.price;
  if (asset.status !== undefined) dbAsset.status = asset.status;
  if (asset.employeeId !== undefined) dbAsset.employee_id = asset.employeeId;
  if (asset.category !== undefined) dbAsset.category = asset.category;
  if (asset.serialNumber !== undefined) dbAsset.serial_number = asset.serialNumber;
  if (asset.inventoryNumber !== undefined) dbAsset.inventory_number = asset.inventoryNumber;
  if (asset.additionalWarranty !== undefined) dbAsset.additional_warranty = asset.additionalWarranty;
  if (asset.hasWarranty !== undefined) dbAsset.has_warranty = asset.hasWarranty;
  if (asset.imei !== undefined) dbAsset.imei = asset.imei;
  if (asset.phoneNumber !== undefined) dbAsset.phone_number = asset.phoneNumber;
  if (asset.provider !== undefined) dbAsset.provider = asset.provider;
  if (asset.contractEndDate !== undefined) dbAsset.contract_end_date = asset.contractEndDate;
  if (asset.contractName !== undefined) dbAsset.contract_name = asset.contractName;
  if (asset.contractDuration !== undefined) dbAsset.contract_duration = asset.contractDuration;
  if (asset.connectedAssetId !== undefined) dbAsset.connected_asset_id = asset.connectedAssetId;
  if (asset.relatedAssetId !== undefined) dbAsset.related_asset_id = asset.relatedAssetId;
  if (asset.imageUrl !== undefined) dbAsset.image_url = asset.imageUrl;
  
  return dbAsset;
}

// Helper to convert database history entry to our AssetHistoryEntry model
function mapDbHistoryToHistoryEntry(dbHistory: any): AssetHistoryEntry {
  return {
    id: dbHistory.id,
    assetId: dbHistory.asset_id,
    date: dbHistory.date,
    action: dbHistory.action as 'purchase' | 'assign' | 'status_change' | 'return',
    employeeId: dbHistory.employee_id,
    notes: dbHistory.notes || '',
  };
}

// Helper to convert AssetHistoryEntry model to database object
function mapHistoryEntryToDbHistory(entry: Omit<AssetHistoryEntry, 'id'>): any {
  return {
    asset_id: entry.assetId,
    date: entry.date,
    action: entry.action,
    employee_id: entry.employeeId,
    notes: entry.notes,
  };
}

export const getAssets = async (): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*');
    
    if (error) throw error;
    return (data || []).map(mapDbAssetToAsset);
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
    return data ? mapDbAssetToAsset(data) : null;
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
    return (data || []).map(mapDbAssetToAsset);
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
    return (data || []).map(mapDbHistoryToHistoryEntry);
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
    return (data || []).map(mapDbAssetToAsset);
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
    const dbAsset = mapAssetToDbAsset(asset);
    
    const { data, error } = await supabase
      .from('assets')
      .insert([dbAsset])
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Asset created successfully");
    return data ? mapDbAssetToAsset(data) : null;
  } catch (error) {
    console.error("Error creating asset:", error);
    toast.error("Failed to create asset");
    return null;
  }
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset | null> => {
  try {
    console.log("Updating asset with ID:", id);
    console.log("Update data:", asset);
    
    const dbAsset = mapAssetToDbAsset(asset);
    
    const { data, error } = await supabase
      .from('assets')
      .update(dbAsset)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned after update");
    }
    
    console.log("Update successful, returned data:", data);
    toast.success("Asset updated successfully");
    return mapDbAssetToAsset(data);
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
    const dbHistoryEntry = {
      asset_id: entry.assetId,
      date: entry.date,
      action: entry.action,
      employee_id: entry.employeeId,
      notes: entry.notes || '',
    };
    
    const { data, error } = await supabase
      .from('asset_history')
      .insert([dbHistoryEntry])
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) {
      throw new Error("No data returned after insert");
    }
    
    return {
      id: data.id,
      assetId: data.asset_id,
      date: data.date,
      action: data.action,
      employeeId: data.employee_id,
      notes: data.notes || '',
    };
  } catch (error) {
    console.error("Error creating asset history entry:", error);
    toast.error("Failed to record asset history");
    return null;
  }
};
