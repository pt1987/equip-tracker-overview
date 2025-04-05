import { supabase } from "@/integrations/supabase/client";
import { Employee, Asset } from "@/lib/types";
import { toast } from "sonner";

// Helper to convert database object to our Employee model
function mapDbEmployeeToEmployee(dbEmployee: any): Employee {
  return {
    id: dbEmployee.id,
    firstName: dbEmployee.first_name,
    lastName: dbEmployee.last_name,
    imageUrl: dbEmployee.image_url || '',
    startDate: dbEmployee.start_date,
    entryDate: dbEmployee.entry_date,
    cluster: dbEmployee.cluster,
    position: dbEmployee.position,
    budget: dbEmployee.budget,
    usedBudget: dbEmployee.used_budget,
    profileImage: dbEmployee.profile_image,
  };
}

// Helper to convert Employee model to database object
function mapEmployeeToDbEmployee(employee: Partial<Employee>): any {
  const dbEmployee: Record<string, any> = {};
  
  if (employee.firstName !== undefined) dbEmployee.first_name = employee.firstName;
  if (employee.lastName !== undefined) dbEmployee.last_name = employee.lastName;
  if (employee.imageUrl !== undefined) dbEmployee.image_url = employee.imageUrl;
  if (employee.startDate !== undefined) dbEmployee.start_date = employee.startDate;
  if (employee.entryDate !== undefined) dbEmployee.entry_date = employee.entryDate;
  if (employee.cluster !== undefined) dbEmployee.cluster = employee.cluster;
  if (employee.position !== undefined) dbEmployee.position = employee.position;
  if (employee.budget !== undefined) dbEmployee.budget = employee.budget;
  if (employee.usedBudget !== undefined) dbEmployee.used_budget = employee.usedBudget;
  if (employee.profileImage !== undefined) dbEmployee.profile_image = employee.profileImage;
  
  return dbEmployee;
}

// Helper to convert database asset to our Asset model
function mapDbAssetToAsset(dbAsset: any): Asset {
  return {
    id: dbAsset.id,
    name: dbAsset.name,
    type: dbAsset.type,
    manufacturer: dbAsset.manufacturer,
    model: dbAsset.model,
    purchaseDate: dbAsset.purchase_date,
    vendor: dbAsset.vendor,
    price: dbAsset.price,
    status: dbAsset.status,
    employeeId: dbAsset.employee_id,
    category: dbAsset.category,
    serialNumber: dbAsset.serial_number,
    inventoryNumber: dbAsset.inventory_number,
    additionalWarranty: dbAsset.additional_warranty,
    hasWarranty: dbAsset.has_warranty,
    imei: dbAsset.imei,
    phoneNumber: dbAsset.phone_number,
    provider: dbAsset.provider,
    contractEndDate: dbAsset.contract_end_date,
    contractName: dbAsset.contract_name,
    contractDuration: dbAsset.contract_duration,
    connectedAssetId: dbAsset.connected_asset_id,
    relatedAssetId: dbAsset.related_asset_id,
    imageUrl: dbAsset.image_url,
  };
}

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*');
    
    if (error) throw error;
    return (data || []).map(mapDbEmployeeToEmployee);
  } catch (error) {
    console.error("Error fetching employees:", error);
    toast.error("Failed to fetch employees");
    return [];
  }
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    console.log("Fetching employee with ID:", id);
    
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No employee found with ID:", id);
      return null;
    }
    
    console.log("Employee found:", data);
    return mapDbEmployeeToEmployee(data);
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    toast.error("Failed to fetch employee details");
    return null;
  }
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
  try {
    console.log("Creating employee:", employee);
    const dbEmployee = mapEmployeeToDbEmployee(employee);
    
    const { data, error } = await supabase
      .from('employees')
      .insert([dbEmployee])
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned after insert");
    }
    
    console.log("Employee created:", data);
    toast.success("Employee created successfully");
    return mapDbEmployeeToEmployee(data);
  } catch (error) {
    console.error("Error creating employee:", error);
    toast.error("Failed to create employee");
    return null;
  }
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee | null> => {
  try {
    console.log("Updating employee with ID:", id);
    console.log("Update data:", employee);
    
    const dbEmployee = mapEmployeeToDbEmployee(employee);
    
    const { data, error } = await supabase
      .from('employees')
      .update(dbEmployee)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No data returned after update");
    }
    
    console.log("Update successful, returned data:", data);
    toast.success("Employee updated successfully");
    return mapDbEmployeeToEmployee(data);
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    toast.error("Failed to update employee");
    return null;
  }
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success("Employee deleted successfully");
    return true;
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error);
    toast.error("Failed to delete employee");
    return false;
  }
};

export const getEmployeeAssetsSummary = async (employeeId: string) => {
  try {
    const { data: employeeAssets, error } = await supabase
      .from('assets')
      .select('*')
      .eq('employee_id', employeeId);
    
    if (error) throw error;
    
    const mappedAssets = employeeAssets.map(asset => mapDbAssetToAsset(asset));
    const totalValue = mappedAssets.reduce((sum, asset) => sum + asset.price, 0);
    
    // Define asset types with proper type casting
    const assetsByType = {
      laptop: mappedAssets.filter(asset => asset.type === 'laptop'),
      smartphone: mappedAssets.filter(asset => asset.type === 'smartphone'),
      tablet: mappedAssets.filter(asset => asset.type === 'tablet'),
      mouse: mappedAssets.filter(asset => asset.type === 'mouse'),
      keyboard: mappedAssets.filter(asset => asset.type === 'keyboard'),
      accessory: mappedAssets.filter(asset => asset.type === 'accessory')
    };
    
    return {
      totalAssets: mappedAssets.length,
      totalValue,
      assetsByType
    };
  } catch (error) {
    console.error(`Error fetching asset summary for employee ${employeeId}:`, error);
    toast.error("Failed to fetch employee assets summary");
    return {
      totalAssets: 0,
      totalValue: 0,
      assetsByType: {
        laptop: [],
        smartphone: [],
        tablet: [],
        mouse: [],
        keyboard: [],
        accessory: []
      }
    };
  }
};
