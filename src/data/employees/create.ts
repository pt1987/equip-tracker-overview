
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a new employee in the database
 * @param employeeData The employee data to create
 * @returns The newly created employee ID or throws an error
 */
export const createEmployee = async (employeeData: {
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  cluster: string;
  competence_level?: string;
  start_date: string;
  budget: number;
  image_url?: string | null;
  profile_image?: string | null;
}): Promise<string> => {
  try {
    // Check if a profile with this email already exists
    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', employeeData.email)
      .limit(1);

    if (profileError) {
      console.error("Error checking existing profiles:", profileError);
      throw new Error(`Failed to check existing profiles: ${profileError.message}`);
    }

    let employeeId: string;
    
    if (existingProfiles && existingProfiles.length > 0) {
      // Use the existing profile ID
      employeeId = existingProfiles[0].id;
      
      // Check if employee already exists with this ID
      const { data: existingEmployee } = await supabase
        .from('employees')
        .select('id')
        .eq('id', employeeId)
        .limit(1);
        
      if (existingEmployee && existingEmployee.length > 0) {
        throw new Error(`An employee with this email already exists: ${employeeData.email}`);
      }
    } else {
      // Generate a UUID for the employee if no profile exists
      employeeId = crypto.randomUUID();
      
      // Create a profile for this employee to enable future authentication
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: employeeId,
          email: employeeData.email,
          name: `${employeeData.first_name} ${employeeData.last_name}`
        });
        
      if (createProfileError) {
        console.error("Failed to create profile for employee:", createProfileError);
        throw new Error(`Failed to create profile for employee: ${createProfileError.message}`);
      }
    }
    
    // Create the employee record
    const { error } = await supabase
      .from('employees')
      .insert([{
        id: employeeId,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        position: employeeData.position,
        cluster: employeeData.cluster,
        competence_level: employeeData.competence_level || 'Junior',
        start_date: employeeData.start_date,
        entry_date: employeeData.start_date,
        budget: employeeData.budget,
        used_budget: 0,
        image_url: employeeData.image_url,
        profile_image: employeeData.profile_image,
        email: employeeData.email,
      }]);
      
    if (error) {
      console.error("Failed to create employee:", error);
      throw new Error(`Failed to create employee: ${error.message}`);
    }
    
    return employeeId;
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to create employee";
    throw new Error(errorMessage);
  }
};
