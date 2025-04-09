
import { Asset } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapAssetToDbAsset, mapDbAssetToAsset } from "./mappers";
import { addAssetHistoryEntry } from "./history";

// Function to update an asset in the database
export const updateAsset = async (asset: Asset): Promise<Asset> => {
  console.log("Updating asset in Supabase:", asset);
  
  try {
    // Fetch the current asset to check for status changes
    const { data: currentAsset, error: fetchError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', asset.id)
      .single();
    
    if (fetchError) {
      console.error("Error fetching current asset state:", fetchError);
      throw fetchError;
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
    
    // Check if status has changed and add history entry if it has
    if (currentAsset && currentAsset.status !== dbAsset.status) {
      await addAssetHistoryEntry(
        asset.id,
        "status_change",
        asset.employeeId,
        `Status changed from ${currentAsset.status} to ${dbAsset.status}`
      );
      console.log("Added status change to asset history");
    }
    
    // Check if employee assignment has changed
    if (currentAsset && currentAsset.employee_id !== dbAsset.employee_id) {
      if (dbAsset.employee_id) {
        // Asset was assigned to someone
        await addAssetHistoryEntry(
          asset.id,
          "assign",
          dbAsset.employee_id,
          `Asset assigned to employee`
        );
        console.log("Added assignment change to asset history");
      } else if (currentAsset.employee_id) {
        // Asset was returned to pool
        await addAssetHistoryEntry(
          asset.id,
          "return",
          currentAsset.employee_id,
          `Asset returned to pool`
        );
        console.log("Added return to pool to asset history");
      }
    }
    
    console.log("Asset updated successfully:", data);
    
    return mapDbAssetToAsset(data);
  } catch (error) {
    console.error(`Error in updateAsset for ${asset.id}:`, error);
    throw error;
  }
};
