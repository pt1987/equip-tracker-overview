
import { z } from "zod";
import { AssetType, AssetStatus, AssetClassification } from "@/lib/types";

export const assetFormSchema = z.object({
  category: z.string().min(1, "Bitte wählen Sie eine Kategorie"),
  manufacturer: z.string().min(1, "Bitte geben Sie einen Hersteller an"),
  model: z.string().min(1, "Bitte geben Sie ein Modell an"),
  status: z.string().min(1, "Bitte wählen Sie einen Status"),
  assignedTo: z.string().optional(),
  purchaseDate: z.string().min(1, "Bitte geben Sie ein Kaufdatum an"),
  price: z.coerce.number().min(0, "Der Preis darf nicht negativ sein"),
  vendor: z.string().optional(),
  serialNumber: z.string().optional(),
  inventoryNumber: z.string().optional(),
  hasWarranty: z.boolean().optional(),
  additionalWarranty: z.boolean().optional(),
  warrantyExpiryDate: z.string().optional(),
  warrantyInfo: z.string().optional(),
  imei: z.string().optional(),
  phoneNumber: z.string().optional(),
  provider: z.string().optional(),
  contractDuration: z.string().optional(),
  contractName: z.string().optional(),
  relatedAssetId: z.string().optional(),
  
  // New fields for the depreciation module
  isFixedAsset: z.boolean().optional(),
  isGWG: z.boolean().optional(),
  netPurchasePrice: z.coerce.number().optional(),
  usageDuration: z.coerce.number().optional(),
  commissioningDate: z.string().optional(),
  invoiceNumber: z.string().optional(),
  disposalDate: z.string().optional(),
  notes: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  
  // ISO 27001 fields
  classification: z.string().optional(),
  assetOwnerId: z.string().optional(),
  lastReviewDate: z.string().optional(),
  nextReviewDate: z.string().optional(),
  riskLevel: z.string().optional(),
  isPersonalData: z.boolean().optional(),
  disposalMethod: z.string().optional(),
  lifecycleStage: z.string().optional(),
  
  // External asset fields
  isExternal: z.boolean().optional(),
  ownerCompany: z.string().min(1, "Bitte geben Sie eine Eigentümerfirma an").optional(),
  projectId: z.string().min(1, "Bitte geben Sie eine Projekt-ID an").optional(),
  responsibleEmployeeId: z.string().min(1, "Bitte wählen Sie einen verantwortlichen Mitarbeiter").optional(),
  handoverToEmployeeDate: z.string().min(1, "Bitte geben Sie ein Übergabedatum an").optional(),
  plannedReturnDate: z.string().min(1, "Bitte geben Sie ein geplantes Rückgabedatum an").optional(),
  actualReturnDate: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

// Custom validation function for external assets
export function validateExternalAsset(values: AssetFormValues): Record<string, string> | null {
  const errors: Record<string, string> = {};
  
  // Only validate if asset is marked as external
  if (values.isExternal) {
    if (!values.ownerCompany || values.ownerCompany === 'PHAT Consulting GmbH') {
      errors.ownerCompany = "Externe Assets benötigen eine andere Eigentümerfirma als PHAT Consulting";
    }
    
    if (!values.projectId) {
      errors.projectId = "Für externe Assets ist eine Projekt-ID erforderlich";
    }
    
    if (!values.responsibleEmployeeId) {
      errors.responsibleEmployeeId = "Für externe Assets ist ein verantwortlicher Mitarbeiter erforderlich";
    }
    
    if (!values.handoverToEmployeeDate) {
      errors.handoverToEmployeeDate = "Für externe Assets ist ein Übergabedatum erforderlich";
    }
    
    if (!values.plannedReturnDate) {
      errors.plannedReturnDate = "Für externe Assets ist ein geplantes Rückgabedatum erforderlich";
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}
