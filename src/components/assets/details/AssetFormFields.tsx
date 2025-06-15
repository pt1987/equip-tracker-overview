
import { z } from "zod";
import BasicInfoSection from "./sections/BasicInfoSection";
import PurchaseInfoSection from "./sections/PurchaseInfoSection";
import TechnicalInfoSection from "./sections/TechnicalInfoSection";
import EmployeeAssignmentSection from "./sections/EmployeeAssignmentSection";
import PoolDeviceSection from "./sections/PoolDeviceSection";
import WarrantySection from "./sections/WarrantySection";

export const assetFormSchema = z.object({
  name: z.string().min(1, "Name ist erforderlich"),
  manufacturer: z.string().min(1, "Hersteller ist erforderlich"),
  model: z.string().min(1, "Modell ist erforderlich"),
  type: z.string().min(1, "Asset-Typ ist erforderlich"),
  vendor: z.string().min(1, "Verkäufer ist erforderlich"),
  status: z.string().min(1, "Status ist erforderlich"),
  purchaseDate: z.date({ required_error: "Kaufdatum ist erforderlich" }),
  price: z.number().nonnegative("Preis darf nicht negativ sein"),
  serialNumber: z.string().optional(),
  inventoryNumber: z.string().optional(),
  hasWarranty: z.boolean().default(false),
  additionalWarranty: z.boolean().default(false),
  warrantyExpiryDate: z.date().nullable().optional(),
  warrantyInfo: z.string().optional(),
  imageUrl: z.string().optional(),
  employeeId: z.string().nullable().optional(),
  isPoolDevice: z.boolean().default(false),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export default function AssetFormFields() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Asset-Informationen</h3>
        <BasicInfoSection />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Kaufinformationen</h3>
        <PurchaseInfoSection />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Technische Details</h3>
        <TechnicalInfoSection />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Zuweisung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmployeeAssignmentSection />
          <div className="flex items-center">
            <PoolDeviceSection />
          </div>
        </div>
      </div>

      <WarrantySection />
    </div>
  );
}
