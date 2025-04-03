import { supabase } from "@/integrations/supabase/client";
import { employees } from "@/data/employees";
import { assets, assetHistory } from "@/data/assets";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Function to check if data already exists in the database
export const checkDataExists = async (tableName: "employees" | "assets" | "asset_history"): Promise<boolean> => {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error(`Error checking if ${tableName} data exists:`, error);
    return false;
  }
  
  return count !== null && count > 0;
};

// Create mapping objects to keep track of converted IDs
const employeeIdMap = new Map<string, string>();
const assetIdMap = new Map<string, string>();

// Function to migrate employees data
export const migrateEmployees = async (): Promise<void> => {
  try {
    // Clear the ID map
    employeeIdMap.clear();
    
    // Create new employee records with proper UUIDs
    const employeesToInsert = employees.map(employee => {
      const newId = uuidv4();
      employeeIdMap.set(employee.id, newId);
      
      return {
        id: newId,
        first_name: employee.firstName,
        last_name: employee.lastName,
        start_date: employee.startDate,
        entry_date: employee.entryDate,
        cluster: employee.cluster,
        position: employee.position,
        budget: employee.budget,
        used_budget: employee.usedBudget,
        profile_image: employee.profileImage,
        image_url: employee.imageUrl
      };
    });

    const { error } = await supabase.from('employees').insert(employeesToInsert);

    if (error) throw error;
    console.log("Successfully migrated employees data");
  } catch (error) {
    console.error("Error migrating employees data:", error);
    throw error;
  }
};

// Function to migrate assets data
export const migrateAssets = async (): Promise<void> => {
  try {
    // Clear the ID map
    assetIdMap.clear();
    
    // Create new asset records with proper UUIDs
    const assetsToInsert = assets.map(asset => {
      const newId = uuidv4();
      assetIdMap.set(asset.id, newId);
      
      // Get the converted employee ID if it exists
      let employeeId = null;
      if (asset.employeeId) {
        employeeId = employeeIdMap.get(asset.employeeId) || null;
      }
      
      // Get the converted connected asset ID if it exists
      let connectedAssetId = null;
      if (asset.connectedAssetId) {
        connectedAssetId = assetIdMap.get(asset.connectedAssetId) || null;
      }
      
      // Get the converted related asset ID if it exists
      let relatedAssetId = null;
      if (asset.relatedAssetId) {
        relatedAssetId = assetIdMap.get(asset.relatedAssetId) || null;
      }
      
      return {
        id: newId,
        name: asset.name,
        type: asset.type,
        manufacturer: asset.manufacturer,
        model: asset.model,
        vendor: asset.vendor,
        purchase_date: asset.purchaseDate,
        price: asset.price,
        status: asset.status,
        category: asset.category,
        employee_id: employeeId,
        serial_number: asset.serialNumber,
        inventory_number: asset.inventoryNumber,
        imei: asset.imei,
        phone_number: asset.phoneNumber,
        provider: asset.provider,
        contract_name: asset.contractName,
        contract_duration: asset.contractDuration,
        contract_end_date: asset.contractEndDate,
        has_warranty: asset.hasWarranty,
        additional_warranty: asset.additionalWarranty,
        connected_asset_id: connectedAssetId,
        related_asset_id: relatedAssetId,
        image_url: asset.imageUrl
      };
    });

    const { error } = await supabase.from('assets').insert(assetsToInsert);

    if (error) throw error;
    console.log("Successfully migrated assets data");
  } catch (error) {
    console.error("Error migrating assets data:", error);
    throw error;
  }
};

// Function to migrate asset history data
export const migrateAssetHistory = async (): Promise<void> => {
  try {
    const historyToInsert = assetHistory.map(item => {
      // Get the converted asset ID
      const newAssetId = assetIdMap.get(item.assetId) || null;
      
      // Get the converted employee ID if it exists
      let employeeId = null;
      if (item.employeeId) {
        employeeId = employeeIdMap.get(item.employeeId) || null;
      }
      
      return {
        id: uuidv4(), // Generate a new UUID for the history item
        asset_id: newAssetId,
        date: item.date,
        action: item.action,
        employee_id: employeeId,
        notes: item.notes
      };
    });

    const { error } = await supabase.from('asset_history').insert(historyToInsert);

    if (error) throw error;
    console.log("Successfully migrated asset history data");
  } catch (error) {
    console.error("Error migrating asset history data:", error);
    throw error;
  }
};

// Function to migrate all data at once
export const migrateAllData = async (): Promise<void> => {
  try {
    await migrateEmployees();
    await migrateAssets();
    await migrateAssetHistory();
    console.log("Successfully migrated all data");
    toast.success("All data has been migrated successfully!");
  } catch (error) {
    console.error("Error migrating all data:", error);
    toast.error("Failed to migrate all data. Please check the console for details.");
    throw error;
  }
};

// Function to automatically migrate data if tables are empty
export const autoMigrateData = async (): Promise<void> => {
  try {
    const employeesExist = await checkDataExists('employees');
    const assetsExist = await checkDataExists('assets');
    const historyExists = await checkDataExists('asset_history');

    // Only migrate if all tables are empty
    if (!employeesExist && !assetsExist && !historyExists) {
      console.log("Starting automatic data migration...");
      toast.info("Initializing database with sample data...");
      await migrateAllData();
      toast.success("Sample data has been loaded successfully!");
    } else {
      console.log("Data already exists, skipping automatic migration");
    }
  } catch (error) {
    console.error("Error during automatic data migration:", error);
    toast.error("Failed to initialize database with sample data.");
  }
};
