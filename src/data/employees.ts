import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/lib/types";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  cluster: string;
  startDate?: Date;
  entryDate?: string;
  budget: number;
  usedBudget?: number;
  imageUrl?: string;
  profileImage?: string;
  assets?: Asset[];
}

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
        profiles (
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.profiles?.email || '',
      position: data.position,
      cluster: data.cluster,
      startDate: data.start_date ? new Date(data.start_date) : undefined,
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
        profiles (
          email
        )
      `);

    if (error) throw error;

    return data.map(emp => ({
      id: emp.id,
      firstName: emp.first_name,
      lastName: emp.last_name,
      email: emp.profiles?.email || '',
      position: emp.position,
      cluster: emp.cluster,
      startDate: emp.start_date ? new Date(emp.start_date) : undefined,
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
