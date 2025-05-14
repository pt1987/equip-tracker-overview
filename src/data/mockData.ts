// This file re-exports helper functions from the appropriate files
export { 
  getAssetById, 
  getAssets,
  updateAsset,
  createAsset,
} from './assets';

import { getEmployeeAssetsSummary } from "./employees/assets";
export { getEmployeeAssetsSummary };

import { Asset, AssetStatus, AssetType, Employee } from "@/lib/types";
