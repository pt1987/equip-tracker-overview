
import { supabase } from "@/integrations/supabase/client";
import { AssetHistoryAction, AssetStatus } from "@/lib/types";

// Function to add an entry to the asset history
export const addAssetHistoryEntry = async (
  assetId: string,
  action: AssetHistoryAction,
  employeeId: string | null,
  notes: string,
  userId?: string | null
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('asset_history')
      .insert({
        asset_id: assetId,
        action,
        employee_id: employeeId,
        notes,
        user_id: userId || null
      });
      
    if (error) {
      console.error("Error adding asset history entry:", error);
      throw error;
    }
    
    console.log(`Added ${action} history entry for asset ${assetId}`);
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
  return `Status geändert von ${getStatusLabel(previousStatus)} zu ${getStatusLabel(newStatus)}`;
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

// Function to generate notes about which fields were changed
export const generateFieldChangeNotes = (
  previousAsset: any,
  newAsset: any
): string => {
  const changedFields: string[] = [];
  
  // Check each important field for changes
  if (previousAsset.manufacturer !== newAsset.manufacturer || previousAsset.model !== newAsset.model) {
    changedFields.push('Geräteinformationen');
  }
  
  if (previousAsset.serial_number !== newAsset.serial_number || 
      previousAsset.inventory_number !== newAsset.inventory_number) {
    changedFields.push('Identifikation');
  }
  
  if (previousAsset.price !== newAsset.price || previousAsset.vendor !== newAsset.vendor) {
    changedFields.push('Kaufdetails');
  }
  
  if (previousAsset.has_warranty !== newAsset.has_warranty || 
      previousAsset.warranty_expiry_date !== newAsset.warranty_expiry_date ||
      previousAsset.warranty_info !== newAsset.warranty_info) {
    changedFields.push('Garantieinformationen');
  }
  
  if (previousAsset.is_pool_device !== newAsset.is_pool_device) {
    changedFields.push('Poolgerät-Status');
  }
  
  // If fields were changed, list them in the note
  if (changedFields.length > 0) {
    return `Änderungen an: ${changedFields.join(', ')}`;
  }
  
  // Default message if no specific changes were detected
  return 'Allgemeine Aktualisierung';
};

// Export the getUserNameFromId function properly, fixing the error
export const getUserNameFromId = (userId: string | null | undefined): string => {
  if (!userId) return "System";
  
  // In a real app, this would look up the username from the database
  // For now, we'll just return a placeholder
  return "Benutzer";
};
