import { Asset, AssetHistoryEntry, AssetStatus, AssetType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

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
    
    return {
      id: data.id,
      name: data.name,
      type: data.type as AssetType,
      manufacturer: data.manufacturer,
      model: data.model,
      purchaseDate: data.purchase_date,
      vendor: data.vendor,
      price: data.price,
      status: data.status as AssetStatus,
      employeeId: data.employee_id,
      category: data.category,
      serialNumber: data.serial_number,
      inventoryNumber: data.inventory_number,
      additionalWarranty: data.additional_warranty,
      hasWarranty: data.has_warranty,
      imei: data.imei,
      phoneNumber: data.phone_number,
      provider: data.provider,
      contractEndDate: data.contract_end_date,
      contractName: data.contract_name,
      contractDuration: data.contract_duration,
      connectedAssetId: data.connected_asset_id,
      relatedAssetId: data.related_asset_id,
      imageUrl: data.image_url
    };
  } catch (error) {
    console.error(`Error in getAssetById for ${id}:`, error);
    throw error;
  }
};

// Helper function to get all assets
export const getAssets = async (): Promise<Asset[]> => {
  console.log("Getting all assets from Supabase...");
  
  try {
    // Check auth state first
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
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as AssetType,
      manufacturer: item.manufacturer,
      model: item.model,
      purchaseDate: item.purchase_date,
      vendor: item.vendor,
      price: item.price,
      status: item.status as AssetStatus,
      employeeId: item.employee_id,
      category: item.category,
      serialNumber: item.serial_number,
      inventoryNumber: item.inventory_number,
      additionalWarranty: item.additional_warranty,
      hasWarranty: item.has_warranty,
      imei: item.imei,
      phoneNumber: item.phone_number,
      provider: item.provider,
      contractEndDate: item.contract_end_date,
      contractName: item.contract_name,
      contractDuration: item.contract_duration,
      connectedAssetId: item.connected_asset_id,
      relatedAssetId: item.related_asset_id,
      imageUrl: item.image_url
    }));
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
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as AssetType,
      manufacturer: item.manufacturer,
      model: item.model,
      purchaseDate: item.purchase_date,
      vendor: item.vendor,
      price: item.price,
      status: item.status as AssetStatus,
      employeeId: item.employee_id,
      category: item.category,
      serialNumber: item.serial_number,
      inventoryNumber: item.inventory_number,
      additionalWarranty: item.additional_warranty,
      hasWarranty: item.has_warranty,
      imei: item.imei,
      phoneNumber: item.phone_number,
      provider: item.provider,
      contractEndDate: item.contract_end_date,
      contractName: item.contract_name,
      contractDuration: item.contract_duration,
      connectedAssetId: item.connected_asset_id,
      relatedAssetId: item.related_asset_id,
      imageUrl: item.image_url
    }));
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

// Function to get asset type distribution data
export const getAssetTypeDistribution = async () => {
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
export const getAssetStatusDistribution = async () => {
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
