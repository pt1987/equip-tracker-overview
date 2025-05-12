
import { supabase } from "@/integrations/supabase/client";
import { AssetHistoryAction, AssetStatus } from "@/lib/types";
import { format } from "date-fns";

// Function to add an entry to the asset history
export const addAssetHistoryEntry = async (
  assetId: string,
  action: AssetHistoryAction,
  employeeId: string | null,
  notes: string,
  userId?: string | null
): Promise<void> => {
  try {
    console.log(`Adding history entry: asset=${assetId}, action=${action}, employee=${employeeId}, userId=${userId || 'null'}`);
    
    // Make sure user ID is not undefined to prevent "System" attribution when a user is actually logged in
    const actualUserId = userId || null;
    
    const { error } = await supabase
      .from('asset_history')
      .insert({
        asset_id: assetId,
        action,
        employee_id: employeeId,
        notes,
        user_id: actualUserId
      });
      
    if (error) {
      console.error("Error adding asset history entry:", error);
      throw error;
    }
    
    console.log(`Added ${action} history entry for asset ${assetId} by user ${userId || 'System'}`);
    return;
  } catch (error) {
    console.error("Failed to add history entry:", error);
    // We don't re-throw here to prevent blocking asset operations if history fails
  }
};

// Function to determine the appropriate action type based on status change
export const getActionTypeForStatusChange = (
  previousStatus: AssetStatus, 
  newStatus: AssetStatus
): AssetHistoryAction => {
  if (newStatus === 'delivered' && previousStatus === 'ordered') {
    return 'delivery';
  } else if (newStatus === 'repair') {
    return 'repair';
  } else if (newStatus === 'disposed') {
    return 'dispose';
  } else if (newStatus === 'pool') {
    return 'return';
  } else {
    return 'status_change';
  }
};

// Function to generate a descriptive note for status changes
export const generateStatusChangeNote = (
  previousStatus: AssetStatus, 
  newStatus: AssetStatus
): string => {
  return `Status geändert von "${getStatusLabel(previousStatus)}" zu "${getStatusLabel(newStatus)}"`;
};

// Function to get a user-friendly label for status
const getStatusLabel = (status: AssetStatus): string => {
  const statusLabels: Record<AssetStatus, string> = {
    ordered: 'Bestellt',
    delivered: 'Geliefert',
    in_use: 'In Verwendung',
    defective: 'Defekt',
    repair: 'In Reparatur',
    pool: 'Im Pool',
    disposed: 'Entsorgt',
    sold: 'Verkauft'
  };
  
  return statusLabels[status] || status;
};

