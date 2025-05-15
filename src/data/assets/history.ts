
import { supabase } from "@/integrations/supabase/client";
import { Asset, AssetStatus, AssetHistoryAction, AssetHistoryEntry } from "@/lib/types";

// Add a new function to get all history entries
export const getAssetHistoryEntries = async (): Promise<AssetHistoryEntry[]> => {
  try {
    const { data, error } = await supabase
      .from("asset_history")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      console.error("Error getting asset history entries:", error);
      throw error;
    }
    
    // Map database results to our types
    return data.map(entry => ({
      id: entry.id,
      assetId: entry.asset_id,
      date: entry.date,
      action: entry.action as AssetHistoryAction,
      employeeId: entry.employee_id,
      userId: null, // Set to null since user_id doesn't exist in the response
      notes: entry.notes || ""
    }));
    
  } catch (error) {
    console.error("Failed to get asset history entries:", error);
    throw error;
  }
};

// Function to add a history entry for an asset
export const addAssetHistoryEntry = async (
  assetId: string,
  action: AssetHistoryAction,
  employeeId: string | null,
  notes: string,
  userId: string | null = null // Make userId optional with a default of null
): Promise<AssetHistoryEntry> => {
  try {
    // Create the insert object and conditionally add user_id if it's provided
    const insertData: any = {
      asset_id: assetId,
      date: new Date().toISOString(),
      action: action,
      employee_id: employeeId,
      notes: notes,
    };
    
    // Only add user_id to the insert if it's provided
    if (userId !== null) {
      insertData.user_id = userId;
    }
    
    const { data, error } = await supabase
      .from("asset_history")
      .insert([insertData])
      .select()
      .single();
    
    if (error) {
      console.error("Error adding asset history entry:", error);
      throw error;
    }
    
    return {
      id: data.id,
      assetId: data.asset_id,
      date: data.date,
      action: data.action as AssetHistoryAction,
      employeeId: data.employee_id,
      userId: null, // Set to null since user_id doesn't exist in the response
      notes: data.notes || ""
    };
  } catch (error) {
    console.error("Failed to add asset history entry:", error);
    throw error;
  }
};

// Function to determine the appropriate action type based on status change
export const getActionTypeForStatusChange = (
  fromStatus: AssetStatus, 
  toStatus: AssetStatus
): AssetHistoryAction => {
  if (fromStatus === "ordered" && toStatus === "delivered") {
    return "delivery";
  } else {
    return "status_change";
  }
};

// Generates a descriptive note about the status change
export const generateStatusChangeNote = (
  fromStatus: AssetStatus, 
  toStatus: AssetStatus
): string => {
  return `Status geändert: ${fromStatus} -> ${toStatus}`;
};

// Generate notes for field changes
export const generateFieldChangeNotes = (
  newData: Record<string, any>, 
  oldData: Record<string, any>
): string => {
  let notes = 'Allgemeine Aktualisierung';
  const changedFields = [];

  for (const key in newData) {
    if (key === 'updated_at') continue;

    if (newData[key] !== null && oldData[key] !== null) {
      if (newData[key] !== oldData[key]) {
        changedFields.push(key);
      }
    } else if (newData[key] !== oldData[key]) {
      changedFields.push(key);
    }
  }

  if (changedFields.length > 0) {
    notes = `Felder geändert: ${changedFields.join(', ')}`;
  }

  return notes;
};
