import { 
  OrderTimeline, 
  YearlyBudgetReport, 
  YearlyAssetPurchaseReport, 
  AssetUsageDurationReport, 
  WarrantyDefectReport,
  FixedAssetsReport,
  AssetType,
  Asset,
  Employee
} from "@/lib/types";
import { getAssets, getAssetHistoryByAssetId } from "./assets";
import { getEmployees } from "./employees";
import { calculateAgeInMonths, groupBy } from "@/lib/utils";
import { isFixedAsset, isGWG, calculateAssetBookValue } from "@/lib/depreciation-utils";

// Helper function to get employee name
const getEmployeeName = async (id: string): Promise<string> => {
  const employees = await getEmployees();
  const employee = employees.find(emp => emp.id === id);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
};

// Order Timeline per employee
export const getOrderTimelineByEmployee = async (employeeId?: string): Promise<OrderTimeline[]> => {
  try {
    const employees = await getEmployees();
    const assets = await getAssets();
    const allAssetHistory: any[] = [];
    
    if (!Array.isArray(assets)) {
      console.error("getOrderTimelineByEmployee: assets is not an array");
      return [];
    }

    if (!Array.isArray(employees)) {
      console.error("getOrderTimelineByEmployee: employees is not an array");
      return [];
    }
    
    // Get all asset history entries
    for (const asset of assets) {
      const history = await getAssetHistoryByAssetId(asset.id);
      if (Array.isArray(history)) {
        allAssetHistory.push(...history);
      }
    }
    
    const filteredEmployees = employeeId 
      ? employees.filter(emp => emp.id === employeeId)
      : employees;

    const result: OrderTimeline[] = [];
    
    for (const employee of filteredEmployees) {
      // Get all assets that were assigned to this employee
      const employeeAssets = assets.filter(asset => asset.employeeId === employee.id);
      
      // Get purchase dates from history or fallback to asset.purchaseDate
      const orders = employeeAssets.map(asset => {
        const purchaseEntry = allAssetHistory.find(
          history => history.assetId === asset.id && history.action === 'purchase'
        );

        return {
          date: purchaseEntry?.date || asset.purchaseDate,
          assetName: asset.name,
          assetType: asset.type as AssetType,
          price: asset.price
        };
      });

      // Sort by date
      orders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      result.push({
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        orders
      });
    }

    return result;
  } catch (error) {
    console.error("Error in getOrderTimelineByEmployee:", error);
    return [];
  }
};

// Yearly budget report
export const getYearlyBudgetReport = async (): Promise<YearlyBudgetReport[]> => {
  try {
    const assets = await getAssets();
    
    if (!Array.isArray(assets)) {
      console.error("getYearlyBudgetReport: assets is not an array");
      return [];
    }
    
    // Group assets by purchase year
    const assetsByYear = groupBy(assets, (asset: Asset) => {
      const date = new Date(asset.purchaseDate);
      return date.getFullYear().toString();
    });

    // Calculate total spending per year
    return Object.entries(assetsByYear).map(([yearStr, yearAssets]) => {
      const year = parseInt(yearStr);
      const totalSpent = yearAssets.reduce((sum, asset) => sum + asset.price, 0);
      
      return { year, totalSpent };
    }).sort((a, b) => a.year - b.year);
  } catch (error) {
    console.error("Error in getYearlyBudgetReport:", error);
    return [];
  }
};

// Yearly asset purchases report
export const getYearlyAssetPurchasesReport = async (): Promise<YearlyAssetPurchaseReport[]> => {
  try {
    const assets = await getAssets();
    
    if (!Array.isArray(assets)) {
      console.error("getYearlyAssetPurchasesReport: assets is not an array");
      return [];
    }
    
    // Group assets by purchase year
    const assetsByYear = groupBy(assets, (asset: Asset) => {
      const date = new Date(asset.purchaseDate);
      return date.getFullYear().toString();
    });

    // Calculate assets by type per year
    return Object.entries(assetsByYear).map(([yearStr, yearAssets]) => {
      const year = parseInt(yearStr);
      const assetsByType = {} as Record<AssetType, number>;
      
      yearAssets.forEach(asset => {
        const assetType = asset.type as AssetType;
        if (!assetsByType[assetType]) {
          assetsByType[assetType] = 0;
        }
        assetsByType[assetType]++;
      });
      
      const total = yearAssets.length;
      
      return { year, assetsByType, total };
    }).sort((a, b) => a.year - b.year);
  } catch (error) {
    console.error("Error in getYearlyAssetPurchasesReport:", error);
    return [];
  }
};

