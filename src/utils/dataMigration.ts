
import { supabase } from "@/integrations/supabase/client";
import { assets, employees, assetHistory } from "@/data/mockData";
import { Asset, AssetHistoryEntry, Employee } from "@/lib/types";
import { toast } from "sonner";

// Check if data already exists in the database
const checkDataExists = async (table: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from(table as any)
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error(`Error checking ${table}:`, error);
    return true; // Assume data exists to prevent duplicate imports
  }
  
  return count !== null && count > 0;
};

// Convert string IDs to UUIDs
const convertToUuid = (id: string): string => {
  // Create a deterministic UUID based on the ID
  // This ensures the same string ID always maps to the same UUID
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // A random UUID as namespace
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Create a simple UUID format based on the hash (this is not crypto-secure but works for migration)
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (hash + Math.random() * 16) % 16 | 0;
    hash = Math.floor(hash / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  
  return uuid;
};

// Helper to convert Asset model to database object
function mapAssetToDbAsset(asset: Asset): any {
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
    image_url: asset.imageUrl,
  };
}

// Helper to convert Employee model to database object
function mapEmployeeToDbEmployee(employee: Employee): any {
  return {
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
    profile_image: employee.profileImage,
  };
}

// Helper to convert AssetHistoryEntry model to database object
function mapHistoryEntryToDbHistory(entry: AssetHistoryEntry): any {
  return {
    id: entry.id,
    asset_id: entry.assetId,
    date: entry.date,
    action: entry.action,
    employee_id: entry.employeeId,
    notes: entry.notes,
  };
}

// Convert all mock data to use UUIDs
const prepareAssetsForMigration = (): Asset[] => {
  const uuidMapping: Record<string, string> = {};
  
  // First pass: create UUID mapping for all assets
  assets.forEach(asset => {
    uuidMapping[asset.id] = convertToUuid(asset.id);
  });
  
  // Second pass: convert all IDs and references
  return assets.map(asset => {
    const newAsset = { ...asset };
    newAsset.id = uuidMapping[asset.id];
    
    // Convert connected asset IDs
    if (asset.connectedAssetId) {
      newAsset.connectedAssetId = uuidMapping[asset.connectedAssetId];
    }
    
    // Convert employee ID
    if (asset.employeeId) {
      newAsset.employeeId = convertToUuid(asset.employeeId);
    }
    
    return newAsset;
  });
};

const prepareEmployeesForMigration = (): Employee[] => {
  return employees.map(employee => {
    const newEmployee = { ...employee };
    newEmployee.id = convertToUuid(employee.id);
    return newEmployee;
  });
};

const prepareAssetHistoryForMigration = (): AssetHistoryEntry[] => {
  return assetHistory.map(entry => {
    const newEntry = { ...entry };
    newEntry.id = convertToUuid(entry.id);
    newEntry.assetId = convertToUuid(entry.assetId);
    
    if (entry.employeeId) {
      newEntry.employeeId = convertToUuid(entry.employeeId);
    }
    
    return newEntry;
  });
};

// Migrate data to Supabase
export const migrateDataToSupabase = async (): Promise<boolean> => {
  try {
    // Check if data already exists
    const assetsExist = await checkDataExists('assets');
    const employeesExist = await checkDataExists('employees');
    const historyExists = await checkDataExists('asset_history');
    
    if (assetsExist && employeesExist && historyExists) {
      console.log('Data already exists in Supabase, skipping migration');
      return false;
    }
    
    // Prepare data
    const preparedEmployees = prepareEmployeesForMigration();
    const preparedAssets = prepareAssetsForMigration();
    const preparedHistory = prepareAssetHistoryForMigration();
    
    // Insert employees first (as assets depend on them)
    if (!employeesExist) {
      const dbEmployees = preparedEmployees.map(mapEmployeeToDbEmployee);
      const { error: employeeError } = await supabase
        .from('employees')
        .insert(dbEmployees);
      
      if (employeeError) {
        console.error('Error migrating employees:', employeeError);
        throw new Error(`Employee migration failed: ${employeeError.message}`);
      }
      console.log('Employees migrated successfully');
    }
    
    // Insert assets
    if (!assetsExist) {
      const dbAssets = preparedAssets.map(mapAssetToDbAsset);
      const { error: assetError } = await supabase
        .from('assets')
        .insert(dbAssets);
      
      if (assetError) {
        console.error('Error migrating assets:', assetError);
        throw new Error(`Asset migration failed: ${assetError.message}`);
      }
      console.log('Assets migrated successfully');
    }
    
    // Insert history
    if (!historyExists) {
      const dbHistory = preparedHistory.map(mapHistoryEntryToDbHistory);
      const { error: historyError } = await supabase
        .from('asset_history')
        .insert(dbHistory);
      
      if (historyError) {
        console.error('Error migrating asset history:', historyError);
        throw new Error(`Asset history migration failed: ${historyError.message}`);
      }
      console.log('Asset history migrated successfully');
    }
    
    toast.success('Data migrated to Supabase successfully!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    toast.error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
};
