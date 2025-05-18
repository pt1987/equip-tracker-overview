
import { supabase } from "@/integrations/supabase/client";
import { DepartmentAssetData } from "../DepartmentAssetsReport";

export const getDepartmentAssetsData = async (dateRange?: any): Promise<DepartmentAssetData[]> => {
  console.log("Fetching department assets data with date range:", dateRange);
  
  try {
    // First, get employees grouped by cluster (department)
    const { data: employeesByDepartment, error: employeeError } = await supabase
      .from('employees')
      .select('cluster, id')
      .order('cluster');
    
    if (employeeError) {
      console.error("Error fetching employees by department:", employeeError);
      throw employeeError;
    }
    
    // Count employees by department
    const departmentCounts: Record<string, number> = {};
    employeesByDepartment.forEach(emp => {
      const dept = emp.cluster || 'Unknown';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    // Get all assets
    let assetsQuery = supabase
      .from('assets')
      .select('*');
    
    // Apply date filter if provided
    if (dateRange?.from && dateRange?.to) {
      assetsQuery = assetsQuery
        .gte('purchase_date', new Date(dateRange.from).toISOString().split('T')[0])
        .lte('purchase_date', new Date(dateRange.to).toISOString().split('T')[0]);
    }
    
    const { data: assets, error: assetError } = await assetsQuery;
    
    if (assetError) {
      console.error("Error fetching assets:", assetError);
      throw assetError;
    }

    // Get employee details to determine department for each asset
    const { data: employees, error: detailError } = await supabase
      .from('employees')
      .select('id, cluster');
    
    if (detailError) {
      console.error("Error fetching employee details:", detailError);
      throw detailError;
    }

    // Create a map of employee ID to department
    const employeeDepartmentMap: Record<string, string> = {};
    employees.forEach(emp => {
      employeeDepartmentMap[emp.id] = emp.cluster || 'Unknown';
    });

    // Group assets by department using the employee's department
    const departmentAssets: Record<string, {
      assets: any[],
      assetTypes: {
        laptop: number;
        smartphone: number;
        tablet: number;
        accessory: number;
      }
    }> = {};

    assets.forEach(asset => {
      // Determine the department based on the asset's assigned employee
      const department = asset.employee_id ? 
        employeeDepartmentMap[asset.employee_id] || 'Unassigned' : 
        'Unassigned';

      if (!departmentAssets[department]) {
        departmentAssets[department] = {
          assets: [],
          assetTypes: { laptop: 0, smartphone: 0, tablet: 0, accessory: 0 }
        };
      }

      departmentAssets[department].assets.push(asset);

      // Update asset type count
      const assetType = asset.type ? asset.type.toLowerCase() : 'accessory';
      if (assetType.includes('laptop') || assetType.includes('notebook')) {
        departmentAssets[department].assetTypes.laptop += 1;
      } else if (assetType.includes('phone') || assetType.includes('smartphone')) {
        departmentAssets[department].assetTypes.smartphone += 1;
      } else if (assetType.includes('tablet') || assetType.includes('ipad')) {
        departmentAssets[department].assetTypes.tablet += 1;
      } else {
        departmentAssets[department].assetTypes.accessory += 1;
      }
    });

    // Format the data for the report
    return Object.keys(departmentAssets).map(department => {
      const deptAssets = departmentAssets[department].assets;
      const assetCount = deptAssets.length;
      const totalValue = deptAssets.reduce((sum, asset) => sum + (Number(asset.price) || 0), 0);
      const employeeCount = departmentCounts[department] || 0;
      
      return {
        department,
        assetCount,
        totalValue,
        assetsByType: {
          laptop: departmentAssets[department].assetTypes.laptop,
          smartphone: departmentAssets[department].assetTypes.smartphone,
          tablet: departmentAssets[department].assetTypes.tablet,
          accessory: departmentAssets[department].assetTypes.accessory
        },
        employeeCount,
        assetsPerEmployee: employeeCount > 0 ? assetCount / employeeCount : 0
      };
    }).filter(dept => dept.assetCount > 0 || dept.employeeCount > 0);
  } catch (error) {
    console.error("Error in getDepartmentAssetsData:", error);
    return [];
  }
};
