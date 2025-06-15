
import { Asset } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { mapAssetToDbAssetInsert, mapDbAssetToAsset } from "./mappers";
import { addAssetHistoryEntry } from "./history";
import { getUserId } from "@/hooks/use-auth";

// Function to create a new asset in the database
export const createAsset = async (asset: Asset): Promise<Asset> => {
  console.log("Creating new asset in Supabase:", asset);
  
  try {
    const now = new Date().toISOString();
    
    // Validate required fields before mapping
    if (!asset.category) {
      throw new Error("Category is required for asset creation");
    }
    
    const dbAsset = mapAssetToDbAssetInsert(asset);
    
    // Für externe Assets müssen wir einen Standardwert für das Kaufdatum setzen,
    // da die Datenbank ein Nicht-Null-Feld erfordert
    if (asset.isExternal && !dbAsset.purchase_date) {
      dbAsset.purchase_date = now.split('T')[0]; // Verwende das heutige Datum als Fallback
    }
    
    // Add timestamps
    const dbAssetWithTimestamps = {
      ...dbAsset,
      created_at: now,
      updated_at: now
    };
    
    console.log("Final asset data for database insert:", dbAssetWithTimestamps);
    
    const { data, error } = await supabase
      .from('assets')
      .insert(dbAssetWithTimestamps)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating asset:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`No asset returned after creation with ID: ${asset.id}`);
    }
    
    try {
      // Get current user ID for history entries
      const userId = await getUserId();
      
      // Add purchase history entry 
      await addAssetHistoryEntry(
        data.id,
        "purchase",
        null, // Don't associate purchase with an employee
        `${data.name} für ${data.price} € bei ${data.vendor} gekauft`,
        userId
      );
      
      console.log("Added purchase entry to asset history");
      
      // If asset is initially assigned to an employee, add assign history entry
      if (data.employee_id) {
        // Verify employee exists before adding history entry
        const { data: employeeExists } = await supabase
          .from('employees')
          .select('id')
          .eq('id', data.employee_id)
          .single();

        if (employeeExists) {
          await addAssetHistoryEntry(
            data.id,
            "assign", 
            data.employee_id,
            `Asset bei Erstellung einem Mitarbeiter zugewiesen`,
            userId
          );
          console.log("Added initial employee assignment to asset history");
        } else {
          console.log(`Employee with ID ${data.employee_id} not found. Skipping history entry.`);
        }
      }
      
      // If status is not "ordered", add status change history entry
      if (data.status !== "ordered") {
        const actionType = data.status === "delivered" ? "delivery" : "status_change";
        const statusText = data.status === "delivered" ? "Geliefert" : data.status;
        
        await addAssetHistoryEntry(
          data.id,
          actionType,
          null, // Status changes don't need employee association
          `Initialer Status: ${statusText}`,
          userId
        );
        console.log("Added initial status to asset history");
      }
    } catch (historyError) {
      console.error("Error creating asset history entries:", historyError);
      // Continue with asset creation even if history entries fail
      // We don't want to roll back the asset creation if history fails
    }
    
    console.log("Asset created successfully:", data);
    
    return mapDbAssetToAsset(data);
  } catch (error) {
    console.error(`Error in createAsset:`, error);
    throw error;
  }
};
