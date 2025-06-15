
import { Asset } from "@/lib/types";
import { Database } from "@/integrations/supabase/types";

type DbAssetRow = Database['public']['Tables']['assets']['Row'];

export const mapDbAssetToAsset = (dbAsset: DbAssetRow): Asset => {
  console.log("=== mapDbAssetToAsset Debug ===");
  console.log("Input DB asset:", dbAsset);
  
  const asset: Asset = {
    id: dbAsset.id,
    name: dbAsset.name,
    type: dbAsset.type as Asset['type'],
    manufacturer: dbAsset.manufacturer,
    model: dbAsset.model,
    purchaseDate: dbAsset.purchase_date,
    vendor: dbAsset.vendor,
    price: dbAsset.price,
    status: dbAsset.status as Asset['status'],
    employeeId: dbAsset.employee_id,
    category: dbAsset.category || dbAsset.type,
    serialNumber: dbAsset.serial_number,
    inventoryNumber: dbAsset.inventory_number,
    hasWarranty: dbAsset.has_warranty || false,
    additionalWarranty: dbAsset.additional_warranty || false,
    warrantyExpiryDate: dbAsset.warranty_expiry_date,
    warrantyInfo: dbAsset.warranty_info,
    imageUrl: dbAsset.image_url,
    imei: dbAsset.imei,
    phoneNumber: dbAsset.phone_number,
    provider: dbAsset.provider,
    contractEndDate: dbAsset.contract_end_date,
    contractName: dbAsset.contract_name,
    connectedAssetId: dbAsset.connected_asset_id,
    relatedAssetId: dbAsset.related_asset_id,
    isPoolDevice: dbAsset.is_pool_device || false,
    // ISO 27001 fields
    classification: dbAsset.classification as Asset['classification'] || 'internal',
    assetOwnerId: dbAsset.asset_owner_id,
    lastReviewDate: dbAsset.last_review_date,
    nextReviewDate: dbAsset.next_review_date,
    riskLevel: dbAsset.risk_level as Asset['riskLevel'] || 'low',
    isPersonalData: dbAsset.is_personal_data || false,
    disposalMethod: dbAsset.disposal_method,
    lifecycleStage: dbAsset.lifecycle_stage as Asset['lifecycleStage'] || 'operation',
    notes: dbAsset.notes,
    // External asset fields
    isExternal: dbAsset.is_external || false,
    ownerCompany: dbAsset.owner_company || 'PHAT Consulting GmbH',
    projectId: dbAsset.project_id,
    responsibleEmployeeId: dbAsset.responsible_employee_id,
    handoverToEmployeeDate: dbAsset.handover_to_employee_date,
    plannedReturnDate: dbAsset.planned_return_date,
    actualReturnDate: dbAsset.actual_return_date,
  };
  
  console.log("Mapped asset:", asset);
  return asset;
};
