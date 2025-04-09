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
      warrantyExpiryDate: data.warranty_expiry_date,
      warrantyInfo: data.warranty_info,
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
      warrantyExpiryDate: item.warranty_expiry_date,
      warrantyInfo: item.warranty_info,
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
      warrantyExpiryDate: item.warranty_expiry_date,
      warrantyInfo: item.warranty_info,
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

// Function to update an asset in the database
export const updateAsset = async (asset: Asset): Promise<Asset> => {
  console.log("Updating asset in Supabase:", asset);
  
  try {
    const dbAsset = {
      id: asset.id,
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
      warranty_expiry_date: asset.warrantyExpiryDate,
      warranty_info: asset.warrantyInfo,
      imei: asset.imei,
      phone_number: asset.phoneNumber,
      provider: asset.provider,
      contract_end_date: asset.contractEndDate,
      contract_name: asset.contractName,
      contract_duration: asset.contractDuration,
      connected_asset_id: asset.connectedAssetId,
      related_asset_id: asset.relatedAssetId,
      image_url: asset.imageUrl,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('assets')
      .update(dbAsset)
      .eq('id', asset.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating asset:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`No asset returned after update for ID: ${asset.id}`);
    }
    
    console.log("Asset updated successfully:", data);
    
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
      warrantyExpiryDate: data.warranty_expiry_date,
      warrantyInfo: data.warranty_info,
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
    console.error(`Error in updateAsset for ${asset.id}:`, error);
    throw error;
  }
};

// Function to upload an image to Supabase storage
export const uploadAssetImage = async (file: File, assetId: string): Promise<string> => {
  console.log(`Uploading image for asset ${assetId}...`);
  
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${assetId}/${Date.now()}.${fileExt}`;
    
    console.log(`Uploading to bucket 'assets', path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from upload');
    }
    
    console.log("File uploaded successfully:", data);
    
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);
    
    console.log("Public URL:", publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadAssetImage:", error);
    throw error;
  }
};
