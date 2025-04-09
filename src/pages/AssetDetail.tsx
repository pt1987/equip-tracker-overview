
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import { getAssetById, updateAsset, getAssetHistoryByAssetId } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload, { Document } from "@/components/assets/DocumentUpload";
import AssetHistoryTimeline from "@/components/assets/AssetHistoryTimeline";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

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

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            {isEditing ? (
              <div className="p-6">
                <AssetDetailEdit asset={asset} onSave={handleSave} onCancel={handleCancelEdit} />
              </div>
            ) : (
              <div className="p-6">
                <AssetDetailView asset={asset} onEdit={handleEdit} onDelete={handleDelete} />
              </div>
            )}
          </div>

          {!isEditing && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Technical Details Section */}
                <section className="bg-card rounded-xl border shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-medium">Technische Details</h2>
                    <Separator className="flex-grow" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {asset.serialNumber && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Seriennummer</p>
                        <p className="font-medium tracking-wide border-b pb-1 border-border/30">{asset.serialNumber}</p>
                      </div>
                    )}
                    
                    {asset.inventoryNumber && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Inventar-Nr.</p>
                        <p className="font-medium border-b pb-1 border-border/30">{asset.inventoryNumber}</p>
                      </div>
                    )}
                    
                    {asset.imei && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">IMEI</p>
                        <p className="font-medium border-b pb-1 border-border/30">{asset.imei}</p>
                      </div>
                    )}
                    
                    {asset.hasWarranty !== undefined && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Garantie</p>
                        <p className="font-medium border-b pb-1 border-border/30">
                          {asset.hasWarranty ? "Ja" : "Nein"}
                          {asset.additionalWarranty && ", erweitert"}
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-6">
                  {/* Employee Section */}
                  <section className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-medium">Zugewiesener Mitarbeiter</h2>
                      <Separator className="flex-grow" />
                    </div>
                    {asset.employeeId ? (
                      <div className="employee-content">
                        {/* Employee component from AssetDetailView will render here */}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-muted-foreground">
                        <p>Kein Mitarbeiter zugewiesen</p>
                      </div>
                    )}
                  </section>

                  {/* Document Section */}
                  <section className="bg-card rounded-xl border shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-xl font-medium">Dokumente</h2>
                      <Separator className="flex-grow" />
                    </div>
                    <DocumentUpload 
                      assetId={asset.id} 
                      documents={documents} 
                      onAddDocument={handleAddDocument} 
                      onDeleteDocument={handleDeleteDocument} 
                    />
                  </section>
                </div>
              </div>

              {/* Asset History Section */}
              <section className="bg-card rounded-xl border shadow-sm p-6 mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-medium">Asset Historie</h2>
                  <Separator className="flex-grow" />
                </div>
                {!isHistoryLoading ? (
                  <AssetHistoryTimeline history={assetHistory} />
                ) : (
                  <div className="space-y-2 py-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
