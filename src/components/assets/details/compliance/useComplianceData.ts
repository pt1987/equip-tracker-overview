
import { useState } from "react";
import { Asset, AssetClassification, Employee } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/data/employees";
import { updateAsset } from "@/data/assets";
import { useToast } from "@/hooks/use-toast";

export function useComplianceData(asset: Asset, onAssetUpdate: (updatedAsset: Asset) => void) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    classification: asset.classification || 'internal',
    assetOwnerId: asset.assetOwnerId || 'not_assigned',
    riskLevel: asset.riskLevel || 'low',
    isPersonalData: asset.isPersonalData || false,
    lastReviewDate: asset.lastReviewDate || '',
    nextReviewDate: asset.nextReviewDate || '',
    lifecycleStage: asset.lifecycleStage || 'operation',
    disposalMethod: asset.disposalMethod || '',
    notes: asset.notes || '',
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getOwnerName = (ownerId: string | undefined) => {
    if (!ownerId) return "Nicht zugewiesen";
    const owner = employees.find(emp => emp.id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : "Unbekannt";
  };

  const handleSave = async () => {
    try {
      const updatedAsset = {
        ...asset,
        classification: formData.classification as AssetClassification,
        assetOwnerId: formData.assetOwnerId === 'not_assigned' ? '' : formData.assetOwnerId,
        riskLevel: formData.riskLevel as 'low' | 'medium' | 'high',
        isPersonalData: formData.isPersonalData,
        lastReviewDate: formData.lastReviewDate,
        nextReviewDate: formData.nextReviewDate,
        lifecycleStage: formData.lifecycleStage as 'procurement' | 'operation' | 'maintenance' | 'disposal',
        disposalMethod: formData.disposalMethod,
        notes: formData.notes,
      };

      await updateAsset(updatedAsset);
      onAssetUpdate(updatedAsset);
      setIsEditing(false);
      
      toast({
        title: "Compliance-Daten aktualisiert",
        description: "Die ISO 27001 Compliance-Daten wurden erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error("Error updating asset compliance data:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Compliance-Daten konnten nicht gespeichert werden.",
      });
    }
  };

  return {
    formData,
    isEditing,
    employees,
    handleChange,
    handleSave,
    setIsEditing,
    getOwnerName
  };
}
