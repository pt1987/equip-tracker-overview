
import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetHistoryAction, AssetStatus } from "@/lib/types";
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
    console.log(`Adding history entry: asset=${assetId}, action=${action}, notes=${notes}`);
    
    const { error } = await supabase
      .from('asset_history')
      .insert({
        asset_id: assetId,
        action,
        employee_id: employeeId,
        notes,
        date: new Date().toISOString() // Use current timestamp
      });
      
    if (error) {
      console.error("Error adding asset history entry:", error);
      throw error;
    }
    
    console.log(`Successfully added ${action} history entry for asset ${assetId}`);
  } catch (error) {
    console.error("Failed to add history entry:", error);
    throw error;
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

// Function to generate notes about which fields were changed with before/after values
export const generateFieldChangeNotes = (
  previousAsset: any,
  newAsset: any
): string => {
  const changedFields: string[] = [];
  
  // Compare important fields and document changes
  if (previousAsset.manufacturer !== newAsset.manufacturer) {
    changedFields.push(`Hersteller: "${previousAsset.manufacturer || '(leer)'}" → "${newAsset.manufacturer || '(leer)'}""`);
  }
  
  if (previousAsset.model !== newAsset.model) {
    changedFields.push(`Modell: "${previousAsset.model || '(leer)'}" → "${newAsset.model || '(leer)'}""`);
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
    changedFields.push(`Name: "${previousAsset.name || '(leer)'}" → "${newAsset.name || '(leer)'}""`);
  }
  
  if (previousAsset.type !== newAsset.type) {
    changedFields.push(`Typ: "${previousAsset.type || '(leer)'}" → "${newAsset.type || '(leer)'}""`);
  }
  
  if (previousAsset.category !== newAsset.category) {
    changedFields.push(`Kategorie: "${previousAsset.category || '(leer)'}" → "${newAsset.category || '(leer)'}""`);
  }
  
  if (previousAsset.employee_id !== newAsset.employee_id) {
    const oldVal = previousAsset.employee_id || '(nicht zugewiesen)';
    const newVal = newAsset.employee_id || '(nicht zugewiesen)';
    changedFields.push(`Mitarbeiter-ID: "${oldVal}" → "${newVal}"`);
  }
  
  // If fields were changed, list them in the note
  if (changedFields.length > 0) {
    return changedFields.join('\n');
  }
  
  // Default message if no specific changes were detected
  return 'Allgemeine Aktualisierung';
};

// Function to get username from user ID - Simplified to work directly with Supabase
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
      return "Unbekannter Benutzer";
    }
    
    // Return the name if found, otherwise the email or a default
    if (data) {
      return data.name || data.email || "Unbekannter Benutzer";
    } else {
      return "Unbekannter Benutzer";
    }
  } catch (error) {
    console.error("Error in getUserNameFromId:", error);
    return "Unbekannter Benutzer";
  }
};

// Function to get employee name from ID
export const getEmployeeNameFromId = async (employeeId: string | null | undefined): Promise<string> => {
  if (!employeeId) return "";
  
  try {
    // Get the employee from employees table
    const { data, error } = await supabase
      .from('employees')
      .select('first_name, last_name')
      .eq('id', employeeId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching employee:", error);
      return "Unbekannter Mitarbeiter";
    }
    
    // Return the name if found, otherwise a default
    return data ? `${data.first_name} ${data.last_name}` : "Unbekannter Mitarbeiter";
  } catch (error) {
    console.error("Error in getEmployeeNameFromId:", error);
    return "Unbekannter Mitarbeiter";
  }
};
