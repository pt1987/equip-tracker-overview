
import { Employee } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

// Helper functions to retrieve employee data from Supabase
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    imageUrl: data.image_url,
    startDate: data.start_date,
    entryDate: data.entry_date,
    cluster: data.cluster,
    position: data.position,
    budget: data.budget,
    usedBudget: data.used_budget,
    profileImage: data.profile_image
  };
};

// Get all employees from Supabase
export const getEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*');
  
  if (error || !data) return [];
  
  return data.map(employee => ({
    id: employee.id,
    firstName: employee.first_name,
    lastName: employee.last_name,
    imageUrl: employee.image_url,
    startDate: employee.start_date,
    entryDate: employee.entry_date,
    cluster: employee.cluster,
    position: employee.position,
    budget: employee.budget,
    usedBudget: employee.used_budget,
    profileImage: employee.profile_image
  }));
};

// Get employee assets summary
export const getEmployeeAssetsSummary = async (employeeId: string) => {
  const { data: employeeAssets, error } = await supabase
    .from('assets')
    .select('*')
    .eq('employee_id', employeeId);
  
  if (error || !employeeAssets) {
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
};
