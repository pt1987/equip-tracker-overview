
import { supabase } from "@/integrations/supabase/client";
import { employees } from "@/data/employees";
import { assets } from "@/data/assets";
import { getAssetsHistory } from "@/data/assets"; 
import { toast } from "sonner";

// Function to check if data already exists in the database
export const checkDataExists = async (tableName: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error(`Error checking if ${tableName} data exists:`, error);
    return false;
  }
  
  return count !== null && count > 0;
};

// Function to migrate employees data
export const migrateEmployees = async (): Promise<void> => {
  try {
    const { error } = await supabase.from('employees').insert(
      employees.map(employee => ({
        id: employee.id,
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
      }))
    );

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
    const { error } = await supabase.from('assets').insert(
      assets.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        manufacturer: asset.manufacturer,
        model: asset.model,
        vendor: asset.vendor,
        purchase_date: asset.purchaseDate,
        price: asset.price,
        status: asset.status,
        category: asset.category,
        employee_id: asset.employeeId,
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
        connected_asset_id: asset.connectedAssetId,
        related_asset_id: asset.relatedAssetId,
        image_url: asset.imageUrl
      }))
    );

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
    const history = getAssetsHistory();
    const { error } = await supabase.from('asset_history').insert(
      history.map(item => ({
        id: item.id,
        asset_id: item.assetId,
        date: item.date,
        action: item.action,
        employee_id: item.employeeId,
        notes: item.notes
      }))
    );

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
  } catch (error) {
    console.error("Error migrating all data:", error);
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
