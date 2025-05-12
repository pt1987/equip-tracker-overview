
import { z } from "zod";

// Types for the compliance form
export type ComplianceFormProps = {
  // This component doesn't need props as it gets everything from react-hook-form context
};

// Schema validation can be extended here if needed
export const complianceFormSchema = z.object({
  classification: z.string().optional(),
  assetOwnerId: z.string().optional(),
  riskLevel: z.string().optional(),
  isPersonalData: z.boolean().optional(),
  lastReviewDate: z.string().optional(),
  nextReviewDate: z.string().optional(),
  lifecycleStage: z.string().optional(),
  disposalMethod: z.string().optional(),
  notes: z.string().optional(),
});

// Constants for dropdown options
export const LIFECYCLE_STAGES = [
  { value: "procurement", label: "Beschaffung" },
  { value: "operation", label: "Betrieb" },
  { value: "maintenance", label: "Wartung" },
  { value: "disposal", label: "Entsorgung" },
];

export const CLASSIFICATION_LEVELS = [
  { value: "public", label: "Öffentlich" },
  { value: "internal", label: "Intern" },
  { value: "confidential", label: "Vertraulich" },
  { value: "restricted", label: "Streng vertraulich" },
];

export const RISK_LEVELS = [
  { value: "low", label: "Niedrig" },
  { value: "medium", label: "Mittel" },
  { value: "high", label: "Hoch" },
];
