
// This file re-exports everything from the assets subdirectory for backward compatibility
// But we need to be careful with duplicated exports

// Import all the modules
import * as fetchModule from './assets/fetch';
import * as updateModule from './assets/update';
import * as statsModule from './assets/stats';
import * as storageModule from './assets/storage';
import * as mappersModule from './assets/mappers';
import * as historyModule from './assets/history';
import * as createModule from './assets/create';

// Export modules individually to avoid conflicts
export {
  // Export from fetch.ts except createAsset which is in create.ts
  getAssetById,
  getAssets,
  getAssetsByEmployeeId,
  getAssetHistoryByAssetId
} from './assets/fetch';

export {
  updateAsset
} from './assets/update';

// Export everything else without conflicts
export * from './assets/stats';
export * from './assets/storage';
export * from './assets/mappers';
export * from './assets/history';

// Export createAsset from create.ts
export {
  createAsset
} from './assets/create';