// Average usage duration by asset category
export const getAssetUsageDurationReport = async (): Promise<AssetUsageDurationReport[]> => {
  try {
    const assets = await getAssets();
    
    if (!Array.isArray(assets)) {
      console.error("getAssetUsageDurationReport: assets is not an array");
      return [];
    }
    
    // Group assets by category
    const assetsByCategory = groupBy(assets, (asset: Asset) => asset.category);

    // Calculate average age in months for each category
    return Object.entries(assetsByCategory).map(([category, categoryAssets]) => {
      const totalMonths = categoryAssets.reduce((sum, asset) => {
        return sum + calculateAgeInMonths(asset.purchaseDate);
      }, 0);
      
      const count = categoryAssets.length;
      const averageMonths = count > 0 ? Math.round(totalMonths / count) : 0;
      
      return { category, averageMonths, count };
    }).sort((a, b) => b.averageMonths - a.averageMonths);
  } catch (error) {
    console.error("Error in getAssetUsageDurationReport:", error);
    return [];
  }
};

// Warranty defect report
export const getWarrantyDefectReport = async (): Promise<WarrantyDefectReport> => {
  try {
    const assets = await getAssets();
    
    if (!Array.isArray(assets)) {
      console.error("getWarrantyDefectReport: assets is not an array");
      return {
        withWarranty: { count: 0, percentage: 0 },
        withoutWarranty: { count: 0, percentage: 0 }
      };
    }
    
    // Filter defective or in repair assets
    const defectiveAssets = assets.filter(
      asset => asset.status === 'defective' || asset.status === 'repair'
    );
    
    // Count those with and without warranty
    const withWarrantyCount = defectiveAssets.filter(
      asset => asset.hasWarranty || asset.additionalWarranty
    ).length;
    
    const withoutWarrantyCount = defectiveAssets.length - withWarrantyCount;
    const totalCount = defectiveAssets.length;
    
    return {
      withWarranty: {
        count: withWarrantyCount,
        percentage: totalCount > 0 ? (withWarrantyCount / totalCount) * 100 : 0
      },
      withoutWarranty: {
        count: withoutWarrantyCount,
        percentage: totalCount > 0 ? (withoutWarrantyCount / totalCount) * 100 : 0
      }
    };
  } catch (error) {
    console.error("Error in getWarrantyDefectReport:", error);
    return {
      withWarranty: { count: 0, percentage: 0 },
      withoutWarranty: { count: 0, percentage: 0 }
    };
  }
};

// Fixed assets and GWG report
export const getFixedAssetsReport = async (): Promise<FixedAssetsReport> => {
  try {
    const assets = await getAssets();
    
    if (!Array.isArray(assets)) {
      console.error("getFixedAssetsReport: assets is not an array");
      return {
        fixedAssets: [],
        gwgAssets: [],
        fixedAssetValue: 0,
        gwgValue: 0,
        currentBookValue: 0,
        depreciationAmount: 0,
        assetCount: {
          fixed: 0,
          gwg: 0,
          other: 0,
          total: 0
        },
        categoryDistribution: []
      };
    }
    
    // Filter assets
    const fixedAssets = assets.filter(asset => isFixedAsset(asset));
    const gwgAssets = assets.filter(asset => isGWG(asset));
    
    // Calculate values
    const fixedAssetValue = fixedAssets.reduce(
      (sum, asset) => sum + (asset.netPurchasePrice || asset.price / 1.19), 
      0
    );
    
    const gwgValue = gwgAssets.reduce(
      (sum, asset) => sum + (asset.netPurchasePrice || asset.price / 1.19), 
      0
    );
    
    // Calculate current book values
    const currentBookValue = fixedAssets.reduce((sum, asset) => {
      const bookValue = calculateAssetBookValue(asset);
      return sum + bookValue.currentBookValue;
    }, 0);
    
    // Calculate depreciation amount
    const depreciationAmount = fixedAssetValue - currentBookValue;
    
    // Calculate category distribution
    const categoryDistribution = Array.from(
      fixedAssets.reduce((map, asset) => {
        const category = asset.category;
        if (!map.has(category)) {
          map.set(category, { category, count: 0, value: 0 });
        }
        const item = map.get(category)!;
        item.count++;
        item.value += (asset.netPurchasePrice || asset.price / 1.19);
        return map;
      }, new Map<string, { category: string; count: number; value: number }>())
    ).map(([_, value]) => value);
    
    return {
      fixedAssets,
      gwgAssets,
      fixedAssetValue,
      gwgValue,
      currentBookValue,
      depreciationAmount,
      assetCount: {
        fixed: fixedAssets.length,
        gwg: gwgAssets.length,
        other: assets.length - fixedAssets.length - gwgAssets.length,
        total: assets.length
      },
      categoryDistribution
    };
  } catch (error) {
    console.error("Error in getFixedAssetsReport:", error);
    return {
      fixedAssets: [],
      gwgAssets: [],
      fixedAssetValue: 0,
      gwgValue: 0,
      currentBookValue: 0,
      depreciationAmount: 0,
      assetCount: {
        fixed: 0,
        gwg: 0,
        other: 0,
        total: 0
      },
      categoryDistribution: []
    };
  }
};
