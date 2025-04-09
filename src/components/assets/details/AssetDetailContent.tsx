
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { Asset, AssetHistoryEntry } from "@/lib/types";
import { updateAsset } from "@/data/assets";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import EmployeeSection from "@/components/assets/details/EmployeeSection";
import DocumentSection from "@/components/assets/details/DocumentSection";
import HistorySection from "@/components/assets/details/HistorySection";
import { useAssetDocuments } from "@/hooks/useAssetDocuments";

interface AssetDetailContentProps {
  asset: Asset;
  assetHistory: AssetHistoryEntry[];
  isHistoryLoading: boolean;
  queryClient: QueryClient;
  toast: any;
}

export default function AssetDetailContent({
  asset,
  assetHistory,
  isHistoryLoading,
  queryClient,
  toast
}: AssetDetailContentProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const { 
    documents, 
    addDocument, 
    deleteDocument 
  } = useAssetDocuments(asset.id, toast);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('assets').delete().eq('id', asset.id);
      
      if (error) {
        console.error("Delete error:", error);
        toast({
          variant: "destructive",
          title: "Fehler beim Löschen",
          description: error.message
        });
        return;
      }
      
      queryClient.invalidateQueries({
        queryKey: ["assets"]
      });
      
      toast({
        title: "Asset gelöscht",
        description: `Das Asset wurde erfolgreich gelöscht.`
      });
      
      navigate("/assets");
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: err.message || "Ein unbekannter Fehler ist aufgetreten."
      });
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (!asset) return;
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
        additionalWarranty: formData.additionalWarranty || false,
        imageUrl: formData.imageUrl || null
      };
      
      await updateAsset(updatedAsset);
      
      queryClient.invalidateQueries({
        queryKey: ["asset", asset.id]
      });
      queryClient.invalidateQueries({
        queryKey: ["assets"]
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

  return (
    <>
      <Card className="shadow-sm">
        {isEditing ? (
          <CardContent className="p-6">
            <AssetDetailEdit 
              asset={asset} 
              onSave={handleSave} 
              onCancel={handleCancelEdit} 
            />
          </CardContent>
        ) : (
          <CardContent className="p-6">
            <AssetDetailView 
              asset={asset} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </CardContent>
        )}
      </Card>

      {!isEditing && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
