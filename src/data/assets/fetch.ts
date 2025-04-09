
import { Asset, AssetHistoryEntry } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbAssetToAsset } from "./mappers";
import { addAssetHistoryEntry } from "./history";

// Function to create a new asset and record the purchase in history
export const createAsset = async (asset: Asset): Promise<Asset> => {
  console.log("Creating new asset in Supabase:", asset);
  
  try {
    const dbAsset = {
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
      serial_number: asset.serialNumber || null,
      inventory_number: asset.inventoryNumber || null,
      additional_warranty: asset.additionalWarranty || null,
      has_warranty: asset.hasWarranty || null,
      warranty_expiry_date: asset.warrantyExpiryDate || null,
      warranty_info: asset.warrantyInfo || null,
      imei: asset.imei || null,
      phone_number: asset.phoneNumber || null,
      provider: asset.provider || null,
      contract_end_date: asset.contractEndDate || null,
      contract_name: asset.contractName || null,
      contract_duration: asset.contractDuration || null,
      connected_asset_id: asset.connectedAssetId || null,
      related_asset_id: asset.relatedAssetId || null,
      image_url: asset.imageUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('assets')
      .insert(dbAsset)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating asset:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No asset returned after creation");
    }
    
    // Add purchase history entry
    await addAssetHistoryEntry(
      data.id,
      "purchase",
      null,
      `Initial purchase: ${asset.manufacturer} ${asset.model} for ${asset.price}€`
    );
    
    console.log("Asset created successfully with history entry:", data);
    
    return mapDbAssetToAsset(data);
  } catch (error) {
    console.error("Error in createAsset:", error);
    throw error;
  }
};

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
