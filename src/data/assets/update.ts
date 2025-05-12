
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
  console.log("Updating asset in Supabase:", asset);
  
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
      
      // Check if status has changed and add history entry if it has
      if (currentAsset && currentAsset.status !== dbAsset.status) {
        const actionType = getActionTypeForStatusChange(
          currentAsset.status as AssetStatus, 
          dbAsset.status as AssetStatus
        );
        
        const notes = generateStatusChangeNote(
          currentAsset.status as AssetStatus, 
          dbAsset.status as AssetStatus
        );
        
        await addAssetHistoryEntry(
          asset.id,
          actionType,
          null, // Status changes don't need employee association
          notes,
          userId
        );
        
        console.log(`Added ${actionType} to asset history`);
      }
      
      // Check if employee assignment has changed
      if (currentAsset && currentAsset.employeeId !== asset.employeeId) {
        if (asset.employeeId) {
          // Verify employee exists before adding history entry
          const { data: employeeExists } = await supabase
            .from('employees')
            .select('id')
            .eq('id', asset.employeeId)
            .single();

          if (employeeExists) {
            // Asset was assigned to someone
            await addAssetHistoryEntry(
              asset.id,
              "assign",
              asset.employeeId,
              `Asset einem Mitarbeiter zugewiesen`,
              userId
            );
            console.log("Added assignment change to asset history");
          } else {
            console.log(`Employee with ID ${asset.employeeId} not found. Skipping history entry.`);
          }
        } else if (currentAsset.employeeId) {
          // Asset was returned to pool
          await addAssetHistoryEntry(
            asset.id,
            "return",
            null, // Return to pool doesn't need employee association
            `Asset in den Pool zurückgegeben`,
            userId
          );
          console.log("Added return to pool to asset history");
        }
      }
      
      // Record general field changes if any (excluding status and employee which are handled separately)
      if (currentAsset && JSON.stringify(currentAsset) !== JSON.stringify(mapDbAssetToAsset(data))) {
        const changeNotes = generateFieldChangeNotes(currentAsset, dbAsset);
        
        if (changeNotes !== 'Allgemeine Aktualisierung' || 
            (currentAsset.status === dbAsset.status && currentAsset.employeeId === asset.employeeId)) {
          await addAssetHistoryEntry(
            asset.id,
            "edit",
            null,
            changeNotes,
            userId
          );
          console.log("Added general edit to asset history");
        }
      }
    } catch (historyError) {
      console.error("Error updating asset history entries:", historyError);
      // Continue with asset update even if history entries fail
    }
    
    console.log("Asset updated successfully:", data);
    
    return mapDbAssetToAsset(data);
  } catch (error) {
    console.error(`Error in updateAsset for ${asset.id}:`, error);
    throw error;
  }
};
