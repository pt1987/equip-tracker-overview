
import { AssetHistoryEntry, AssetStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

// Definiert alle möglichen Aktionen für die Asset-Historie
export type AssetHistoryAction = 
  | "purchase"     // Initiale Anschaffung eines Assets
  | "delivery"     // Lieferung/Erhalt eines Assets
  | "assign"       // Zuweisung zu einem Mitarbeiter
  | "status_change" // Statusänderung (z.B. defekt)
  | "repair"        // Reparatur eines Assets
  | "return"        // Rückgabe in den Pool
  | "dispose";      // Entsorgung/Verschrottung

// Fügt einen neuen Eintrag zur Asset-Historie hinzu
export const addAssetHistoryEntry = async (
  assetId: string,
  action: AssetHistoryAction,
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
      action: data.action as AssetHistoryAction,
      employeeId: data.employee_id,
      notes: data.notes || ""
    };
  } catch (error) {
    console.error(`Error in addAssetHistoryEntry for ${assetId}:`, error);
    throw error;
  }
};

// Hilfsfunktion zur Generierung automatischer Notizen für Statusänderungen
export const generateStatusChangeNote = (oldStatus: AssetStatus, newStatus: AssetStatus): string => {
  return `Status geändert von ${translateStatus(oldStatus)} zu ${translateStatus(newStatus)}`;
};

// Übersetzt den technischen Status in einen benutzerfreundlichen deutschen Text
export const translateStatus = (status: AssetStatus): string => {
  const statusMap: Record<AssetStatus, string> = {
    'ordered': 'Bestellt',
    'delivered': 'Geliefert',
    'in_use': 'In Benutzung',
    'defective': 'Defekt',
    'repair': 'In Reparatur',
    'pool': 'Im Pool'
  };
  
  return statusMap[status] || status;
};

// Überprüft, ob eine Statusänderung einen bestimmten Aktionstyp in der Historie auslösen sollte
export const getActionTypeForStatusChange = (oldStatus: AssetStatus, newStatus: AssetStatus): AssetHistoryAction => {
  if (newStatus === 'repair') return 'repair';
  if (newStatus === 'pool' && oldStatus !== 'ordered' && oldStatus !== 'delivered') return 'return';
  if (newStatus === 'defective') return 'status_change';
  if (oldStatus === 'ordered' && newStatus === 'delivered') return 'delivery';
  
  return 'status_change';
};
