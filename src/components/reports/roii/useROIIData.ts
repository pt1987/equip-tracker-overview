
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "react-day-picker";

export interface ROIIData {
  category: string;
  investment: number;
  return: number;
  roi: number;
}

export const getROIIData = async (dateRange?: DateRange): Promise<ROIIData[]> => {
  try {
    console.log("Fetching ROII data with date range:", dateRange);
    
    // Get the assets data with pricing information
    let query = supabase
      .from('assets')
      .select(`
        category,
        price,
        type,
        purchase_date
      `);
    
    // Apply date filter if provided
    if (dateRange?.from && dateRange?.to) {
      const fromDate = new Date(dateRange.from).toISOString().split('T')[0];
      const toDate = new Date(dateRange.to).toISOString().split('T')[0];
      
      query = query
        .gte('purchase_date', fromDate)
        .lte('purchase_date', toDate);
    }
    
    const { data: assets, error } = await query;
    
    if (error) {
      console.error("Error fetching ROII data:", error);
      throw error;
    }
    
    if (!assets || assets.length === 0) {
      return [];
    }

    // Group assets by category and calculate ROI
    const categoryMap: Record<string, {
      investment: number;
      count: number;
      totalValue: number;
    }> = {};
    
    // Process assets and group by category
    assets.forEach(asset => {
      const category = asset.category || 'Uncategorized';
      const price = Number(asset.price) || 0;
      
      if (!categoryMap[category]) {
        categoryMap[category] = {
          investment: 0,
          count: 0,
          totalValue: 0
        };
      }
      
      categoryMap[category].investment += price;
      categoryMap[category].count += 1;
      
      // Calculate estimated return based on asset type and age
      // This is an approximation - in a real system you'd have actual ROI data
      const purchaseDate = new Date(asset.purchase_date);
      const now = new Date();
      const ageInMonths = (now.getFullYear() - purchaseDate.getFullYear()) * 12 + 
                          (now.getMonth() - purchaseDate.getMonth());
      
      let estimatedReturn = price;
      
      // Different asset types have different ROI patterns
      if (asset.type?.toLowerCase().includes('laptop') || 
          asset.type?.toLowerCase().includes('computer')) {
        // Laptops depreciate but provide productivity value
        estimatedReturn = price * (1 + Math.min(ageInMonths * 0.05, 2)); // Up to 200% ROI over time
      } else if (asset.type?.toLowerCase().includes('server')) {
        // Servers tend to have higher ROI
        estimatedReturn = price * (1 + Math.min(ageInMonths * 0.08, 3)); // Up to 300% ROI
      } else if (asset.type?.toLowerCase().includes('software')) {
        // Software licenses may appreciate in value
        estimatedReturn = price * (1 + Math.min(ageInMonths * 0.04, 1.5)); // Up to 150% ROI
      } else {
        // Default for other types
        estimatedReturn = price * (1 + Math.min(ageInMonths * 0.03, 1.2)); // Up to 120% ROI
      }
      
      categoryMap[category].totalValue += estimatedReturn;
    });
    
    // Convert to array format
    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      investment: parseFloat(data.investment.toFixed(2)),
      return: parseFloat(data.totalValue.toFixed(2)),
      roi: parseFloat(((data.totalValue / data.investment - 1) * 100).toFixed(2))
    })).sort((a, b) => b.investment - a.investment); // Sort by investment amount (descending)
    
  } catch (error) {
    console.error("Error in getROIIData:", error);
    return [];
  }
};

export const useROIIData = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['roiiData', dateRange],
    queryFn: () => getROIIData(dateRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,  // 10 minutes
  });
};
