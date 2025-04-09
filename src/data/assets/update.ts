
import { Asset } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

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
      type: data.type,
      manufacturer: data.manufacturer,
      model: data.model,
      purchaseDate: data.purchase_date,
      vendor: data.vendor,
      price: data.price,
      status: data.status,
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
