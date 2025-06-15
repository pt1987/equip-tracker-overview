
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
  console.log("=== updateAsset Debug ===");
  console.log("Updating asset:", asset.id);
  console.log("Asset data to update:", asset);
  
  try {
    // Fetch the current asset from database if previous version is not provided
    let currentAsset = previousAsset;
    
    if (!currentAsset) {
      console.log("Fetching current asset state from database");
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
      console.log("Current asset state:", currentAsset);
    }
    
    // Map the asset to database format
    const dbAsset = mapAssetToDbAsset(asset);
    console.log("Mapped asset for database:", dbAsset);
    
    // Prepare the update data with explicit field mapping
    const updateData = {
      name: asset.name,
      type: asset.type,
      manufacturer: asset.manufacturer,
      model: asset.model,
      vendor: asset.vendor,
      status: asset.status,
      purchase_date: asset.purchaseDate,
      price: asset.price,
      employee_id: asset.employeeId || null,
      category: asset.category,
      serial_number: asset.serialNumber || null,
      inventory_number: asset.inventoryNumber || null,
      has_warranty: asset.hasWarranty || false,
      additional_warranty: asset.additionalWarranty || false,
      warranty_expiry_date: asset.warrantyExpiryDate || null,
      warranty_info: asset.warrantyInfo || null,
      image_url: asset.imageUrl || null,
      is_pool_device: asset.isPoolDevice || false,
      is_external: asset.isExternal || false,
      owner_company: asset.ownerCompany || 'PHAT Consulting GmbH',
      project_id: asset.projectId || null,
      responsible_employee_id: asset.responsibleEmployeeId || null,
      handover_to_employee_date: asset.handoverToEmployeeDate || null,
      planned_return_date: asset.plannedReturnDate || null,
      actual_return_date: asset.actualReturnDate || null,
      classification: asset.classification || 'internal',
      asset_owner_id: asset.assetOwnerId || null,
      last_review_date: asset.lastReviewDate || null,
      next_review_date: asset.nextReviewDate || null,
      risk_level: asset.riskLevel || 'low',
      is_personal_data: asset.isPersonalData || false,
      disposal_method: asset.disposalMethod || null,
      lifecycle_stage: asset.lifecycleStage || 'operation',
      notes: asset.notes || null,
      imei: asset.imei || null,
      phone_number: asset.phoneNumber || null,
      provider: asset.provider || null,
      contract_end_date: asset.contractEndDate || null,
      contract_name: asset.contractName || null,
      contract_duration: asset.contractDuration || null,
      connected_asset_id: asset.connectedAssetId || null,
      related_asset_id: asset.relatedAssetId || null,
      updated_at: new Date().toISOString()
    };
    
    console.log("Final update data:", updateData);
    
    // Store a copy of the current asset before updating for comparison
    const originalAsset = currentAsset ? {...currentAsset} : null;
    
    // Perform the database update
    const { data, error } = await supabase
      .from('assets')
      .update(updateData)
      .eq('id', asset.id)
      .select()
      .single();
    
    if (error) {
      console.error("Database update error:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`No asset returned after update for ID: ${asset.id}`);
    }
    
    console.log("Asset updated successfully in database:", data);
    
    // Convert the updated data back to our Asset type
    const updatedAsset = mapDbAssetToAsset(data);
    console.log("Mapped updated asset:", updatedAsset);
    
    // Add history entries for significant changes
    try {
      if (!originalAsset) {
        console.warn("No original asset data available for history comparison");
        return updatedAsset;
      }
      
      // Check if status has changed and add history entry if needed
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
          null,
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
      
      // Check if pool device status changed
      if (originalAsset.isPoolDevice !== asset.isPoolDevice) {
        console.log(`Pool device status changed: ${originalAsset.isPoolDevice} -> ${asset.isPoolDevice}`);
        await addAssetHistoryEntry(
          asset.id,
          "edit",
          asset.employeeId,
          `Pool-Gerät Status geändert: ${asset.isPoolDevice ? 'aktiviert' : 'deaktiviert'}`
        );
      }
      
      // Record general field changes
      const changeNotes = generateFieldChangeNotes(updateData, mapAssetToDbAsset(originalAsset));
      
      if (changeNotes !== 'Allgemeine Aktualisierung') {
        console.log("Field changes detected, adding history entry");
        await addAssetHistoryEntry(
          asset.id,
          "edit",
          asset.employeeId,
          changeNotes
        );
        console.log("Added field changes history entry");
      }
    } catch (historyError) {
      console.error("Error updating asset history entries:", historyError);
      // Continue returning the asset even if history entries fail
    }
    
    console.log("Asset update completed successfully");
    return updatedAsset;
  } catch (error) {
    console.error(`Critical error in updateAsset for ${asset.id}:`, error);
    throw error;
  }
};
