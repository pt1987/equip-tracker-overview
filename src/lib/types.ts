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

// Classification level according to ISO 27001
export type AssetClassification = 
  | 'public'      // Information that can be freely disclosed
  | 'internal'    // Information for internal use only
  | 'confidential' // Sensitive information requiring protection
  | 'restricted';  // Highly sensitive information with strict access control

// Owner company type for assets
export type AssetOwner = 'PHAT Consulting GmbH' | string;

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
  
  // ISO 27001 specific fields
  classification?: AssetClassification;  // Information classification level
  assetOwnerId?: string;                // Person responsible for the asset
  lastReviewDate?: string;             // Date of last security review
  nextReviewDate?: string;             // Date of next required review
  riskLevel?: 'low' | 'medium' | 'high'; // Associated risk level
  isPersonalData?: boolean;            // Whether asset contains personal data (GDPR relevance)
  disposalMethod?: string;             // Method used for secure disposal
  lifecycleStage?: 'procurement' | 'operation' | 'maintenance' | 'disposal'; // Current lifecycle stage
  
  // New fields for external asset management
  isExternal?: boolean;
  ownerCompany?: AssetOwner;
  projectId?: string;
  responsibleEmployeeId?: string;
  handoverToEmployeeDate?: string;
  plannedReturnDate?: string;
  actualReturnDate?: string;
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
  | 'depreciation_change'
  | 'edit'  // New action type for general edits
  | 'booking'; // New action type for bookings

export interface AssetHistoryEntry {
  id: string;
  assetId: string;
  date: string;
  action: AssetHistoryAction;
  employeeId: string | null;
  userId?: string | null;  // User who made the change
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
  | 'fixedAssets'
  | 'employeeBudget'
  | 'vendorPurchase'
  | 'assetLifecycle'
  | 'maintenanceCost'
  | 'softwareLicense'
  | 'departmentAssets'
  | 'assetUtilization'
  | 'replacementPlanning'
  | 'carbonFootprint'
  | 'roii'
  | 'vendorComparison';

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

// New interface for ISO 27001 Asset Review
export interface AssetReview {
  id: string;
  assetId: string;
  reviewerId: string;
  reviewDate: string;
  findings: string;
  recommendations: string;
  nextReviewDate: string;
  isCompliant: boolean;
}

// New interface for Asset Ownership transfer history
export interface AssetOwnershipChange {
  id: string;
  assetId: string;
  previousOwnerId: string | null;
  newOwnerId: string;
  changeDate: string;
  reason: string;
  approvedById: string;
}

// New interface for damage incidents
export interface DamageIncident {
  id: string;
  assetId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  damageType: string;
  damageDate: string;
  reportDate: string;
  reportedById: string;
  location?: string;
  isConfidential: boolean;
  damageDescription: string;
  measuresDescription?: string;
  assignedTo?: string;
  resolvedDate?: string;
  resolutionNotes?: string;
}

export interface VendorPurchaseReport {
  vendor: string;
  assetCount: number;
  revenue: number;
  manufacturerDistribution: Array<{
    manufacturer: string;
    count: number;
  }>;
}

export interface OwnerCompanyDistribution {
  company: string;
  count: number;
}

// Neue Report Interfaces
export interface AssetLifecycleReport {
  category: string;
  averageLifespanMonths: number;
  count: number;
  purchaseToDeploymentDays: number;
  deploymentToRetirementMonths: number;
}

export interface MaintenanceCostReport {
  assetId: string;
  assetName: string;
  category: string;
  purchaseValue: number;
  totalMaintenanceCost: number;
  maintenanceRatio: number; // Maintenance cost as percentage of purchase value
  maintenanceCount: number; // Number of maintenance events
}

export interface SoftwareLicenseReport {
  name: string;
  licenseType: string;
  expiryDate: string;
  assignedCount: number;
  totalLicenses: number;
  costPerLicense: number;
  totalCost: number;
  complianceStatus: 'compliant' | 'overused' | 'underused';
}

export interface DepartmentAssetsReport {
  department: string;
  assetCount: number;
  totalValue: number;
  assetsByType: {
    [key in AssetType]?: number;
  };
  employeeCount: number;
  assetsPerEmployee: number;
}

export interface AssetUtilizationReport {
  assetId: string;
  assetName: string;
  category: string;
  utilizationRatio: number; // Percentage of time the asset is in use
  totalBookings: number;
  totalBookingDays: number;
  idleDays: number;
  availabilityRate: number; // Percentage of time the asset is available
}

export interface ReplacementPlanningReport {
  assetId: string;
  assetName: string;
  category: string;
  purchaseDate: string;
  recommendedReplaceDate: string;
  ageInMonths: number;
  conditionScore: number; // 1-10 scale
  replacementPriority: 'high' | 'medium' | 'low';
  estimatedReplacementCost: number;
}

export interface CarbonFootprintReport {
  category: string;
  assetCount: number;
  estimatedEnergyUse: number; // kWh
  estimatedCO2: number; // kg
  sustainabilityScore: number; // 0-100
  recommendations: string[];
}

export interface ROIIReport {
  category: string;
  initialInvestment: number;
  operationalCost: number;
  businessValue: number;
  roi: number; // Return on investment percentage
  paybackPeriodMonths: number;
}

export interface VendorComparisonReport {
  vendor: string;
  assetCount: number;
  totalSpent: number;
  reliabilityScore: number; // 0-100
  defectRate: number; // Percentage
  avgResponseTimeDays: number;
  satisfactionScore: number; // 0-5
  onTimeDeliveryRate: number; // Percentage
}

export interface LandingPageImage {
  id: string;
  file_name: string;
  storage_path: string;
  display_name: string;
  description?: string;
  image_type: string;
  created_at: string;
  updated_at?: string;
  created_by: string;
  url: string; // This will be populated from storage URL
}
