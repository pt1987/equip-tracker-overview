
import { Asset, AssetStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapAssetToDbAsset, mapDbAssetToAsset } from "./mappers";
import { 
  addAssetHistoryEntry, 
  generateStatusChangeNote, 
  getActionTypeForStatusChange,
  generateFieldChangeNotes
} from "./history";
import { getUserId } from "@/hooks/use-auth";

// Function to update an asset in the database
export const updateAsset = async (asset: Asset, previousAsset?: Asset): Promise<Asset> => {
  console.log("Updating asset in Supabase:", asset.id);
  
  try {
    // Fetch the current asset to check for changes if previous version is not provided
    let currentAsset = previousAsset;
    
    if (!currentAsset) {
      const { data: fetchedAsset, error: fetchError } = await supabase
        .from('assets')
        .select('*')
        .eq('id', asset.id)
        .single();
      
      if (fetchError) {
        console.error("Error fetching current asset state:", fetchError);
        throw fetchError;
      }
      
      currentAsset = mapDbAssetToAsset(fetchedAsset);
    }
    
    const dbAsset = mapAssetToDbAsset(asset);
    
    // Add updated_at timestamp
    const dbAssetWithTimestamp = {
      ...dbAsset,
      updated_at: new Date().toISOString()
    };
    
    // Store a copy of the current asset before updating for comparison
    const originalAsset = currentAsset ? {...currentAsset} : null;
    
    const { data, error } = await supabase
      .from('assets')
      .update(dbAssetWithTimestamp)
      .eq('id', asset.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating asset:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`No asset returned after update for ID: ${asset.id}`);
    }
    
    try {
      // Get current user ID for tracking who made the change
      const userId = await getUserId();
      console.log("Current user making the change:", userId);
      
      // First, check for important individual changes that need their own entries
      
      // Check if status has changed and add history entry if it has
      if (originalAsset && originalAsset.status !== asset.status) {
        const actionType = getActionTypeForStatusChange(
          originalAsset.status as AssetStatus, 
          asset.status as AssetStatus
        );
        
        const notes = generateStatusChangeNote(
          originalAsset.status as AssetStatus, 
          asset.status as AssetStatus
        );
        
        await addAssetHistoryEntry(
          asset.id,
          actionType,
          null, // Status changes don't need employee association
          notes,
          userId
        );
        
        console.log(`Added status change history entry: ${originalAsset.status} -> ${asset.status}`);
      }
      
      // Check if employee assignment has changed
      if (originalAsset && originalAsset.employeeId !== asset.employeeId) {
        if (asset.employeeId) {
          // Asset was assigned to someone
          await addAssetHistoryEntry(
            asset.id,
            "assign",
            asset.employeeId,
            `Asset einem Mitarbeiter zugewiesen`,
            userId
          );
          console.log(`Added assignment history entry: Employee ${asset.employeeId}`);
        } else if (originalAsset.employeeId) {
          // Asset was returned to pool
          await addAssetHistoryEntry(
            asset.id,
            "return",
            null,
            `Asset in den Pool zurückgegeben`,
            userId
          );
          console.log("Added return to pool history entry");
        }
      }
      
      // Record general field changes
      if (originalAsset && JSON.stringify(originalAsset) !== JSON.stringify(asset)) {
        // Check if there are field changes besides status and employee
        const changeNotes = generateFieldChangeNotes(originalAsset, dbAsset);
        
        if (changeNotes !== 'Allgemeine Aktualisierung') {
          await addAssetHistoryEntry(
            asset.id,
            "edit",
            asset.employeeId, // Include the employee if this asset is assigned
            changeNotes,
            userId
          );
          console.log("Added field changes history entry with notes:", changeNotes);
        }
      }
    } catch (historyError) {
      console.error("Error updating asset history entries:", historyError);
      // Continue with asset update even if history entries fail
    }
    
    console.log("Asset updated successfully:", data.id);
    
    return mapDbAssetToAsset(data);
  } catch (error) {
    console.error(`Error in updateAsset for ${asset.id}:`, error);
    throw error;
  }
};
