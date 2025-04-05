
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
  return {
    name: asset.name,
    type: asset.type,
    manufacturer: asset.manufacturer,
    model: asset.model,
    purchase_date: asset.purchaseDate,
    vendor: asset.vendor,
    price: asset.price,
    status: asset.status,
    employee_id: asset.employeeId,
    category: asset.category,
    serial_number: asset.serialNumber,
    inventory_number: asset.inventoryNumber,
    additional_warranty: asset.additionalWarranty,
    has_warranty: asset.hasWarranty,
    imei: asset.imei,
    phone_number: asset.phoneNumber,
    provider: asset.provider,
    contract_end_date: asset.contractEndDate,
    contract_name: asset.contractName,
    contract_duration: asset.contractDuration,
    connected_asset_id: asset.connectedAssetId,
    related_asset_id: asset.relatedAssetId,
    image_url: asset.imageUrl,
  };
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
    const dbAsset = mapAssetToDbAsset(asset);
    
    const { data, error } = await supabase
      .from('assets')
      .update(dbAsset)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Asset updated successfully");
    return data ? mapDbAssetToAsset(data) : null;
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
    const dbHistoryEntry = mapHistoryEntryToDbHistory(entry);
    
    const { data, error } = await supabase
      .from('asset_history')
      .insert([dbHistoryEntry])
      .select()
      .single();
    
    if (error) throw error;
    return data ? mapDbHistoryToHistoryEntry(data) : null;
  } catch (error) {
    console.error("Error creating asset history entry:", error);
    toast.error("Failed to record asset history");
    return null;
  }
};
