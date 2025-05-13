
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/lib/types";

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
      type: asset.type,
      manufacturer: asset.manufacturer,
      model: asset.model,
      purchaseDate: asset.purchase_date,
      price: asset.price,
      status: asset.status,
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
