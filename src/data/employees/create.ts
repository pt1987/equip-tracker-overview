
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
  start_date: string;
  budget: number;
  image_url?: string | null;
  profile_image?: string | null;
}): Promise<string> => {
  try {
    // Generate a UUID for the employee
    const employeeId = crypto.randomUUID();
    
    // Create the employee record
    const { error } = await supabase
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
