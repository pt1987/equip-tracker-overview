
import { supabase } from "@/integrations/supabase/client";
import { Asset, Employee as EmployeeType } from "@/lib/types";

// This interface is for internal use in this file only
interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  cluster: string;
  startDate?: string | Date;
  entryDate?: string;
  budget: number;
  usedBudget: number;
  imageUrl?: string;
  profileImage?: string;
  assets?: Asset[];
}

export const getEmployeeById = async (id: string): Promise<EmployeeType | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        id,
        first_name,
        last_name,
        position,
        cluster,
        start_date,
        entry_date,
        budget,
        used_budget,
        image_url,
        profile_image
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    // Try to get email from profiles table if possible, but don't fail if we can't
    let email = '';
    try {
      // Just try to get profile by employee ID
      const { data: profileData } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', id)
        .maybeSingle();
          
      if (profileData) {
        email = profileData.email;
      }
    } catch (profileError) {
      console.error("Error fetching profile data:", profileError);
    }

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: email,
      position: data.position,
      cluster: data.cluster,
      startDate: data.start_date || '',
      entryDate: data.entry_date,
      budget: data.budget || 0,
      usedBudget: data.used_budget || 0,
      imageUrl: data.image_url || undefined,
      profileImage: data.profile_image || undefined,
    };
  } catch (error) {
    console.error("Error fetching employee:", error);
    return null;
  }
};

export const getEmployees = async (): Promise<EmployeeType[]> => {
  try {
    // Get all employees from employees table
    const { data: employeesData, error: employeesError } = await supabase
      .from('employees')
      .select(`
        id,
        first_name,
        last_name,
        position,
        cluster,
        start_date,
        entry_date,
        budget,
        used_budget,
        image_url,
        profile_image
      `);

    if (employeesError) throw employeesError;

    // Try to get emails from profiles table if possible
    let emailMap = new Map<string, string>();
    try {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email');

      if (profilesData) {
        profilesData.forEach(profile => {
          if (profile.id && profile.email) {
            emailMap.set(profile.id, profile.email);
          }
        });
      }
    } catch (profileError) {
      console.error("Error fetching profiles:", profileError);
    }

    return employeesData.map(emp => ({
      id: emp.id,
      firstName: emp.first_name,
      lastName: emp.last_name,
      email: emailMap.get(emp.id) || '',
      position: emp.position,
      cluster: emp.cluster,
      startDate: emp.start_date || '',
      entryDate: emp.entry_date,
      budget: emp.budget || 0,
      usedBudget: emp.used_budget || 0,
      imageUrl: emp.image_url || undefined,
      profileImage: emp.profile_image || undefined,
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return false;
  }
};

export const getEmployeeAssetsSummary = async (employeeId: string) => {
  return {
    totalAssets: 0,
    totalValue: 0,
    assetsByType: {}
  };
};

export const createEmployee = async (employeeData: {
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  cluster: string;
  start_date: string;
  budget: number;
  image_url?: string | null;
  profile_image?: string | null;
}): Promise<string> => {
  try {
    // Generate a UUID for the employee
    const employeeId = crypto.randomUUID();
    
    // Create the employee record without trying to reference profiles table
    const { error: employeeError } = await supabase
      .from('employees')
      .insert([{
        id: employeeId,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        position: employeeData.position,
        cluster: employeeData.cluster,
        start_date: employeeData.start_date,
        entry_date: employeeData.start_date,
        budget: employeeData.budget,
        used_budget: 0,
        image_url: employeeData.image_url,
        profile_image: employeeData.profile_image,
      }]);
      
    if (employeeError) {
      console.error("Failed to create employee:", employeeError);
      throw new Error(`Failed to create employee: ${employeeError.message}`);
    }
    
    return employeeId;
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to create employee";
    throw new Error(errorMessage);
  }
};

export const updateEmployee = async (id: string, employeeData: {
  first_name?: string;
  last_name?: string;
  email?: string;
  position?: string;
  cluster?: string;
  start_date?: string;
  budget?: number;
  image_url?: string | null;
  profile_image?: string | null;
}): Promise<boolean> => {
  try {
    // Update the employee record
    const { error: employeeError } = await supabase
      .from('employees')
      .update({
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        position: employeeData.position,
        cluster: employeeData.cluster,
        start_date: employeeData.start_date,
        entry_date: employeeData.start_date,
        budget: employeeData.budget,
        image_url: employeeData.image_url,
        profile_image: employeeData.profile_image
      })
      .eq('id', id);
      
    if (employeeError) throw employeeError;
    
    return true;
  } catch (error) {
    console.error("Error updating employee:", error);
    return false;
  }
};
