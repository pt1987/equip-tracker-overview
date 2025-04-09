
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

// Re-export any helper functions that might still be useful
export * from './helpers';
