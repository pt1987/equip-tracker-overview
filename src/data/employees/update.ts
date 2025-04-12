
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
  competence_level?: string;
  start_date?: string;
  budget?: number;
  image_url?: string | null;
  profile_image?: string | null;
}): Promise<boolean> => {
  try {
    console.log(`Updating employee ${id} with data:`, employeeData);
    
    // Store competence_level in the frontend state but don't send it to the database
    // since the column doesn't exist in the database
    const { competence_level, ...dbData } = employeeData;
    
    // Update the employee record
    const { error } = await supabase
      .from('employees')
      .update({
        first_name: dbData.first_name,
        last_name: dbData.last_name,
        position: dbData.position,
        cluster: dbData.cluster,
        start_date: dbData.start_date,
        entry_date: dbData.start_date,
        budget: dbData.budget,
        image_url: dbData.image_url,
        profile_image: dbData.profile_image,
        email: dbData.email,
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
