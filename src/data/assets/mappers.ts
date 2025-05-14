
import { Asset, AssetType, AssetStatus, AssetClassification } from "@/lib/types";

// Type for the database asset structure
export interface DbAsset {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  purchase_date: string;
  vendor: string;
  price: number;
  status: string;
  employee_id: string | null;
  category: string;
  serial_number: string | null;
  inventory_number: string | null;
  additional_warranty: boolean | null;
  has_warranty: boolean | null;
  warranty_expiry_date: string | null;
  warranty_info: string | null;
  imei: string | null;
  phone_number: string | null;
  provider: string | null;
  contract_end_date: string | null;
  contract_name: string | null;
  contract_duration: string | null;
  connected_asset_id: string | null;
  related_asset_id: string | null;
  image_url: string | null;
  
  // External asset fields
  is_external: boolean | null;
  asset_owner_id: string | null;
  owner_company: string | null;
  project_id: string | null;
  responsible_employee_id: string | null;
  handover_to_employee_date: string | null;
  planned_return_date: string | null;
  actual_return_date: string | null;
  
  // ISO 27001 fields
  classification: string | null;
  last_review_date: string | null;
  next_review_date: string | null;
  risk_level: string | null;
  is_personal_data: boolean | null;
  disposal_method: string | null;
  lifecycle_stage: string | null;
  notes: string | null;
}

// Map database asset to application asset
export const mapDbAssetToAsset = (dbAsset: DbAsset): Asset => {
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
    serialNumber: dbAsset.serial_number || undefined,
    inventoryNumber: dbAsset.inventory_number || undefined,
    additionalWarranty: dbAsset.additional_warranty || undefined,
    hasWarranty: dbAsset.has_warranty || undefined,
    warrantyExpiryDate: dbAsset.warranty_expiry_date || undefined,
    warrantyInfo: dbAsset.warranty_info || undefined,
    imei: dbAsset.imei || undefined,
    phoneNumber: dbAsset.phone_number || undefined,
    provider: dbAsset.provider || undefined,
    contractEndDate: dbAsset.contract_end_date || undefined,
    contractName: dbAsset.contract_name || undefined,
    contractDuration: dbAsset.contract_duration || undefined,
    connectedAssetId: dbAsset.connected_asset_id || undefined,
    relatedAssetId: dbAsset.related_asset_id || undefined,
    imageUrl: dbAsset.image_url || undefined,
    
    // External asset fields
    isExternal: dbAsset.is_external || false,
    assetOwnerId: dbAsset.asset_owner_id || undefined,
    ownerCompany: dbAsset.owner_company || "PHAT Consulting GmbH",
    projectId: dbAsset.project_id || undefined,
    responsibleEmployeeId: dbAsset.responsible_employee_id || undefined,
    handoverToEmployeeDate: dbAsset.handover_to_employee_date || undefined,
    plannedReturnDate: dbAsset.planned_return_date || undefined,
    actualReturnDate: dbAsset.actual_return_date || undefined,
    
    // ISO 27001 fields
    classification: dbAsset.classification as AssetClassification || undefined,
    lastReviewDate: dbAsset.last_review_date || undefined,
    nextReviewDate: dbAsset.next_review_date || undefined,
    riskLevel: dbAsset.risk_level as 'low' | 'medium' | 'high' || undefined,
    isPersonalData: dbAsset.is_personal_data || false,
    disposalMethod: dbAsset.disposal_method || undefined,
    lifecycleStage: dbAsset.lifecycle_stage as 'procurement' | 'operation' | 'maintenance' | 'disposal' || undefined,
    notes: dbAsset.notes || undefined,
  };
};

// Map application asset to database asset
export const mapAssetToDbAsset = (asset: Asset): DbAsset => {
  return {
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
    
    // External asset fields
    is_external: asset.isExternal || false,
    asset_owner_id: asset.assetOwnerId || null,
    owner_company: asset.ownerCompany || "PHAT Consulting GmbH",
    project_id: asset.projectId || null,
    responsible_employee_id: asset.responsibleEmployeeId || null,
    handover_to_employee_date: asset.handoverToEmployeeDate || null,
    planned_return_date: asset.plannedReturnDate || null,
    actual_return_date: asset.actualReturnDate || null,
    
    // ISO 27001 fields
    classification: asset.classification || null,
    last_review_date: asset.lastReviewDate || null,
    next_review_date: asset.nextReviewDate || null,
    risk_level: asset.riskLevel || null,
    is_personal_data: asset.isPersonalData || null,
    disposal_method: asset.disposalMethod || null,
    lifecycle_stage: asset.lifecycleStage || null,
    notes: asset.notes || null,
  };
};
