// This file re-exports helper functions from the appropriate files
export { 
  getAssetById, 
  getAssets, 
  getAssetsByEmployeeId, 
  getAssetHistoryByAssetId,
  getAssetTypeDistribution,
  getAssetStatusDistribution,
  updateAsset,
  uploadAssetImage
} from './assets';

export { 
  getEmployeeById, 
  getEmployees, 
  getEmployeeAssetsSummary 
} from './employees';

export {
  getUsers,
  updateUserRole,
  deleteUser
} from './users';

// Re-export any helper functions that might still be useful
export * from './helpers';

// Role management helpers
export const getRoles = () => {
  return [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Vollständiger Zugriff auf alle Funktionen',
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
      id: 'editor',
      name: 'Editor',
      description: 'Kann Assets und Mitarbeiter verwalten, aber keinen Admin-Bereich nutzen',
      permissions: {
        canAccessAdmin: false,
        canEditAssets: true,
        canCreateEmployees: true,
        canEditEmployees: true,
        canEditOwnAssets: true,
        canEditOwnProfile: true,
        canViewReports: true
      }
    },
    {
      id: 'user',
      name: 'Benutzer',
      description: 'Kann nur eigene Assets und Profile einsehen und bearbeiten',
      permissions: {
        canAccessAdmin: false,
        canEditAssets: false,
        canCreateEmployees: false,
        canEditEmployees: false,
        canEditOwnAssets: true,
        canEditOwnProfile: true,
        canViewReports: false
      }
    }
  ];
};

export const getRoleById = (roleId: string) => {
  const roles = getRoles();
  return roles.find(role => role.id === roleId);
};

import { getEmployeeAssetsSummary } from "./employees/assets";
import { Asset, AssetStatus, AssetType, Employee } from "@/lib/types";
