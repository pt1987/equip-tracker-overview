
import { Asset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useComplianceData } from "./compliance/useComplianceData";
import ComplianceForm from "./compliance/ComplianceForm";
import ComplianceDisplay from "./compliance/ComplianceDisplay";

interface ComplianceSectionProps {
  asset: Asset;
  onAssetUpdate: (updatedAsset: Asset) => void;
}

export default function ComplianceSection({ asset, onAssetUpdate }: ComplianceSectionProps) {
  const {
    formData,
    isEditing,
    employees,
    handleChange,
    handleSave,
    setIsEditing,
    getOwnerName
  } = useComplianceData(asset, onAssetUpdate);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">ISO 27001 Compliance</CardTitle>
          <CardDescription>
            Asset-Klassifikation und Compliance-Informationen
          </CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Bearbeiten
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Abbrechen
            </Button>
            <Button size="sm" onClick={handleSave}>
              Speichern
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <ComplianceForm 
            formData={formData}
            employees={employees}
            handleChange={handleChange}
          />
        ) : (
          <ComplianceDisplay 
            asset={asset}
            getOwnerName={getOwnerName}
          />
        )}
      </CardContent>
    </Card>
  );
}
