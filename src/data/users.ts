
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
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }

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
    // Get users from profiles table (which has roles)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return [];
    }

    // Try to get auth users data to get last sign in time
    let authUsers = { users: [] };
    try {
      const { data, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError && data) {
        authUsers = data;
      }
    } catch (authError) {
      console.error("Error fetching auth users:", authError);
    }

    return profiles.map(profile => {
      // Find matching auth user
      const authUser = authUsers?.users?.find(u => u.id === profile.id);
      
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role || 'user',
        lastSignInAt: authUser?.last_sign_in_at || null,
        createdAt: profile.created_at
      };
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return [];
  }
};
