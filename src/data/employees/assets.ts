
import { supabase } from "@/integrations/supabase/client";
import { AssetSummary } from "@/components/employees/card/AssetSummaryDisplay";

/**
 * Get a summary of assets assigned to an employee
 * @param employeeId The employee ID to get assets for
 * @returns A summary of the assets by type and their total value
 */
export const getEmployeeAssetsSummary = async (employeeId: string): Promise<AssetSummary | null> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('type, price')
      .eq('employee_id', employeeId);
      
    if (error) {
      console.error("Error fetching employee assets:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      // Return empty summary if no assets found
      return {
        laptop: 0,
        smartphone: 0,
        tablet: 0,
        mouse: 0,
        keyboard: 0,
        accessory: 0,
        totalCount: 0,
        totalValue: 0
      };
    }
    
    // Initialize summary object
    const summary: AssetSummary = {
      laptop: 0,
      smartphone: 0,
      tablet: 0,
      mouse: 0,
      keyboard: 0,
      accessory: 0,
      totalCount: 0,
      totalValue: 0
    };
    
    // Count assets by type and sum up their value
    data.forEach(asset => {
      const assetType = asset.type as keyof Omit<AssetSummary, 'totalCount' | 'totalValue'>;
      
      if (assetType in summary) {
        summary[assetType]++;
        summary.totalCount++;
        summary.totalValue += asset.price || 0;
      }
    });
    
    return summary;
  } catch (error) {
    console.error("Error in getEmployeeAssetsSummary:", error);
    return null;
  }
};
