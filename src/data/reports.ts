
import { 
  OrderTimeline, 
  YearlyBudgetReport, 
  YearlyAssetPurchaseReport, 
  AssetUsageDurationReport, 
  WarrantyDefectReport,
  AssetType
} from "@/lib/types";
import { getAssets, getAssetHistoryByAssetId } from "./assets";
import { getEmployees } from "./employees";
import { calculateAgeInMonths, groupBy } from "@/lib/utils";

// Helper function to get employee name
const getEmployeeName = async (id: string): Promise<string> => {
  const employees = await getEmployees();
  const employee = employees.find(emp => emp.id === id);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
};

// Order Timeline per employee
export const getOrderTimelineByEmployee = async (employeeId?: string): Promise<OrderTimeline[]> => {
  const employees = await getEmployees();
  const assets = await getAssets();
  const allAssetHistory: any[] = [];
  
  // Get all asset history entries
  for (const asset of assets) {
    const history = await getAssetHistoryByAssetId(asset.id);
    allAssetHistory.push(...history);
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
        assetType: asset.type,
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
};

// Yearly budget report
export const getYearlyBudgetReport = async (): Promise<YearlyBudgetReport[]> => {
  const assets = await getAssets();
  
  // Group assets by purchase year
  const assetsByYear = groupBy(assets, asset => {
    const date = new Date(asset.purchaseDate);
    return date.getFullYear().toString();
  });

  // Calculate total spending per year
  return Object.entries(assetsByYear).map(([yearStr, yearAssets]) => {
    const year = parseInt(yearStr);
    const totalSpent = yearAssets.reduce((sum, asset) => sum + asset.price, 0);
    
    return { year, totalSpent };
  }).sort((a, b) => a.year - b.year);
};

// Yearly asset purchases report
export const getYearlyAssetPurchasesReport = async (): Promise<YearlyAssetPurchaseReport[]> => {
  const assets = await getAssets();
  
  // Group assets by purchase year
  const assetsByYear = groupBy(assets, asset => {
    const date = new Date(asset.purchaseDate);
    return date.getFullYear().toString();
  });

  // Calculate assets by type per year
  return Object.entries(assetsByYear).map(([yearStr, yearAssets]) => {
    const year = parseInt(yearStr);
    const assetsByType = {} as Record<AssetType, number>;
    
    yearAssets.forEach(asset => {
      if (!assetsByType[asset.type]) {
        assetsByType[asset.type] = 0;
      }
      assetsByType[asset.type]++;
    });
    
    const total = yearAssets.length;
    
    return { year, assetsByType, total };
  }).sort((a, b) => a.year - b.year);
};

// Average usage duration by asset category
export const getAssetUsageDurationReport = async (): Promise<AssetUsageDurationReport[]> => {
  const assets = await getAssets();
  
  // Group assets by category
  const assetsByCategory = groupBy(assets, asset => asset.category);

  // Calculate average age in months for each category
  return Object.entries(assetsByCategory).map(([category, categoryAssets]) => {
    const totalMonths = categoryAssets.reduce((sum, asset) => {
      return sum + calculateAgeInMonths(asset.purchaseDate);
    }, 0);
    
    const count = categoryAssets.length;
    const averageMonths = count > 0 ? Math.round(totalMonths / count) : 0;
    
    return { category, averageMonths, count };
  }).sort((a, b) => b.averageMonths - a.averageMonths);
};

// Warranty defect report
export const getWarrantyDefectReport = async (): Promise<WarrantyDefectReport> => {
  const assets = await getAssets();
  
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
};
