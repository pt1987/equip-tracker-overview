
import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetStatus, AssetTypeDistribution, AssetStatusDistribution, AssetHistoryEntry } from "@/lib/types";
import { formatDateString as formatDate } from "@/lib/utils";

// Function to get all assets
export const getAllAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
  
  return transformAssets(data || []);
};

// Function to get a single asset by ID
export const getAssetById = async (id: string): Promise<Asset | null> => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Asset not found
      return null;
    }
    console.error('Error fetching asset:', error);
    throw error;
  }
  
  return transformAsset(data);
};

// Function to get all assets with a specific status
export const getAssetsByStatus = async (status: AssetStatus): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching assets with status ${status}:`, error);
    throw error;
  }
  
  return transformAssets(data || []);
};

// Function to get all assets assigned to a specific employee
export const getAssetsByEmployeeId = async (employeeId: string): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching assets for employee ${employeeId}:`, error);
    throw error;
  }
  
  return transformAssets(data || []);
};

// Function to get asset history for a specific asset
export const getAssetHistoryByAssetId = async (assetId: string): Promise<AssetHistoryEntry[]> => {
  const { data, error } = await supabase
    .from('asset_history')
    .select('*')
    .eq('asset_id', assetId)
    .order('date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching history for asset ${assetId}:`, error);
    throw error;
  }
  
  return transformAssetHistory(data || []);
};

// Function to create a new asset
export const createAsset = async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
  const dbAsset = transformAssetForDb(asset);
  
  const { data, error } = await supabase
    .from('assets')
    .insert(dbAsset)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
  
  // Create an asset history entry for the purchase
  await createAssetHistoryEntry({
    assetId: data?.id || '',
    date: new Date().toISOString(),
    action: 'purchase',
    employeeId: null,
    notes: 'Initial purchase'
  });
  
  return transformAsset(data);
};

// Function to update an asset
export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
  const dbAsset = transformAssetForDb(asset);
  
  const { data, error } = await supabase
    .from('assets')
    .update(dbAsset)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
  
  return transformAsset(data);
};

// Function to delete an asset
export const deleteAsset = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};

// Function to create an asset history entry
export const createAssetHistoryEntry = async (entry: Omit<AssetHistoryEntry, 'id'>): Promise<AssetHistoryEntry> => {
  const { data, error } = await supabase
    .from('asset_history')
    .insert({
      asset_id: entry.assetId,
      date: entry.date,
      action: entry.action,
      employee_id: entry.employeeId,
      notes: entry.notes
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating asset history entry:', error);
    throw error;
  }
  
  return {
    id: data?.id || '',
    assetId: data?.asset_id || '',
    date: data?.date || '',
    action: data?.action as AssetHistoryEntry['action'] || 'purchase',
    employeeId: data?.employee_id,
    notes: data?.notes || ''
  };
};

// Function to get asset type distribution
export const getAssetTypeDistribution = async (): Promise<AssetTypeDistribution[]> => {
  const { data, error } = await supabase
    .from('assets')
    .select('type');
  
  if (error) {
    console.error('Error fetching asset type distribution:', error);
    throw error;
  }
  
  // Process the data to get distribution
  const typeCount: Record<string, number> = {};
  data.forEach(item => {
    typeCount[item.type] = (typeCount[item.type] || 0) + 1;
  });
  
  return Object.entries(typeCount).map(([type, count]) => ({
    type: type as any,
    count
  }));
};

// Function to get asset status distribution
export const getAssetStatusDistribution = async (): Promise<AssetStatusDistribution[]> => {
  const { data, error } = await supabase
    .from('assets')
    .select('status');
  
  if (error) {
    console.error('Error fetching asset status distribution:', error);
    throw error;
  }
  
  // Process the data to get distribution
  const statusCount: Record<string, number> = {};
  data.forEach(item => {
    statusCount[item.status] = (statusCount[item.status] || 0) + 1;
  });
  
  return Object.entries(statusCount).map(([status, count]) => ({
    status: status as AssetStatus,
    count
  }));
};

// Helper function to transform database assets to the application Asset type
function transformAssets(dbAssets: any[]): Asset[] {
  return dbAssets.map(transformAsset);
}

// Helper function to transform a single database asset to the application Asset type
function transformAsset(dbAsset: any): Asset {
  return {
    id: dbAsset.id,
    name: dbAsset.name,
    type: dbAsset.type,
    manufacturer: dbAsset.manufacturer,
    model: dbAsset.model,
    purchaseDate: formatDate(dbAsset.purchase_date),
    vendor: dbAsset.vendor,
    price: Number(dbAsset.price),
    status: dbAsset.status,
    employeeId: dbAsset.employee_id,
    assignedTo: dbAsset.employee_id,
    category: dbAsset.category,
    serialNumber: dbAsset.serial_number,
    inventoryNumber: dbAsset.inventory_number,
    additionalWarranty: dbAsset.additional_warranty,
    hasWarranty: dbAsset.has_warranty,
    imei: dbAsset.imei,
    phoneNumber: dbAsset.phone_number,
    provider: dbAsset.provider,
    contractEndDate: dbAsset.contract_end_date ? formatDate(dbAsset.contract_end_date) : undefined,
    contractName: dbAsset.contract_name,
    contractDuration: dbAsset.contract_duration,
    connectedAssetId: dbAsset.connected_asset_id,
    relatedAssetId: dbAsset.related_asset_id,
    imageUrl: dbAsset.image_url
  };
}

// Helper function to transform asset history entries
function transformAssetHistory(dbHistory: any[]): AssetHistoryEntry[] {
  return dbHistory.map(entry => ({
    id: entry.id,
    assetId: entry.asset_id,
    date: formatDate(entry.date),
    action: entry.action as 'purchase' | 'assign' | 'status_change' | 'return',
    employeeId: entry.employee_id,
    notes: entry.notes
  }));
}

// Helper function to transform an application Asset to the database format
function transformAssetForDb(asset: Partial<Asset>): any {
  const dbAsset: any = {};
  
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
