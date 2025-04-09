
import { AssetHistoryEntry } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

// Function to add an entry to the asset history
export const addAssetHistoryEntry = async (
  assetId: string,
  action: "purchase" | "assign" | "status_change" | "return",
  employeeId: string | null = null,
  notes: string = ""
): Promise<AssetHistoryEntry | null> => {
  console.log(`Adding history entry for asset ${assetId}, action: ${action}`);
  
  try {
    const newEntry = {
      asset_id: assetId,
      action,
      employee_id: employeeId,
      notes,
      date: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('asset_history')
      .insert(newEntry)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding asset history entry:", error);
      throw error;
    }
    
    if (!data) {
      console.warn("No data returned after inserting asset history entry");
      return null;
    }
    
    console.log("Asset history entry added successfully:", data);
    
    return {
      id: data.id,
      assetId: data.asset_id,
      date: data.date,
      action: data.action as "purchase" | "assign" | "status_change" | "return",
      employeeId: data.employee_id,
      notes: data.notes || ""
    };
  } catch (error) {
    console.error(`Error in addAssetHistoryEntry for ${assetId}:`, error);
    throw error;
  }
};
