
// This file re-exports everything from the assets subdirectory for backward compatibility

// Export individual functions to avoid conflicts
export {
  getAssetById,
  getAssets,
  getAssetsByEmployeeId,
  getAssetHistoryByAssetId
} from './assets/fetch';

export {
  updateAsset
} from './assets/update';

export {
  createAsset
} from './assets/create';

// Export everything else without conflicts
export * from './assets/stats';
export * from './assets/storage';
export * from './assets/mappers';
export * from './assets/history';
