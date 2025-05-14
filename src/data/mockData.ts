// This file re-exports helper functions from the appropriate files
export { 
  getAssetById, 
  getAssets,
  updateAsset,
  createAsset,
} from './assets';

// Import and export the employee asset summary function
import { getEmployeeAssetsSummary } from "./employees/assets";
export { getEmployeeAssetsSummary };

import { Asset, AssetStatus, AssetType, Employee } from "@/lib/types";
