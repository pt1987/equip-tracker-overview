
import { Asset } from "@/lib/types";

// Database asset type (raw from Supabase)
export type DbAsset = {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  vendor: string;
  status: string;
  purchase_date: string;
  price: number;
  employee_id: string | null;
  category: string;
  serial_number: string | null;
  inventory_number: string | null;
  has_warranty: boolean | null;
  additional_warranty: boolean | null;
  warranty_expiry_date: string | null;
  warranty_info: string | null;
  image_url: string | null;
  is_pool_device: boolean | null;
  is_external: boolean | null;
  owner_company: string | null;
  project_id: string | null;
  responsible_employee_id: string | null;
  handover_to_employee_date: string | null;
  planned_return_date: string | null;
  actual_return_date: string | null;
  classification: string | null;
  asset_owner_id: string | null;
  last_review_date: string | null;
  next_review_date: string | null;
  risk_level: string | null;
  is_personal_data: boolean | null;
  disposal_method: string | null;
  lifecycle_stage: string | null;
  notes: string | null;
  imei: string | null;
  phone_number: string | null;
  provider: string | null;
  contract_end_date: string | null;
  contract_name: string | null;
  contract_duration: string | null;
  connected_asset_id: string | null;
  related_asset_id: string | null;
  created_at?: string;
  updated_at?: string;
};

// Map database asset to frontend Asset type
export const mapDbAssetToAsset = (dbAsset: DbAsset): Asset => {
  const asset: Asset = {
    id: dbAsset.id,
    name: dbAsset.name,
    type: dbAsset.type as any,
    manufacturer: dbAsset.manufacturer,
    model: dbAsset.model,
    vendor: dbAsset.vendor,
    status: dbAsset.status as any,
    purchaseDate: dbAsset.purchase_date,
    price: dbAsset.price,
    employeeId: dbAsset.employee_id,
    category: dbAsset.category,
    serialNumber: dbAsset.serial_number,
    inventoryNumber: dbAsset.inventory_number,
    hasWarranty: dbAsset.has_warranty || false,
    additionalWarranty: dbAsset.additional_warranty || false,
    warrantyExpiryDate: dbAsset.warranty_expiry_date,
    warrantyInfo: dbAsset.warranty_info,
    imageUrl: dbAsset.image_url,
    isPoolDevice: dbAsset.is_pool_device || false,
    isExternal: dbAsset.is_external || false,
    ownerCompany: dbAsset.owner_company || 'PHAT Consulting GmbH',
    projectId: dbAsset.project_id,
    responsibleEmployeeId: dbAsset.responsible_employee_id,
    handoverToEmployeeDate: dbAsset.handover_to_employee_date,
    plannedReturnDate: dbAsset.planned_return_date,
    actualReturnDate: dbAsset.actual_return_date,
    classification: dbAsset.classification as any,
    assetOwnerId: dbAsset.asset_owner_id,
    lastReviewDate: dbAsset.last_review_date,
    nextReviewDate: dbAsset.next_review_date,
    riskLevel: dbAsset.risk_level as any,
    isPersonalData: dbAsset.is_personal_data || false,
    disposalMethod: dbAsset.disposal_method,
    lifecycleStage: dbAsset.lifecycle_stage as any,
    notes: dbAsset.notes,
    imei: dbAsset.imei,
    phoneNumber: dbAsset.phone_number,
    provider: dbAsset.provider,
    contractEndDate: dbAsset.contract_end_date,
    contractName: dbAsset.contract_name,
    contractDuration: dbAsset.contract_duration,
    connectedAssetId: dbAsset.connected_asset_id,
    relatedAssetId: dbAsset.related_asset_id,
  };

  console.log("Mapped DB asset to frontend asset:", {
    id: asset.id,
    name: asset.name,
    status: asset.status,
    employeeId: asset.employeeId,
    isPoolDevice: asset.isPoolDevice
  });

  return asset;
};

// Map frontend Asset to database format
export const mapAssetToDbAsset = (asset: Asset): Partial<DbAsset> => {
  const dbAsset: Partial<DbAsset> = {
    id: asset.id,
    name: asset.name,
    type: asset.type,
    manufacturer: asset.manufacturer,
    model: asset.model,
    vendor: asset.vendor,
    status: asset.status,
    purchase_date: asset.purchaseDate,
    price: asset.price,
    employee_id: asset.employeeId,
    category: asset.category,
    serial_number: asset.serialNumber,
    inventory_number: asset.inventoryNumber,
    has_warranty: asset.hasWarranty,
    additional_warranty: asset.additionalWarranty,
    warranty_expiry_date: asset.warrantyExpiryDate,
    warranty_info: asset.warrantyInfo,
    image_url: asset.imageUrl,
    is_pool_device: asset.isPoolDevice,
    is_external: asset.isExternal,
    owner_company: asset.ownerCompany,
    project_id: asset.projectId,
    responsible_employee_id: asset.responsibleEmployeeId,
    handover_to_employee_date: asset.handoverToEmployeeDate,
    planned_return_date: asset.plannedReturnDate,
    actual_return_date: asset.actualReturnDate,
    classification: asset.classification,
    asset_owner_id: asset.assetOwnerId,
    last_review_date: asset.lastReviewDate,
    next_review_date: asset.nextReviewDate,
    risk_level: asset.riskLevel,
    is_personal_data: asset.isPersonalData,
    disposal_method: asset.disposalMethod,
    lifecycle_stage: asset.lifecycleStage,
    notes: asset.notes,
    imei: asset.imei,
    phone_number: asset.phoneNumber,
    provider: asset.provider,
    contract_end_date: asset.contractEndDate,
    contract_name: asset.contractName,
    contract_duration: asset.contractDuration,
    connected_asset_id: asset.connectedAssetId,
    related_asset_id: asset.relatedAssetId,
  };

  console.log("Mapped frontend asset to DB format:", {
    id: dbAsset.id,
    name: dbAsset.name,
    status: dbAsset.status,
    employee_id: dbAsset.employee_id,
    is_pool_device: dbAsset.is_pool_device
  });

  return dbAsset;
};
