
import { Asset, AssetStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapAssetToDbAsset, mapDbAssetToAsset } from "./mappers";
import { 
  addAssetHistoryEntry, 
  generateStatusChangeNote, 
  getActionTypeForStatusChange,
  generateFieldChangeNotes
} from "./history";

// Function to update an asset in the database
export const updateAsset = async (asset: Asset, previousAsset?: Asset): Promise<Asset> => {
  console.log("Updating asset in Supabase:", asset.id);
  
  try {
    // Fetch the current asset to check for changes if previous version is not provided
    let currentAsset = previousAsset;
    
    if (!currentAsset) {
      console.log("No previous asset provided, fetching current state from database");
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
      console.log("Current asset state fetched:", currentAsset);
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
    
    console.log("Asset updated successfully in database:", data.id);
    
    try {
      if (!originalAsset) {
        console.warn("No original asset data available for history comparison");
        return mapDbAssetToAsset(data);
      }
      
      // First, check if status has changed and add history entry if needed
      if (originalAsset.status !== asset.status) {
        console.log(`Status changed: ${originalAsset.status} -> ${asset.status}`);
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
          notes
        );
        
        console.log(`Added status change history entry: ${originalAsset.status} -> ${asset.status}`);
      }
      
      // Check if employee assignment has changed
      if (originalAsset.employeeId !== asset.employeeId) {
        console.log(`Employee assignment changed: ${originalAsset.employeeId} -> ${asset.employeeId}`);
        if (asset.employeeId) {
          // Asset was assigned to someone
          await addAssetHistoryEntry(
            asset.id,
            "assign",
            asset.employeeId,
            `Asset einem Mitarbeiter zugewiesen`
          );
          console.log(`Added assignment history entry: Employee ${asset.employeeId}`);
        } else if (originalAsset.employeeId) {
          // Asset was returned to pool
          await addAssetHistoryEntry(
            asset.id,
            "return",
            null,
            `Asset in den Pool zurückgegeben`
          );
          console.log("Added return to pool history entry");
        }
      }
      
      // Record general field changes
      const changeNotes = generateFieldChangeNotes(dbAsset, mapAssetToDbAsset(originalAsset));
      
      if (changeNotes !== 'Allgemeine Aktualisierung') {
        console.log("Field changes detected, adding history entry with details");
        await addAssetHistoryEntry(
          asset.id,
          "edit",
          asset.employeeId, // Include the employee if this asset is assigned
          changeNotes
        );
        console.log("Added field changes history entry with notes:", changeNotes);
      }
    } catch (historyError) {
      console.error("Error updating asset history entries:", historyError);
      // Continue returning the asset even if history entries fail
    }
    
    return mapDbAssetToAsset(data);
  } catch (error) {
    console.error(`Error in updateAsset for ${asset.id}:`, error);
    throw error;
  }
};
