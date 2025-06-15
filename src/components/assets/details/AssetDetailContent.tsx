
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { Asset, AssetHistoryEntry, AssetType, AssetStatus } from "@/lib/types";
import { updateAsset } from "@/data/assets";
import { Card, CardContent } from "@/components/ui/card";
import { getEmployees } from "@/data/employees";
import { useIsMobile } from "@/hooks/use-mobile";

import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import EmployeeSection from "@/components/assets/details/EmployeeSection";
import DocumentSection from "@/components/assets/details/DocumentSection";
import HistorySection from "@/components/assets/details/HistorySection";
import DepreciationSection from "@/components/assets/details/DepreciationSection";
import AssetBookingSection from "@/components/bookings/AssetBookingSection";
import { useAssetDocuments } from "@/hooks/useAssetDocuments";
import { AssetFormValues } from "./AssetFormFields";

interface AssetDetailContentProps {
  asset: Asset;
  assetHistory: AssetHistoryEntry[];
  isHistoryLoading: boolean;
  queryClient: QueryClient;
  toast: any;
  onDelete: () => Promise<void>;
}

export default function AssetDetailContent({
  asset,
  assetHistory,
  isHistoryLoading,
  queryClient,
  toast,
  onDelete
}: AssetDetailContentProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();
  
  const { 
    documents, 
    addDocument, 
    deleteDocument 
  } = useAssetDocuments(asset.id, toast);

  const { data: employees = [] } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async (formData: AssetFormValues) => {
    try {
      setIsSaving(true);
      console.log("=== Asset Save Debug ===");
      console.log("Original asset:", asset);
      console.log("Form data received:", formData);
      
      if (!asset) {
        throw new Error("No asset to update");
      }
      
      // Create the updated asset object with proper type casting
      const updatedAsset: Asset = {
        ...asset, // Keep all existing fields
        name: formData.name,
        manufacturer: formData.manufacturer,
        model: formData.model,
        type: formData.type as AssetType,
        vendor: formData.vendor,
        status: formData.status as AssetStatus,
        purchaseDate: formData.purchaseDate.toISOString().split('T')[0],
        price: formData.price,
        serialNumber: formData.serialNumber || null,
        inventoryNumber: formData.inventoryNumber || null,
        hasWarranty: formData.hasWarranty || false,
        additionalWarranty: formData.additionalWarranty || false,
        warrantyExpiryDate: formData.hasWarranty && formData.warrantyExpiryDate 
          ? formData.warrantyExpiryDate.toISOString().split('T')[0] 
          : null,
        warrantyInfo: formData.hasWarranty ? formData.warrantyInfo || null : null,
        imageUrl: formData.imageUrl || null,
        employeeId: formData.employeeId || null,
        isPoolDevice: formData.isPoolDevice || false
      };
      
      console.log("Updated asset object to save:", updatedAsset);
      
      // Save the asset
      const result = await updateAsset(updatedAsset, asset);
      console.log("Update result:", result);
      
      // Invalidate and refetch all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["asset", asset.id] }),
        queryClient.invalidateQueries({ queryKey: ["assets"] }),
        queryClient.invalidateQueries({ queryKey: ["assetHistory", asset.id] }),
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["employees"] })
      ]);
      
      // Force a refetch to ensure we have the latest data
      await queryClient.refetchQueries({ queryKey: ["asset", asset.id] });
      
      setIsEditing(false);
      toast({
        title: "Asset erfolgreich aktualisiert",
        description: "Alle Änderungen wurden gespeichert und sind in der Datenbank verfügbar."
      });
      
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: error instanceof Error ? error.message : "Die Änderungen konnten nicht gespeichert werden."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const refetchAsset = () => {
    queryClient.invalidateQueries({
      queryKey: ["asset", asset.id]
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Card className="shadow-sm">
        {isEditing ? (
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <AssetDetailEdit 
              asset={asset} 
              onSave={handleSave} 
              onCancel={handleCancelEdit} 
              disabled={isSaving}
            />
          </CardContent>
        ) : (
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <AssetDetailView 
              asset={asset} 
              onEdit={handleEdit} 
              onDelete={onDelete} 
            />
          </CardContent>
        )}
      </Card>

      {!isEditing && (
        <>
          {(asset.isPoolDevice || asset.status === 'pool') && (
            <AssetBookingSection 
              asset={asset}
              employees={employees}
              refetchAsset={refetchAsset}
            />
          )}

          <DepreciationSection asset={asset} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <EmployeeSection employeeId={asset.employeeId} />
            <DocumentSection 
              assetId={asset.id}
              documents={documents}
              onAddDocument={addDocument}
              onDeleteDocument={deleteDocument}
            />
          </div>

          <HistorySection 
            assetHistory={assetHistory}
            isHistoryLoading={isHistoryLoading}
          />
        </>
      )}
    </div>
  );
}
