
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates an existing employee in the database
 * @param id Employee ID to update
 * @param employeeData The employee data to update
 * @returns Boolean indicating success
 */
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
    
    // Update the employee record
    const { error } = await supabase
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
        profile_image: employeeData.profile_image,
        email: employeeData.email,
      })
      .eq('id', id);
      
    if (error) {
      console.error("Error updating employee record:", error);
      throw error;
    }
    
    console.log("Employee update completed successfully");
    return true;
  } catch (error) {
    console.error("Error in updateEmployee function:", error);
    return false;
  }
};
