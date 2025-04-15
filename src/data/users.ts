
import { supabase } from "@/integrations/supabase/client";
import { UserPermissions, UserRole } from "@/lib/types";

/**
 * Updates a user's role in the database
 * @param userId The user ID to update
 * @param role The new role to assign
 * @returns Success status
 */
export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Update the user's role in the profiles table
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
    // Delete the user's profile first
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      return false;
    }

    // We can't directly delete from auth.users with the client SDK
    // For comprehensive user deletion, a server-side function with admin rights would be needed
    // Here we're just removing the profile
    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return false;
  }
};

/**
 * Gets all users from the system (combines profiles with employee data)
 * @returns Array of unified users with their profile and employee information
 */
export const getUsers = async () => {
  try {
    // Get all profiles first
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return [];
    }

    // Get all employee data 
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*');

    if (employeesError) {
      console.error("Error fetching employees:", employeesError);
      return [];
    }

    // Create a map of existing profile IDs for quick lookup
    const profileIds = new Set(profiles.map(profile => profile.id));
    
    // Process profile users first
    let allUsers = profiles.map(profile => {
      // Find matching employee data if it exists
      const employeeData = employees?.find(e => 
        e.id === profile.id || 
        e.user_id === profile.id || 
        e.email === profile.email
      );
      
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name || (employeeData ? `${employeeData.first_name} ${employeeData.last_name}` : null),
        role: profile.role || 'user',
        lastSignInAt: null,
        createdAt: profile.created_at,
        position: employeeData?.position,
        department: employeeData?.cluster,
        isEmployee: !!employeeData,
        employeeId: employeeData?.id
      };
    });
    
    // Now add employees that don't have profiles yet
    for (const employee of employees || []) {
      // Skip employees already linked to profiles
      if (profileIds.has(employee.id) || 
          (employee.user_id && profileIds.has(employee.user_id))) {
        continue;
      }
      
      // Add this employee as a user
      allUsers.push({
        id: employee.id,
        email: employee.email || `${employee.first_name.toLowerCase()}.${employee.last_name.toLowerCase()}@example.com`,
        name: `${employee.first_name} ${employee.last_name}`,
        role: 'user',
        lastSignInAt: null,
        createdAt: employee.created_at,
        position: employee.position,
        department: employee.cluster,
        isEmployee: true,
        employeeId: employee.id
      });
    }
    
    console.log(`Total users found: ${allUsers.length} (${profiles.length} profiles, ${employees?.length || 0} employees)`);
    return allUsers;
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

/**
 * Checks if a user has a specific permission
 * @param role The user's role
 * @param permission The permission to check
 * @returns True if the user has the permission
 */
export const hasPermission = (role: UserRole | null, permission: keyof UserPermissions): boolean => {
  // Get the permissions for this role
  const permissions = getRolePermissions(role);
  // Fix: Use explicit boolean check to ensure we return a boolean
  return Boolean(permissions[permission]);
};

/**
 * Gets all permissions for a specific role
 * @param role The role to get permissions for
 * @returns The permissions object
 */
export const getRolePermissions = (role: UserRole | null): UserPermissions => {
  // Default permissions (for regular users)
  const defaultPermissions: UserPermissions = {
    canAccessAdmin: false,
    canEditAssets: false,
    canCreateEmployees: false,
    canEditEmployees: false,
    canEditOwnAssets: true,
    canEditOwnProfile: true,
    canViewReports: true
  };

  if (!role) {
    return defaultPermissions;
  }

  // Role-specific permissions
  switch (role) {
    case 'admin':
      return {
        canAccessAdmin: true,
        canEditAssets: true,
        canCreateEmployees: true,
        canEditEmployees: true,
        canEditOwnAssets: true,
        canEditOwnProfile: true,
        canViewReports: true
      };
    case 'editor':
      return {
        canAccessAdmin: false,
        canEditAssets: true,
        canCreateEmployees: true,
        canEditEmployees: true,
        canEditOwnAssets: true,
        canEditOwnProfile: true,
        canViewReports: true
      };
    case 'user':
    default:
      return defaultPermissions;
  }
};
