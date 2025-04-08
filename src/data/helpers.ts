
import { DashboardStats } from "@/lib/types";
import { getAssets } from "./assets";
import { getEmployees } from "./employees";

// Dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const assets = await getAssets();
  const employees = await getEmployees();
  
  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.employeeId !== null).length;
  const poolAssets = assets.filter(asset => asset.status === 'pool').length;
  const defectiveAssets = assets.filter(asset => asset.status === 'defective' || asset.status === 'repair').length;
  
  const totalBudget = employees.reduce((sum, emp) => sum + emp.budget, 0);
  const totalBudgetUsed = employees.reduce((sum, emp) => sum + emp.usedBudget, 0);
  
  return {
    totalAssets,
    assignedAssets,
    poolAssets,
    defectiveAssets,
    totalBudget,
    totalBudgetUsed
  };
};

// Grouping utility function
export const groupBy = <T>(array: T[], getKey: (item: T) => string) => {
  return array.reduce((result: Record<string, T[]>, currentItem) => {
    const key = getKey(currentItem);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(currentItem);
    return result;
  }, {});
};
