
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/lib/types";
import { toast } from "sonner";

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*');
    
    if (error) throw error;
    return data || [];
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
    return data;
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    toast.error("Failed to fetch employee details");
    return null;
  }
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Employee created successfully");
    return data;
  } catch (error) {
    console.error("Error creating employee:", error);
    toast.error("Failed to create employee");
    return null;
  }
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success("Employee updated successfully");
    return data;
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
    
    const totalValue = employeeAssets.reduce((sum, asset) => sum + asset.price, 0);
    const assetsByType = {
      laptop: employeeAssets.filter(asset => asset.type === 'laptop'),
      smartphone: employeeAssets.filter(asset => asset.type === 'smartphone'),
      tablet: employeeAssets.filter(asset => asset.type === 'tablet'),
      mouse: employeeAssets.filter(asset => asset.type === 'mouse'),
      keyboard: employeeAssets.filter(asset => asset.type === 'keyboard'),
      accessory: employeeAssets.filter(asset => asset.type === 'accessory')
    };
    
    return {
      totalAssets: employeeAssets.length,
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
