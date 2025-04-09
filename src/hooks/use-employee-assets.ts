
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type AssetSummary = {
  laptop: number;
  smartphone: number;
  tablet: number;
  mouse: number;
  keyboard: number;
  accessory: number;
  totalCount: number;
  totalValue: number;
};

export const useEmployeeAssets = (employeeId: string | undefined) => {
  return useQuery({
    queryKey: ['employee-assets', employeeId],
    queryFn: async () => {
      if (!employeeId) return null;
      
      // Get all assets assigned to this employee
      const { data, error } = await supabase
        .from('assets')
        .select('type, price')
        .eq('employee_id', employeeId);
      
      if (error) {
        console.error("Error fetching employee assets:", error);
        toast({
          title: "Error fetching assets",
          description: "Could not retrieve employee assets data",
          variant: "destructive"
        });
        return null;
      }

      if (!data?.length) {
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

      // Initialize summary
      const summary: AssetSummary = {
        laptop: 0,
        smartphone: 0,
        tablet: 0,
        mouse: 0,
        keyboard: 0,
        accessory: 0,
        totalCount: data.length,
        totalValue: data.reduce((sum, asset) => sum + (asset.price || 0), 0)
      };
      
      // Count assets by type
      data.forEach(asset => {
        if (asset.type && summary[asset.type as keyof Omit<AssetSummary, 'totalCount' | 'totalValue'>] !== undefined) {
          summary[asset.type as keyof Omit<AssetSummary, 'totalCount' | 'totalValue'>]++;
        }
      });
      
      return summary;
    },
    enabled: !!employeeId
  });
};
