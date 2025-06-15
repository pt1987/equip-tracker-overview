
import { Asset } from "@/lib/types";
import { Database } from "@/integrations/supabase/types";

type DbAsset = Database['public']['Tables']['assets']['Insert'];

export const mapAssetToDbAsset = (asset: Asset): DbAsset => {
  console.log("=== mapAssetToDbAsset Debug ===");
  console.log("Input asset:", asset);
  
  const dbAsset: DbAsset = {
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
    category: asset.category || asset.type,
    serial_number: asset.serialNumber,
    inventory_number: asset.inventoryNumber,
    has_warranty: asset.hasWarranty || false,
    additional_warranty: asset.additionalWarranty || false,
    warranty_expiry_date: asset.warrantyExpiryDate,
    warranty_info: asset.warrantyInfo,
    image_url: asset.imageUrl,
    imei: asset.imei,
    phone_number: asset.phoneNumber,
    provider: asset.provider,
    contract_end_date: asset.contractEndDate,
    contract_name: asset.contractName,
    connected_asset_id: asset.connectedAssetId,
    related_asset_id: asset.relatedAssetId,
    is_pool_device: asset.isPoolDevice || false,
    // ISO 27001 fields
    classification: asset.classification || 'internal',
    asset_owner_id: asset.assetOwnerId,
    last_review_date: asset.lastReviewDate,
    next_review_date: asset.nextReviewDate,
    risk_level: asset.riskLevel || 'low',
    is_personal_data: asset.isPersonalData || false,
    disposal_method: asset.disposalMethod,
    lifecycle_stage: asset.lifecycleStage || 'operation',
    notes: asset.notes,
    // External asset fields
    is_external: asset.isExternal || false,
    owner_company: asset.ownerCompany || 'PHAT Consulting GmbH',
    project_id: asset.projectId,
    responsible_employee_id: asset.responsibleEmployeeId,
    handover_to_employee_date: asset.handoverToEmployeeDate,
    planned_return_date: asset.plannedReturnDate,
    actual_return_date: asset.actualReturnDate,
  };
  
  console.log("Mapped DB asset:", dbAsset);
  return dbAsset;
};

// Export with the exact name that's being imported
export const mapAssetToDbAssetInsert = mapAssetToDbAsset;
