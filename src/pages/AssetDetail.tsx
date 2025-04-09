
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import { getAssetById, updateAsset, getAssetHistoryByAssetId } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Download, FileText, AlertCircle, Share } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload, { Document } from "@/components/assets/DocumentUpload";
import AssetHistoryTimeline from "@/components/assets/AssetHistoryTimeline";
import { supabase } from "@/integrations/supabase/client";

export default function AssetDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
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
      
      console.log("Saving updated asset:", updatedAsset);
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

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
    
    toast({
      title: "Dokument gelöscht",
      description: "Das Dokument wurde erfolgreich gelöscht."
    });
  };

  if (isAssetLoading) {
    return <PageTransition>
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </PageTransition>;
  }

  if (assetError || !asset) {
    return <PageTransition>
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex flex-col items-center justify-center text-center py-10">
            <AlertCircle size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Asset nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">
              Das angeforderte Asset konnte nicht gefunden werden.
            </p>
            <Button onClick={() => navigate("/assets")}>
              <ChevronLeft size={16} className="mr-2" />
              Zurück zur Übersicht
            </Button>
          </div>
        </div>
      </PageTransition>;
  }

  return <PageTransition>
      <div className="container mx-auto py-4 max-w-7xl px-[68px]">
        <div className="flex flex-col gap-6">
          <div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1 -ml-3 h-9 px-2">
              <ChevronLeft size={16} className="mr-1" />
              Zurück
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Asset Details</h1>
          </div>

          <div>
            {isEditing ? (
              <AssetDetailEdit asset={asset} onSave={handleSave} onCancel={handleCancelEdit} />
            ) : (
              <AssetDetailView asset={asset} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>

          {!isEditing && (
            <>
              <div className="document-section">
                {asset && !isEditing && (
                  <DocumentUpload 
                    assetId={asset.id} 
                    documents={documents} 
                    onAddDocument={handleAddDocument} 
                    onDeleteDocument={handleDeleteDocument} 
                  />
                )}
              </div>

              <div className="timeline-section">
                {!isHistoryLoading ? (
                  assetHistory.length > 0 ? (
                    <AssetHistoryTimeline history={assetHistory} />
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-muted-foreground">Keine Historieneinträge vorhanden.</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-2 py-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>;
}