// Enhanced function to generate notes about which fields were changed with before/after values
export const generateFieldChangeNotes = (
  previousAsset: any,
  newAsset: any
): string => {
  const changedFields: string[] = [];
  
  // Check each important field for changes and document before/after values
  if (previousAsset.manufacturer !== newAsset.manufacturer) {
    changedFields.push(`Hersteller: "${previousAsset.manufacturer}" → "${newAsset.manufacturer}"`);
  }
  
  if (previousAsset.model !== newAsset.model) {
    changedFields.push(`Modell: "${previousAsset.model}" → "${newAsset.model}"`);
  }
  
  if (previousAsset.serial_number !== newAsset.serial_number) {
    const oldVal = previousAsset.serial_number || '(leer)';
    const newVal = newAsset.serial_number || '(leer)';
    changedFields.push(`Seriennummer: "${oldVal}" → "${newVal}"`);
  }
  
  if (previousAsset.inventory_number !== newAsset.inventory_number) {
    const oldVal = previousAsset.inventory_number || '(leer)';
    const newVal = newAsset.inventory_number || '(leer)';
    changedFields.push(`Inventarnummer: "${oldVal}" → "${newVal}"`);
  }
  
  if (previousAsset.price !== newAsset.price) {
    changedFields.push(`Preis: ${previousAsset.price} € → ${newAsset.price} €`);
  }
  
  if (previousAsset.vendor !== newAsset.vendor) {
    const oldVal = previousAsset.vendor || '(leer)';
    const newVal = newAsset.vendor || '(leer)';
    changedFields.push(`Verkäufer: "${oldVal}" → "${newVal}"`);
  }
  
  if (previousAsset.has_warranty !== newAsset.has_warranty) {
    const oldVal = previousAsset.has_warranty ? 'Ja' : 'Nein';
    const newVal = newAsset.has_warranty ? 'Ja' : 'Nein';
    changedFields.push(`Garantie: ${oldVal} → ${newVal}`);
  }
  
  if (previousAsset.warranty_expiry_date !== newAsset.warranty_expiry_date) {
    const oldDate = previousAsset.warranty_expiry_date ? 
      format(new Date(previousAsset.warranty_expiry_date), 'dd.MM.yyyy') : '(leer)';
    const newDate = newAsset.warranty_expiry_date ? 
      format(new Date(newAsset.warranty_expiry_date), 'dd.MM.yyyy') : '(leer)';
    changedFields.push(`Garantie bis: ${oldDate} → ${newDate}`);
  }
  
  if (previousAsset.warranty_info !== newAsset.warranty_info) {
    const oldVal = previousAsset.warranty_info || '(leer)';
    const newVal = newAsset.warranty_info || '(leer)';
    changedFields.push(`Garantiedetails: "${oldVal}" → "${newVal}"`);
  }
  
  if (previousAsset.is_pool_device !== newAsset.is_pool_device) {
    const oldVal = previousAsset.is_pool_device ? 'Ja' : 'Nein';
    const newVal = newAsset.is_pool_device ? 'Ja' : 'Nein';
    changedFields.push(`Poolgerät: ${oldVal} → ${newVal}`);
  }
  
  if (previousAsset.name !== newAsset.name) {
    changedFields.push(`Name: "${previousAsset.name}" → "${newAsset.name}"`);
  }
  
  if (previousAsset.type !== newAsset.type) {
    changedFields.push(`Typ: "${previousAsset.type}" → "${newAsset.type}"`);
  }
  
  if (previousAsset.category !== newAsset.category) {
    changedFields.push(`Kategorie: "${previousAsset.category}" → "${newAsset.category}"`);
  }
  
  // If fields were changed, list them in the note
  if (changedFields.length > 0) {
    return changedFields.join('\n');
  }
  
  // Default message if no specific changes were detected
  return 'Allgemeine Aktualisierung';
};

// Function to get username from user ID
export const getUserNameFromId = async (userId: string | null | undefined): Promise<string> => {
  if (!userId) return "System";
  
  try {
    // Try to get the username from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return "Benutzer";
    }
    
    // Return the name if found, otherwise a generic name or email
    if (data) {
      return data.name || data.email || "Benutzer";
    } else {
      // Try to get the username directly from auth.users via the safe function
      const { data: userData, error: userError } = await supabase
        .rpc('get_safe_user_email', { user_id: userId });
      
      if (userError || !userData) {
        console.error("Error fetching user email:", userError);
        return "Benutzer";
      }
      
      return userData || "Benutzer";
    }
  } catch (error) {
    console.error("Error in getUserNameFromId:", error);
    return "Benutzer";
  }
};

// Add a new function to get employee name from ID
export const getEmployeeNameFromId = async (employeeId: string | null | undefined): Promise<string> => {
  if (!employeeId) return "";
  
  try {
    // Try to get the employee from employees table
    const { data, error } = await supabase
      .from('employees')
      .select('first_name, last_name')
      .eq('id', employeeId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching employee:", error);
      return employeeId;
    }
    
    // Return the name if found, otherwise return the ID
    return data ? `${data.first_name} ${data.last_name}` : employeeId;
  } catch (error) {
    console.error("Error in getEmployeeNameFromId:", error);
    return employeeId;
  }
};
