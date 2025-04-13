export type AssetStatus = 
  | 'ordered' 
  | 'delivered' 
  | 'in_use' 
  | 'defective' 
  | 'repair' 
  | 'pool'
  | 'disposed' 
  | 'sold';

export type AssetType = 
  | 'laptop' 
  | 'smartphone' 
  | 'tablet' 
  | 'mouse' 
  | 'keyboard' 
  | 'accessory';

export type UserRole = 
  | 'admin'     // Administrator: Full access
  | 'editor'    // Editor: Can edit assets and create employees
  | 'user';     // Regular user: Can only see data and edit own assets

export interface UserPermissions {
  canAccessAdmin: boolean;
  canEditAssets: boolean;
  canCreateEmployees: boolean;
  canEditEmployees: boolean;
  canEditOwnAssets: boolean;
  canEditOwnProfile: boolean;
  canViewReports: boolean;
}

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
  warrantyExpiryDate?: string;
  warrantyInfo?: string;
  imei?: string;
  phoneNumber?: string;
  provider?: string;
  contractEndDate?: string;
  contractName?: string;
  contractDuration?: string;
  connectedAssetId?: string;
  relatedAssetId?: string;
  imageUrl?: string;
  isFixedAsset?: boolean;
  isGWG?: boolean;
  isPoolDevice?: boolean;  // New field for pool device
  netPurchasePrice?: number;
  usageDuration?: number;
  commissioningDate?: string;
  invoiceNumber?: string;
  disposalDate?: string;
  notes?: string;
  department?: string;
  location?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  cluster: string;
  competenceLevel?: string;
  imageUrl?: string;
  startDate: string;
  entryDate?: string;
  budget: number;
  usedBudget: number;
  profileImage?: string;
}

export type AssetHistoryAction = 
  | 'purchase' 
  | 'delivery'
  | 'assign' 
  | 'status_change' 
  | 'repair'
  | 'return'
  | 'dispose'
  | 'depreciation_change';

export interface AssetHistoryEntry {
  id: string;
  assetId: string;
  date: string;
  action: AssetHistoryAction;
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
  | 'warrantyDefects'
  | 'fixedAssets';

export interface FixedAssetsReport {
  fixedAssets: Asset[];
  gwgAssets: Asset[];
  fixedAssetValue: number;
  gwgValue: number;
  currentBookValue: number;
  depreciationAmount: number;
  assetCount: {
    fixed: number;
    gwg: number;
    other: number;
    total: number;
  };
  categoryDistribution: Array<{
    category: string;
    count: number;
    value: number;
  }>;
}

export type EmployeeFormType = 'onboarding' | 'offboarding';
export type EmployeeFormStatus = 'draft' | 'completed' | 'cancelled';

export interface EmployeeFormChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface EmployeeFormAsset {
  assetId: string;
  assetName: string;
  serialNumber: string;
  condition: string;
  accessories: string[];
  checklistItems: EmployeeFormChecklistItem[];
}

export interface EmployeeForm {
  id: string;
  formType: EmployeeFormType;
  employeeId: string;
  employeeName: string;
  createdDate: string;
  completedDate?: string;
  status: EmployeeFormStatus;
  assets: EmployeeFormAsset[];
  signature?: string;
  notes?: string;
  documentUrl?: string;
  emailSent: boolean;
}

export interface DepreciationSettings {
  assetTypes: {
    [key in AssetType]?: {
      defaultDuration: number;
      minDuration: number;
      maxDuration: number;
    }
  };
  gwgThreshold: number;
}

export interface DepreciationEntry {
  id: string;
  assetId: string;
  year: number;
  month: number;
  amount: number;
  currentBookValue: number;
  createdAt: string;
}

export interface AssetBookValue {
  currentBookValue: number;
  originalValue: number;
  depreciationPercentage: number;
  monthlyDepreciation: number;
  annualDepreciation: number;
  remainingMonths: number;
  totalMonths: number;
  isFullyDepreciated: boolean;
}

export interface AssetBooking {
  id: string;
  assetId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  purpose?: string;
  status: BookingStatus;
  createdAt: string;
  returnInfo?: BookingReturn;
}

export type BookingStatus = 
  | 'reserved'  // Future booking
  | 'active'    // Current booking
  | 'completed' // Past booking
  | 'canceled'; // Canceled booking

export interface BookingReturn {
  returned: boolean;
  returnedAt?: string;
  condition: BookingReturnCondition;
  comments?: string;
  checkedById?: string;
  checkedAt?: string;
}

export type BookingReturnCondition = 
  | 'good'       // In good condition
  | 'damaged'    // Damaged
  | 'incomplete' // Missing accessories
  | 'lost';      // Lost device
