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

export * from './employees/storage';

export const getEmployeeById = async (id: string): Promise<EmployeeType | null> => {
  try {
    // Get the employee data from employees table
    const { data: employeeData, error: employeeError } = await supabase
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

    if (employeeError) {
      console.error("Error fetching employee:", employeeError);
      throw employeeError;
    }

    if (!employeeData) return null;

    // Get email using our secure function
    const { data: emailData, error: emailError } = await supabase
      .rpc('get_safe_user_email', { user_id: id }) as { data: string | null, error: any };
    
    let email = '';
    
    if (emailError) {
      console.error("Error fetching email using RPC:", emailError);
    } else {
      email = emailData || '';
      console.log("Found email using secure function:", email);
    }

    return {
      id: employeeData.id,
      firstName: employeeData.first_name,
      lastName: employeeData.last_name,
      email: email,
      position: employeeData.position,
      cluster: employeeData.cluster,
      startDate: employeeData.start_date || '',
      entryDate: employeeData.entry_date,
      budget: employeeData.budget || 0,
      usedBudget: employeeData.used_budget || 0,
      imageUrl: employeeData.image_url || undefined,
      profileImage: employeeData.profile_image || undefined,
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

    // Use a map to store emails for each employee
    const emails = new Map<string, string>();
    
    // For each employee, try to get their email using our secure function
    for (const emp of employeesData) {
      try {
        const { data: emailData } = await supabase
          .rpc('get_safe_user_email', { user_id: emp.id }) as { data: string | null, error: any };
          
        if (emailData) {
          emails.set(emp.id, emailData);
        }
      } catch (err) {
        console.error(`Error fetching email for employee ${emp.id}:`, err);
      }
    }

    return employeesData.map(emp => ({
      id: emp.id,
      firstName: emp.first_name,
      lastName: emp.last_name,
      email: emails.get(emp.id) || '',
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
    
    // Update email separately using our secure function
    if (employeeData.email) {
      const { data: emailUpdateResult, error: emailUpdateError } = await supabase
        .rpc('update_user_email', {
          user_id: employeeId,
          new_email: employeeData.email
        }) as { data: boolean | null, error: any };
        
      if (emailUpdateError) {
        console.error("Error updating email:", emailUpdateError);
        // Continue anyway, we at least created the employee
      }
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
    console.log(`Updating employee ${id} with data:`, employeeData);
    
    // Update the employee record first
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
      
    if (employeeError) {
      console.error("Error updating employee record:", employeeError);
      throw employeeError;
    }
    
    // Update email separately using our secure function
    if (employeeData.email) {
      console.log(`Updating email for user ${id} to ${employeeData.email} using RPC function`);
      
      const { data: emailUpdateResult, error: emailUpdateError } = await supabase
        .rpc('update_user_email', {
          user_id: id,
          new_email: employeeData.email
        }) as { data: boolean | null, error: any };
        
      if (emailUpdateError) {
        console.error("Error updating email with RPC function:", emailUpdateError);
        // Continue execution - we at least updated the employee
      } else {
        console.log("Email update result:", emailUpdateResult);
      }
    }
    
    console.log("Employee update completed successfully");
    return true;
  } catch (error) {
    console.error("Error in updateEmployee function:", error);
    return false;
  }
};
