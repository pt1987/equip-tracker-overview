
// This file re-exports helper functions from the appropriate files
export { 
  getAssetById, 
  getAssets,
  updateAsset,
  createAsset,
} from './assets';

// Include the employee asset summary function
import { getEmployeeAssetsSummary } from "./employees/assets";
export { getEmployeeAssetsSummary };

import { Asset, AssetStatus, AssetType, Employee } from "@/lib/types";

// Add the missing getRoles function
export const getRoles = () => {
  return [
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access with all permissions",
      permissions: {
        canAccessAdmin: true,
        canEditAssets: true,
        canCreateEmployees: true,
        canEditEmployees: true,
        canEditOwnAssets: true,
        canEditOwnProfile: true,
        canViewReports: true
      }
    },
    {
      id: "editor",
      name: "Editor",
      description: "Can edit content but not access admin functions",
      permissions: {
        canAccessAdmin: false,
        canEditAssets: true,
        canCreateEmployees: false,
        canEditEmployees: false,
        canEditOwnAssets: true,
        canEditOwnProfile: true,
        canViewReports: true
      }
    },
    {
      id: "user",
      name: "User",
      description: "Standard user with limited permissions",
      permissions: {
        canAccessAdmin: false,
        canEditAssets: false,
        canCreateEmployees: false,
        canEditEmployees: false,
        canEditOwnAssets: false,
        canEditOwnProfile: true,
        canViewReports: false
      }
    }
  ];
};
