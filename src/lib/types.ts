
export type AssetStatus = 
  | 'ordered' 
  | 'delivered' 
  | 'in_use' 
  | 'defective' 
  | 'repair' 
  | 'pool';

export type AssetType = 
  | 'laptop' 
  | 'smartphone' 
  | 'tablet' 
  | 'mouse' 
  | 'keyboard' 
  | 'accessory';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  manufacturer: string;
  model: string;
  purchaseDate: string;
  vendor: string;
  price: number;
  status: AssetStatus;
  employeeId: string | null;
  serialNumber?: string;
  inventoryNumber?: string;
  additionalWarranty?: boolean;
  imei?: string;
  phoneNumber?: string;
  provider?: string;
  contractEndDate?: string;
  contractName?: string;
  connectedAssetId?: string;
  imageUrl?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  startDate: string;
  cluster: string;
  position: string;
  budget: number;
  usedBudget: number;
}

export interface AssetHistoryEntry {
  id: string;
  assetId: string;
  date: string;
  action: 'purchase' | 'assign' | 'status_change' | 'return';
  employeeId: string | null;
  notes: string;
}

export interface DashboardStats {
  totalAssets: number;
  assignedAssets: number;
  poolAssets: number;
  defectiveAssets: number;
  totalBudgetUsed: number;
  totalBudget: number;
}

export interface AssetTypeDistribution {
  type: AssetType;
  count: number;
}

export interface AssetStatusDistribution {
  status: AssetStatus;
  count: number;
}
