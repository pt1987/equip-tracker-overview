
import { Asset, AssetType, AssetStatus } from "@/lib/types";

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
    imageUrl: dbAsset.image_url || undefined
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
    image_url: asset.imageUrl || null
  };
};
