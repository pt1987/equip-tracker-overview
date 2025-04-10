
// Export all functions from the asset modules with proper naming to avoid conflicts

// Export from fetch.ts except createAsset
export {
  getAssetById,
  getAssets,
  getAssetsByEmployeeId,
  getAssetHistoryByAssetId
} from './fetch';

// Export from other modules
export { updateAsset } from './update';
export * from './stats';
export * from './storage';
export * from './history';

// Export createAsset from create.ts only
export { createAsset } from './create';
export * from './mappers';
