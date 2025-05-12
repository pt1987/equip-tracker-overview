
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
import AssetBookingSection from "@/components/assets/AssetBookingSection";
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
      if (!asset) return;
      
      // Convert date objects to ISO strings for database storage
      const warrantyExpiryDate = formData.hasWarranty && formData.warrantyExpiryDate 
        ? formData.warrantyExpiryDate.toISOString().split('T')[0] 
        : null;
      
      const updatedAsset: Asset = {
        ...asset,
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
        employeeId: formData.employeeId || null,
        isPoolDevice: formData.isPoolDevice || false
      };
      
      await updateAsset(updatedAsset);
      
      queryClient.invalidateQueries({
        queryKey: ["asset", asset.id]
      });
      queryClient.invalidateQueries({
        queryKey: ["assets"]
      });
      queryClient.invalidateQueries({
        queryKey: ["assetHistory", asset.id]
      });
      
      setIsEditing(false);
      toast({
        title: "Asset aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert."
      });
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Änderungen konnten nicht gespeichert werden."
      });
    }
  };

  const refetchAsset = () => {
    queryClient.invalidateQueries({
      queryKey: ["asset", asset.id]
    });
  };

  return (
    <>
      <Card className="shadow-sm">
        {isEditing ? (
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
            <AssetDetailEdit 
              asset={asset} 
              onSave={handleSave} 
              onCancel={handleCancelEdit} 
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
          {/* Immer die Buchungssektion für Pool-Geräte anzeigen oder wenn asset.status === 'pool' */}
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
    </>
  );
}
