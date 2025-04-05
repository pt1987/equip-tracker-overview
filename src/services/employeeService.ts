
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/lib/types";
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
  return {
    first_name: employee.firstName,
    last_name: employee.lastName,
    image_url: employee.imageUrl,
    start_date: employee.startDate,
    entry_date: employee.entryDate,
    cluster: employee.cluster,
    position: employee.position,
    budget: employee.budget,
    used_budget: employee.usedBudget,
    profile_image: employee.profileImage,
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
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? mapDbEmployeeToEmployee(data) : null;
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    toast.error("Failed to fetch employee details");
    return null;
  }
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
  try {
    const dbEmployee = mapEmployeeToDbEmployee(employee);
    
    const { data, error } = await supabase
      .from('employees')
      .insert([dbEmployee])
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Employee created successfully");
    return data ? mapDbEmployeeToEmployee(data) : null;
  } catch (error) {
    console.error("Error creating employee:", error);
    toast.error("Failed to create employee");
    return null;
  }
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee | null> => {
  try {
    const dbEmployee = mapEmployeeToDbEmployee(employee);
    
    const { data, error } = await supabase
      .from('employees')
      .update(dbEmployee)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Employee updated successfully");
    return data ? mapDbEmployeeToEmployee(data) : null;
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
    
    const mappedAssets = employeeAssets.map(mapDbAssetToAsset);
    const totalValue = mappedAssets.reduce((sum, asset) => sum + asset.price, 0);
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
