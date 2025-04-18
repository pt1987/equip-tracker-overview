
// Export all asset-related functions with namespaces to avoid conflicts

// Export from fetch.ts
export {
  getAssetById,
  getAssets,
  getAssetsByEmployeeId,
  getAssetHistoryByAssetId
} from './fetch';

// Export from other modules
export { updateAsset } from './update';
export { createAsset } from './create';
export * from './stats';
export * from './storage';
export * from './history';
export * from './mappers';
