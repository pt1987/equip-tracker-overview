
// Types for the Purchase List feature

export type PurchaseStatus = 
  | 'draft'         // Initial entry, not all mandatory fields filled
  | 'pending'       // Complete but not reviewed
  | 'approved'      // Reviewed and approved
  | 'rejected'      // Reviewed and rejected
  | 'exported'      // Already exported to accounting system
  | 'archived';     // Archived after processing

export type TaxRate = 0 | 7 | 19;  // Common German VAT rates

export type PaymentMethod =
  | 'bank_transfer'
  | 'credit_card'
  | 'paypal'
  | 'cash'
  | 'direct_debit'
  | 'other';

export type GoBDStatus = 
  | 'red'     // Missing mandatory fields according to GoBD
  | 'yellow'  // Partially compliant, needs attention
  | 'green';  // Fully compliant with GoBD

export interface PurchaseItem {
  id: string;
  documentDate: string;          // Belegdatum
  supplier: string;              // Lieferant
  itemDescription: string;       // Artikel-/Güterbezeichnung
  quantity: number;              // Menge
  unit: string;                  // Einheit
  netAmount: number;             // Nettobetrag €
  vatAmount: number;             // MwSt €
  vatRate: TaxRate;              // MwSt-Satz %
  accountNumber: string;         // Sachkonto
  costCenter: string;            // Kostenstelle
  assetId?: string;              // Asset-ID (if activatable)
  status: PurchaseStatus;        // Status
  
  // Additional fields required by German regulations
  invoiceNumber: string;         // Rechnungsnummer
  invoiceDate: string;           // Rechnungsdatum
  paymentMethod: PaymentMethod;  // Zahlungsart
  paymentDate?: string;          // Zahlungsdatum
  documentPath: string;          // Path to the stored document
  documentType: string;          // File type of the document
  
  // Audit and compliance fields
  createdAt: string;             // Creation timestamp
  createdBy: string;             // User ID of creator
  lastModifiedAt: string;        // Last modification timestamp
  lastModifiedBy: string;        // User ID of last modifier
  reviewedAt?: string;           // Review timestamp
  reviewedBy?: string;           // User ID of reviewer
  gobdStatus: GoBDStatus;        // Compliance status (red/yellow/green)
  
  // Integration fields
  integrationId: string;         // ID for cross-system tracking
  notes?: string;                // Optional notes
  tags?: string[];               // Optional tags for categorization
}

export interface PurchaseItemHistory {
  id: string;
  purchaseItemId: string;
  timestamp: string;
  userId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
}

export interface PurchaseListFilter {
  dateRange?: { from: string; to: string };
  supplier?: string;
  costCenter?: string;
  vatRate?: TaxRate;
  status?: PurchaseStatus;
  gobdStatus?: GoBDStatus;
  searchTerm?: string;           // New: Added search term for global search
}

export interface PurchaseFormValues {
  documentDate: string;
  supplier: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  netAmount: number;
  vatAmount: number;
  vatRate: TaxRate;
  accountNumber: string;
  costCenter: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  notes?: string;
  tags?: string[];
}
