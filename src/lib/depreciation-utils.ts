import { Asset, AssetBookValue, DepreciationSettings } from "./types";

// Default depreciation settings according to German tax law
export const defaultDepreciationSettings: DepreciationSettings = {
  assetTypes: {
    laptop: { defaultDuration: 3, minDuration: 3, maxDuration: 5 },
    tablet: { defaultDuration: 3, minDuration: 3, maxDuration: 5 },
    smartphone: { defaultDuration: 3, minDuration: 3, maxDuration: 5 },
    mouse: { defaultDuration: 3, minDuration: 1, maxDuration: 3 },
    keyboard: { defaultDuration: 3, minDuration: 1, maxDuration: 3 },
    accessory: { defaultDuration: 3, minDuration: 1, maxDuration: 3 },
  },
  gwgThreshold: 800, // €800 net value threshold for GWG
};

/**
 * Determines if an asset should be classified as a fixed asset based on German tax law
 */
export function isFixedAsset(asset: Asset): boolean {
  // If it's explicitly marked, use that value
  if (asset.isFixedAsset !== undefined) return asset.isFixedAsset;
  
  // Otherwise determine based on price and expected usage
  const netPrice = asset.netPurchasePrice || asset.price / 1.19; // Estimate net price if not provided
  return netPrice > defaultDepreciationSettings.gwgThreshold;
}

/**
 * Determines if an asset is a GWG (Geringwertiges Wirtschaftsgut)
 */
export function isGWG(asset: Asset): boolean {
  // If it's explicitly marked, use that value
  if (asset.isGWG !== undefined) return asset.isGWG;
  
  // Otherwise determine based on price
  const netPrice = asset.netPurchasePrice || asset.price / 1.19; // Estimate net price if not provided
  return netPrice <= defaultDepreciationSettings.gwgThreshold && netPrice > 0;
}

/**
 * Calculates the recommended depreciation duration in months for an asset
 */
export function getRecommendedDepreciationDuration(asset: Asset): number {
  // If a specific usage duration is set, use that
  if (asset.usageDuration) return asset.usageDuration * 12;
  
  // Otherwise use the default for this asset type
  const assetTypeSettings = defaultDepreciationSettings.assetTypes[asset.type];
  if (assetTypeSettings) {
    return assetTypeSettings.defaultDuration * 12;
  }
  
  // Fall back to 3 years (36 months) if no specific setting
  return 36;
}

/**
 * Calculates the current book value and depreciation details for an asset
 */
export function calculateAssetBookValue(asset: Asset): AssetBookValue {
  // Get base values
  const purchaseDate = asset.commissioningDate || asset.purchaseDate;
  const originalValue = asset.netPurchasePrice || asset.price / 1.19; // Estimate net if not provided
  const depreciationDurationMonths = getRecommendedDepreciationDuration(asset);
  
  // For GWGs, immediate depreciation in first year
  if (isGWG(asset)) {
    return {
      currentBookValue: 0,
      originalValue,
      depreciationPercentage: 100,
      monthlyDepreciation: originalValue,
      annualDepreciation: originalValue,
      remainingMonths: 0,
      totalMonths: 0,
      isFullyDepreciated: true
    };
  }
  
  // For regular fixed assets, calculate linear depreciation
  const startDate = new Date(purchaseDate);
  const today = new Date();
  
  // Calculate months since purchase
  const monthsPassed = 
    (today.getFullYear() - startDate.getFullYear()) * 12 + 
    (today.getMonth() - startDate.getMonth());
  
  // Calculate depreciation amounts
  const monthlyDepreciation = originalValue / depreciationDurationMonths;
  const annualDepreciation = monthlyDepreciation * 12;
  
  // Calculate current book value
  let depreciatedMonths = Math.min(monthsPassed, depreciationDurationMonths);
  const currentBookValue = Math.max(0, originalValue - (depreciatedMonths * monthlyDepreciation));
  
  // Calculate remaining duration and percentage
  const remainingMonths = Math.max(0, depreciationDurationMonths - depreciatedMonths);
  const depreciationPercentage = (depreciatedMonths / depreciationDurationMonths) * 100;
  
  return {
    currentBookValue,
    originalValue,
    depreciationPercentage,
    monthlyDepreciation,
    annualDepreciation,
    remainingMonths,
    totalMonths: depreciationDurationMonths,
    isFullyDepreciated: remainingMonths === 0
  };
}

/**
 * Format a monetary value according to German standards (1.000,00 €)
 */
export function formatGermanCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
