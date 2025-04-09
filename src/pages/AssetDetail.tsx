import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import { getAssetById, updateAsset, getAssetHistoryByAssetId } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/components/documents/types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

import AssetLoading from "@/components/assets/details/AssetLoading";
import AssetNotFound from "@/components/assets/details/AssetNotFound";
import EmployeeSection from "@/components/assets/details/EmployeeSection";
import DocumentSection from "@/components/assets/details/DocumentSection";
import HistorySection from "@/components/assets/details/HistorySection";

export default function AssetDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  const {
    data: asset,
    isLoading: isAssetLoading,
    error: assetError
  } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAssetById(id),
    enabled: !!id
  });

  const {
    data: assetHistory = [],
    isLoading: isHistoryLoading
  } = useQuery({
    queryKey: ["assetHistory", id],
    queryFn: () => getAssetHistoryByAssetId(id),
    enabled: !!id
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('assets').delete().eq('id', id);
      if (error) {
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
        queryKey: ["asset", id]
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

  const handleAddDocument = (document: Document) => {
    setDocuments([...documents, document]);
    
    toast({
      title: "Dokument hinzugefügt",
      description: `${document.name} wurde erfolgreich hinzugefügt.`
    });
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { deleteDocument } = useDocumentStorage({
        assetId: id,
        documents,
        onAddDocument: handleAddDocument,
        toast
      });
      
      await deleteDocument(documentId);
      
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Dokument gelöscht",
        description: "Das Dokument wurde erfolgreich gelöscht."
      });
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: error.message || "Ein Fehler ist aufgetreten beim Löschen des Dokuments."
      });
    }
  };

  if (isAssetLoading) {
    return (
      <PageTransition>
        <AssetLoading />
      </PageTransition>
    );
  }

  if (assetError || !asset) {
    return (
      <PageTransition>
        <AssetNotFound />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8 max-w-7xl px-6">
        <div className="flex flex-col gap-6">
          <div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1 -ml-3 h-9 px-2">
              <ChevronLeft size={16} className="mr-1" />
              Zurück
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Asset Details</h1>
          </div>

          <Card className="shadow-sm">
            {isEditing ? (
              <CardContent className="p-6">
                <AssetDetailEdit asset={asset} onSave={handleSave} onCancel={handleCancelEdit} />
              </CardContent>
            ) : (
              <CardContent className="p-6">
                <AssetDetailView asset={asset} onEdit={handleEdit} onDelete={handleDelete} />
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
                  onAddDocument={handleAddDocument}
                  onDeleteDocument={handleDeleteDocument}
                />
              </div>

              <HistorySection 
                assetHistory={assetHistory}
                isHistoryLoading={isHistoryLoading}
              />
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
