
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/lib/types";

/**
 * Gets an employee by ID
 * @param id The employee ID to fetch
 * @returns Employee object or null if not found
 */
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
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
        profile_image,
        email
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching employee:", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email || '',
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
    console.error("Error in getEmployeeById:", error);
    return null;
  }
};

/**
 * Gets all employees
 * @returns Array of employees
 */
export const getEmployees = async (): Promise<Employee[]> => {
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
        profile_image,
        email
      `);

    if (error) {
      console.error("Error fetching employees:", error);
      return [];
    }

    if (!data) return [];

    return data.map(emp => ({
      id: emp.id,
      firstName: emp.first_name,
      lastName: emp.last_name,
      email: emp.email || '',
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
    console.error("Error in getEmployees:", error);
    return [];
  }
};

