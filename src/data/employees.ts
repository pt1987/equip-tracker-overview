
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

    // Get email from profiles table using service role to bypass RLS
    const { data: profileData, error: profileError } = await supabase.auth.admin.getUserById(id);
    
    let email = '';
    
    // If we couldn't get email from auth, try the profiles table
    if (profileError || !profileData) {
      console.log("Trying to get email from profiles table directly");
      // Try to get email from profiles table directly as fallback
      const { data: profileRecord, error: profilesError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', id)
        .single();
        
      if (!profilesError && profileRecord) {
        email = profileRecord.email || '';
        console.log("Found email in profiles table:", email);
      } else {
        console.error("Error fetching profile:", profilesError);
      }
    } else if (profileData) {
      email = profileData.user.email || '';
      console.log("Found email in auth user data:", email);
    }

    console.log("Employee object to return:", {
      id: employeeData.id,
      email: email,
      firstName: employeeData.first_name,
      lastName: employeeData.last_name
    });

    return {
      id: employeeData.id,
      firstName: employeeData.first_name,
      lastName: employeeData.last_name,
      email: email, // Always include the email field
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
    
    // Log before email update attempt
    console.log("Employee record updated successfully. Email to update:", employeeData.email);
    
    // Update email in profiles table if provided
    if (employeeData.email) {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', id)
        .single();
        
      if (existingProfile) {
        console.log(`Profile exists for user ${id}, updating email to ${employeeData.email}`);
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            email: employeeData.email,
            name: `${employeeData.first_name} ${employeeData.last_name}`
          })
          .eq('id', id);
          
        if (updateError) {
          console.error("Error updating profile:", updateError);
          // Continue execution even if this fails - we at least updated the employee
        }
      } else {
        console.log(`Profile does not exist for user ${id}, creating new profile with email ${employeeData.email}`);
        // Create new profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: id, 
            email: employeeData.email, 
            name: `${employeeData.first_name} ${employeeData.last_name}`
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
          // Continue execution even if this fails - we at least updated the employee
        }
      }
    }
    
    console.log("Employee update completed successfully");
    return true;
  } catch (error) {
    console.error("Error in updateEmployee function:", error);
    return false;
  }
};
