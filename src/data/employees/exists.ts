
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if an employee exists in the database
 * @param employeeId The ID of the employee to check
 * @returns True if employee exists, false otherwise
 */
export const checkEmployeeExists = async (employeeId: string | null): Promise<boolean> => {
  if (!employeeId) return false;
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('id')
      .eq('id', employeeId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking if employee ${employeeId} exists:`, error);
    return false;
  }
};
