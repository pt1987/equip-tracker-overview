
import { assets, assetHistory } from "@/data/assets";
import { employees } from "@/data/employees";
import { supabase } from "@/integrations/supabase/client";

// Function to convert camelCase to snake_case for database field conversion
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Function to transform an object's keys from camelCase to snake_case
const transformToSnakeCase = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    const snakeKey = toSnakeCase(key);
    result[snakeKey] = obj[key];
  });
  return result;
};

// Function to migrate employees data
export const migrateEmployees = async (): Promise<void> => {
  console.log('Starting employee migration...');
  
  for (const employee of employees) {
    // Convert data to snake_case for the database
    const dbEmployee = {
      id: employee.id,
      first_name: employee.firstName,
      last_name: employee.lastName,
      image_url: employee.imageUrl,
      start_date: employee.startDate,
      entry_date: employee.entryDate || employee.startDate,
      cluster: employee.cluster,
      position: employee.position,
      budget: employee.budget,
      used_budget: employee.usedBudget,
      profile_image: employee.profileImage
    };
    
    // Insert employee into database
    const { error } = await supabase
      .from('employees')
      .upsert(dbEmployee)
      .select();
    
    if (error) {
      console.error(`Error migrating employee ${employee.id}:`, error);
    } else {
      console.log(`Migrated employee: ${employee.firstName} ${employee.lastName}`);
    }
  }
  
  console.log('Employee migration completed');
};

// Function to migrate assets data
export const migrateAssets = async (): Promise<void> => {
  console.log('Starting asset migration...');
  
  for (const asset of assets) {
    // Convert data to snake_case for the database
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
      category: asset.category || "other",
      serial_number: asset.serialNumber,
      inventory_number: asset.inventoryNumber,
      additional_warranty: asset.additionalWarranty,
      has_warranty: asset.hasWarranty,
      imei: asset.imei,
      phone_number: asset.phoneNumber,
      provider: asset.provider,
      contract_end_date: asset.contractEndDate,
      contract_name: asset.contractName,
      contract_duration: asset.contractDuration,
      connected_asset_id: asset.connectedAssetId,
      related_asset_id: asset.relatedAssetId,
      image_url: asset.imageUrl
    };
    
    // Insert asset into database
    const { error } = await supabase
      .from('assets')
      .upsert(dbAsset)
      .select();
    
    if (error) {
      console.error(`Error migrating asset ${asset.id}:`, error);
    } else {
      console.log(`Migrated asset: ${asset.name}`);
    }
  }
  
  console.log('Asset migration completed');
};

// Function to migrate asset history data
export const migrateAssetHistory = async (): Promise<void> => {
  console.log('Starting asset history migration...');
  
  for (const history of assetHistory) {
    // Convert data to snake_case for the database
    const dbHistory = {
      id: history.id,
      asset_id: history.assetId,
      date: history.date,
      action: history.action,
      employee_id: history.employeeId,
      notes: history.notes
    };
    
    // Insert history into database
    const { error } = await supabase
      .from('asset_history')
      .upsert(dbHistory)
      .select();
    
    if (error) {
      console.error(`Error migrating history ${history.id}:`, error);
    } else {
      console.log(`Migrated history item for asset: ${history.assetId}`);
    }
  }
  
  console.log('Asset history migration completed');
};

// Function to run all migrations
export const migrateAllData = async (): Promise<void> => {
  try {
    console.log('Starting data migration to Supabase...');
    
    // Run in sequence to avoid any dependency issues
    await migrateEmployees();
    await migrateAssets();
    await migrateAssetHistory();
    
    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error during data migration:', error);
  }
};

// Auto-execute migration if this script is run directly
if (typeof window !== 'undefined') {
  console.log('Data migration script loaded');
}
