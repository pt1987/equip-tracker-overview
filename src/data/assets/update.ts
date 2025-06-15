
import { Asset } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbAssetToAsset, mapAssetToDbAssetUpdate } from "./mappers";
import { addAssetHistoryEntry } from "./history";
import { getUserId } from "@/hooks/use-auth";

export const updateAsset = async (asset: Asset, previousAsset?: Asset): Promise<Asset> => {
  console.log("=== updateAsset Debug ===");
  console.log("Updating asset:", asset.id);
  console.log("Asset data to update:", asset);
  
  try {
    // Prepare the update data
    const updateData = mapAssetToDbAssetUpdate(asset);
    
    console.log("Mapped update data:", updateData);
    
    // Perform the database update
    const { data, error } = await supabase
      .from('assets')
      .update(updateData)
      .eq('id', asset.id)
      .select('*')
      .single();
    
    if (error) {
      console.error("Database update error:", error);
      throw new Error(`Failed to update asset: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`No data returned after updating asset ${asset.id}`);
    }
    
    console.log("Asset updated successfully in database:", data);
    
    // Convert back to frontend Asset type
    const updatedAsset = mapDbAssetToAsset(data);
    
    // Add history entries for changes
    try {
      const userId = await getUserId();
      
      if (previousAsset) {
        // Check for status changes
        if (previousAsset.status !== asset.status) {
          await addAssetHistoryEntry(
            asset.id,
            "status_change",
            asset.employeeId,
            `Status geändert: ${previousAsset.status} -> ${asset.status}`,
            userId
          );
        }
        
        // Check for employee assignment changes
        if (previousAsset.employeeId !== asset.employeeId) {
          if (asset.employeeId) {
            await addAssetHistoryEntry(
              asset.id,
              "assign",
              asset.employeeId,
              "Asset einem Mitarbeiter zugewiesen",
              userId
            );
          } else {
            await addAssetHistoryEntry(
              asset.id,
              "return",
              null,
              "Asset in den Pool zurückgegeben",
              userId
            );
          }
        }
        
        // Check for pool device status changes
        if (previousAsset.isPoolDevice !== asset.isPoolDevice) {
          await addAssetHistoryEntry(
            asset.id,
            "edit",
            asset.employeeId,
            `Pool-Gerät Status: ${asset.isPoolDevice ? 'aktiviert' : 'deaktiviert'}`,
            userId
          );
        }
      }
      
      // Add general edit entry
      await addAssetHistoryEntry(
        asset.id,
        "edit",
        asset.employeeId,
        "Asset aktualisiert",
        userId
      );
    } catch (historyError) {
      console.error("Error adding history entries:", historyError);
      // Continue even if history fails
    }
    
    return updatedAsset;
  } catch (error) {
    console.error(`Error updating asset ${asset.id}:`, error);
    throw error;
  }
};
