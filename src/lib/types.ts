
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
  assignedTo?: string | null;
  category: string;
  serialNumber?: string;
  inventoryNumber?: string;
  additionalWarranty?: boolean;
  hasWarranty?: boolean;
  imei?: string;
  phoneNumber?: string;
  provider?: string;
  contractEndDate?: string;
  contractName?: string;
  contractDuration?: string;
  connectedAssetId?: string;
  relatedAssetId?: string;
  imageUrl?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  startDate: string;
  entryDate?: string;
  cluster: string;
  position: string;
  budget: number;
  usedBudget: number;
  profileImage?: string;
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

// New types for reporting
export interface OrderTimeline {
  employeeId: string;
  employeeName: string;
  orders: {
    date: string;
    assetName: string;
    assetType: string;
    price: number;
  }[];
}

export interface YearlyBudgetReport {
  year: number;
  totalSpent: number;
}

export interface YearlyAssetPurchaseReport {
  year: number;
  assetsByType: {
    [key in AssetType]?: number;
  };
  total: number;
}

export interface AssetUsageDurationReport {
  category: string;
  averageMonths: number;
  count: number;
}

export interface WarrantyDefectReport {
  withWarranty: {
    count: number;
    percentage: number;
  };
  withoutWarranty: {
    count: number;
    percentage: number;
  };
}

export type ReportType = 
  | 'orderTimeline'
  | 'yearlyBudget'
  | 'yearlyPurchases'
  | 'usageDuration'
  | 'warrantyDefects';

// New types for form automation
export type FormType = 'onboarding' | 'offboarding';

export type FormStatus = 'draft' | 'pending' | 'completed' | 'cancelled';

export interface AssetChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface AssetFormEntry {
  assetId: string;
  assetName: string;
  serialNumber?: string;
  condition: string;
  accessories: string[];
  checklistItems: AssetChecklistItem[];
}

export interface EmployeeForm {
  id: string;
  formType: FormType;
  employeeId: string;
  employeeName: string;
  createdDate: string;
  completedDate?: string;
  status: FormStatus;
  assets: AssetFormEntry[];
  signature?: string;
  notes?: string;
  documentUrl?: string;
  emailSent: boolean;
}
