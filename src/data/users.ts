
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/lib/types";

/**
 * Updates a user's role in the database
 * @param userId The user ID to update
 * @param role The new role to assign
 * @returns Success status
 */
export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error("Error updating user role:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return false;
  }
};

/**
 * Deletes a user from the system
 * @param userId The user ID to delete
 * @returns Success status
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // First delete the user's profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      return false;
    }

    // We can't directly delete from auth.users with the client SDK
    // This would require a server-side function with admin rights
    // For now, we'll just delete the user's profile
    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return false;
  }
};

/**
 * Gets all users from the profiles table
 * @returns Array of users with their profile information
 */
export const getUsers = async () => {
  try {
    // Get all profiles (which includes employees and admins)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return [];
    }

    // Get all employees to merge data
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*');

    if (employeesError) {
      console.error("Error fetching employees:", employeesError);
    }

    return profiles.map(profile => {
      // Find matching employee data if exists
      const employeeData = employees?.find(e => e.id === profile.id || e.email === profile.email);
      
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name || (employeeData ? `${employeeData.first_name} ${employeeData.last_name}` : null),
        role: profile.role || 'user',
        lastSignInAt: null, // We can't get this from client SDK
        createdAt: profile.created_at,
        // Add additional employee info if available
        position: employeeData?.position,
        department: employeeData?.cluster
      };
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return [];
  }
};

/**
 * Creates a new user in the system
 * @param userData The user data to create
 * @returns The newly created user ID or null on error
 */
export const createUser = async (userData: {
  email: string;
  name: string;
  role: UserRole;
}): Promise<string | null> => {
  try {
    // Generate a unique ID for the new user
    const userId = crypto.randomUUID();
    
    // Create the user profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: userData.email,
        name: userData.name,
        role: userData.role
      });

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return userId;
  } catch (error) {
    console.error("Error in createUser:", error);
    return null;
  }
};
