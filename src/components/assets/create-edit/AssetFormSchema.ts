
import { z } from "zod";
import { AssetType, AssetStatus } from "@/lib/types";

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
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;
