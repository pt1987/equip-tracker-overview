
import { z } from "zod";
import { AssetType, AssetStatus, AssetClassification } from "@/lib/types";

// Grundlegendes Schema für alle Assets
const baseAssetSchema = z.object({
  category: z.string().min(1, "Bitte wählen Sie eine Kategorie"),
  manufacturer: z.string().min(1, "Bitte geben Sie einen Hersteller an"),
  model: z.string().min(1, "Bitte geben Sie ein Modell an"),
  status: z.string().min(1, "Bitte wählen Sie einen Status"),
  assignedTo: z.string().optional(),
  vendor: z.string().optional(),
  serialNumber: z.string().optional(),
  inventoryNumber: z.string().optional(),
  
  // Garantiefelder
  hasWarranty: z.boolean().optional(),
  additionalWarranty: z.boolean().optional(),
  warrantyExpiryDate: z.string().optional(),
  warrantyInfo: z.string().optional(),
  
  // Asset-spezifische Felder
  imei: z.string().optional(),
  phoneNumber: z.string().optional(),
  provider: z.string().optional(),
  contractDuration: z.string().optional(),
  contractName: z.string().optional(),
  relatedAssetId: z.string().optional(),
  
  // Abschreibungsfelder
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
  
  // ISO 27001 Felder
  classification: z.string().optional(),
  assetOwnerId: z.string().optional(),
  lastReviewDate: z.string().optional(),
  nextReviewDate: z.string().optional(),
  riskLevel: z.string().optional(),
  isPersonalData: z.boolean().optional(),
  disposalMethod: z.string().optional(),
  lifecycleStage: z.string().optional(),
  
  // Gemeinsames Feld für beide Asset-Typen
  ownerCompany: z.string().optional(),
});

// Schema für interne Assets (mit Kaufdatum und Preis)
const internalAssetSchema = baseAssetSchema.extend({
  purchaseDate: z.string().min(1, "Bitte geben Sie ein Kaufdatum an"),
  price: z.coerce.number().min(0, "Der Preis darf nicht negativ sein"),
  isExternal: z.literal(false),
  // Diese Felder sind für interne Assets nicht erforderlich
  projectId: z.string().optional(),
  responsibleEmployeeId: z.string().optional(),
  handoverToEmployeeDate: z.string().optional(),
  plannedReturnDate: z.string().optional(),
  actualReturnDate: z.string().optional(),
});

// Schema für externe Assets (mit Pflichtfeldern für externe Assets)
const externalAssetSchema = baseAssetSchema.extend({
  purchaseDate: z.string().optional(),
  price: z.coerce.number().optional(),
  isExternal: z.literal(true),
  projectId: z.string().min(1, "Bitte geben Sie eine Projekt-ID an"),
  responsibleEmployeeId: z.string().min(1, "Bitte wählen Sie einen verantwortlichen Mitarbeiter"),
  handoverToEmployeeDate: z.string().min(1, "Bitte geben Sie ein Übergabedatum an"),
  plannedReturnDate: z.string().min(1, "Bitte geben Sie ein geplantes Rückgabedatum an"),
  actualReturnDate: z.string().optional(),
});

// Kombiniertes Schema, das basierend auf isExternal das richtige Schema verwendet
export const assetFormSchema = z.discriminatedUnion("isExternal", [
  internalAssetSchema,
  externalAssetSchema,
]);

export type AssetFormValues = z.infer<typeof assetFormSchema>;

// Helper type to extract the fields that are only present in external assets
export type ExternalAssetFields = Pick<
  AssetFormValues & { isExternal: true },
  'projectId' | 'responsibleEmployeeId' | 'handoverToEmployeeDate' | 'plannedReturnDate' | 'actualReturnDate'
>;

// Hilfsfunktion zur Validierung externer Assets
export function validateExternalAsset(values: AssetFormValues): Record<string, string> | null {
  const errors: Record<string, string> = {};
  
  // Nur validieren, wenn das Asset als extern markiert ist
  if (values.isExternal) {
    // Wir können hier jetzt type assertion verwenden, da wir wissen, dass es sich um ein externes Asset handelt
    const externalValues = values as (AssetFormValues & { isExternal: true });
    
    if (!externalValues.ownerCompany || externalValues.ownerCompany === 'PHAT Consulting GmbH') {
      errors.ownerCompany = "Externe Assets benötigen eine andere Eigentümerfirma als PHAT Consulting";
    }
    
    if (!externalValues.projectId) {
      errors.projectId = "Für externe Assets ist eine Projekt-ID erforderlich";
    }
    
    if (!externalValues.responsibleEmployeeId || externalValues.responsibleEmployeeId === "not_assigned") {
      errors.responsibleEmployeeId = "Für externe Assets ist ein verantwortlicher Mitarbeiter erforderlich";
    }
    
    if (!externalValues.handoverToEmployeeDate) {
      errors.handoverToEmployeeDate = "Für externe Assets ist ein Übergabedatum erforderlich";
    }
    
    if (!externalValues.plannedReturnDate) {
      errors.plannedReturnDate = "Für externe Assets ist ein geplantes Rückgabedatum erforderlich";
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}
