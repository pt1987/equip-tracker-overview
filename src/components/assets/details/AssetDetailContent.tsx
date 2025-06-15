
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { Asset, AssetHistoryEntry } from "@/lib/types";
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

  const handleSave = async (formData: any) => {
    try {
      setIsSaving(true);
      console.log("=== Asset Save Debug ===");
      console.log("Original asset:", asset);
      console.log("Form data received:", formData);
      
      if (!asset) {
        throw new Error("No asset to update");
      }
      
      // Convert date objects to ISO strings for database storage
      const warrantyExpiryDate = formData.hasWarranty && formData.warrantyExpiryDate 
        ? formData.warrantyExpiryDate.toISOString().split('T')[0] 
        : null;
      
      // Create the updated asset object with all fields properly mapped
      const updatedAsset: Asset = {
        ...asset, // Start with existing asset data to preserve all fields
        name: formData.name,
        manufacturer: formData.manufacturer,
        model: formData.model,
        type: formData.type,
        vendor: formData.vendor,
        status: formData.status,
        purchaseDate: formData.purchaseDate.toISOString().split('T')[0],
        price: formData.price,
        serialNumber: formData.serialNumber || null,
        inventoryNumber: formData.inventoryNumber || null,
        hasWarranty: formData.hasWarranty || false,
        additionalWarranty: formData.additionalWarranty || false,
        warrantyExpiryDate: warrantyExpiryDate,
        warrantyInfo: formData.hasWarranty ? formData.warrantyInfo || null : null,
        imageUrl: formData.imageUrl || null,
        employeeId: formData.employeeId === "not_assigned" ? null : formData.employeeId,
        isPoolDevice: formData.isPoolDevice || false
      };
      
      console.log("Updated asset object to save:", updatedAsset);
      
      // Pass the original asset as the second parameter for change tracking
      const result = await updateAsset(updatedAsset, asset);
      console.log("Update result:", result);
      
      // Force refresh all queries and wait for them to complete
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["asset", asset.id] }),
        queryClient.invalidateQueries({ queryKey: ["assets"] }),
        queryClient.invalidateQueries({ queryKey: ["assetHistory", asset.id] }),
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["employees"] })
      ]);
      
      // Wait a moment for queries to refetch
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("All queries invalidated and refetched");
      
      setIsEditing(false);
      toast({
        title: "Asset erfolgreich aktualisiert",
        description: "Alle Änderungen wurden dauerhaft in der Datenbank gespeichert."
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
