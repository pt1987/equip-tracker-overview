import { getAssetsByEmployeeId } from "../assets/fetch";
import type { Asset } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbAssetToAsset } from "@/data/assets/mappers";

// Get a summary of an employee's assets
export const getEmployeeAssetsSummary = async (employeeId: string): Promise<{
  totalAssets: number;
  laptopCount: number;
  phoneCount: number;
  otherCount: number;
  totalValue: number;
}> => {
  const assets = await getAssetsByEmployeeId(employeeId);
  
  return {
    totalAssets: assets.length,
    laptopCount: assets.filter(asset => asset.type === 'laptop').length,
    phoneCount: assets.filter(asset => asset.type === 'smartphone').length,
    otherCount: assets.filter(asset => !['laptop', 'smartphone'].includes(asset.type)).length,
    totalValue: assets.reduce((sum, asset) => sum + asset.price, 0)
  };
};

// Get all assets assigned to an employee with details
export async function getEmployeeAssetsDetailed(employeeId: string): Promise<Asset[]> {
  try {
    // Fetch data from the database
    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("employee_id", employeeId);

    if (error) {
      console.error("Error getting assets by employee ID:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map database results to application types
    return data.map(item => {
      // Convert the database asset to our Asset type
      return {
        id: item.id,
        name: item.name,
        type: item.type,
        manufacturer: item.manufacturer,
        model: item.model,
        purchaseDate: item.purchase_date,
        price: item.price,
        status: item.status,
        employeeId: item.employee_id,
        vendor: item.vendor,
        category: item.category,
        serialNumber: item.serial_number || undefined,
        inventoryNumber: item.inventory_number || undefined,
        imageUrl: item.image_url || undefined,
        // External asset fields
        isExternal: item.is_external || false,
        assetOwnerId: item.asset_owner_id || undefined, 
        ownerCompany: item.owner_company || "PHAT Consulting GmbH",
        projectId: item.project_id || undefined,
        responsibleEmployeeId: item.responsible_employee_id || undefined,
        handoverToEmployeeDate: item.handover_to_employee_date || undefined,
        plannedReturnDate: item.planned_return_date || undefined,
        actualReturnDate: item.actual_return_date || undefined,
      };
    });
  } catch (error) {
    console.error("Error in getEmployeeAssetsDetailed:", error);
    throw error;
  }
}

// Fetch assets assigned to a specific employee
export async function getAssetsByEmployeeId(employeeId: string): Promise<Asset[]> {
  if (!employeeId) return [];
  
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('employee_id', employeeId);
      
    if (error) {
      console.error("Error fetching employee assets:", error);
      throw error;
    }
    
    return data.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: asset.type as AssetType,
      manufacturer: asset.manufacturer,
      model: asset.model,
      purchaseDate: asset.purchase_date,
      price: asset.price,
      status: asset.status as AssetStatus,
      employeeId: asset.employee_id,
      vendor: asset.vendor || "",
      category: asset.category || "",
      serialNumber: asset.serial_number || "",
      inventoryNumber: asset.inventory_number || "",
      hasWarranty: asset.has_warranty || false,
      additionalWarranty: asset.additional_warranty || false,
      warrantyExpiryDate: asset.warranty_expiry_date || "",
      warrantyInfo: asset.warranty_info || "",
      imageUrl: asset.image_url || "",
      // External asset properties
      isExternal: asset.is_external || false,
      assetOwnerId: asset.asset_owner_id || "",
      ownerCompany: asset.owner_company || "",
      projectId: asset.project_id || "",
      responsibleEmployeeId: asset.responsible_employee_id || "",
      handoverToEmployeeDate: asset.handover_to_employee_date || "",
      plannedReturnDate: asset.planned_return_date || "",
      actualReturnDate: asset.actual_return_date || "",
    }));
  } catch (error) {
    console.error("Error in getAssetsByEmployeeId:", error);
    throw error;
  }
}
