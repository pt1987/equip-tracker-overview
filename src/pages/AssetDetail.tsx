
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import { getAssetById, updateAsset, getAssetHistoryByAssetId } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  Download,
  FileText,
  AlertCircle,
  Share,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload, { Document } from "@/components/assets/DocumentUpload";
import AssetHistoryTimeline from "@/components/assets/AssetHistoryTimeline";

export default function AssetDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();
  
  const {
    data: asset,
    isLoading: isAssetLoading,
    error: assetError,
  } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
  });

  const {
    data: assetHistory = [],
    isLoading: isHistoryLoading,
  } = useQuery({
    queryKey: ["assetHistory", id],
    queryFn: () => getAssetHistoryByAssetId(id),
    enabled: !!id,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    queryClient.invalidateQueries({ queryKey: ["assets"] });
    navigate("/assets");
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
        imageUrl: formData.imageUrl || null,
      };
      
      console.log("Saving updated asset:", updatedAsset);
      
      await updateAsset(updatedAsset);
      
      queryClient.invalidateQueries({ queryKey: ["asset", id] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      
      setIsEditing(false);
      
      toast({
        title: "Asset aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: "Die Änderungen konnten nicht gespeichert werden.",
      });
    }
  };

  const handleAddDocument = (document: Document) => {
    setDocuments([...documents, document]);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
  };

  if (isAssetLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </PageTransition>
    );
  }

  if (assetError || !asset) {
    return (
      <PageTransition>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center text-center py-12">
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
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-2 -ml-3 h-9 px-2"
              >
                <ChevronLeft size={16} className="mr-1" />
                Zurück
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Asset Details</h1>
              <p className="text-muted-foreground">
                Vollständige Informationen und Historie des ausgewählten Assets
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => {}}>
                <FileText className="mr-1.5 h-4 w-4" />
                Report
              </Button>
              <Button variant="outline" size="sm" onClick={() => {}}>
                <Download className="mr-1.5 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => {}}>
                <Share className="mr-1.5 h-4 w-4" />
                Teilen
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {isEditing ? (
                <AssetDetailEdit
                  asset={asset}
                  onSave={handleSave}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <AssetDetailView
                  asset={asset}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Dokumente
              </CardTitle>
              <CardDescription>
                Verwalten Sie alle mit diesem Asset verbundenen Dokumente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUpload
                assetId={asset.id}
                documents={documents}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Asset Historie
              </CardTitle>
              <CardDescription>Chronologische Aufzeichnung aller Änderungen und Ereignisse</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isHistoryLoading ? (
                <div className="space-y-2 py-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : assetHistory.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Keine Historieneinträge vorhanden.</p>
                </div>
              ) : (
                <AssetHistoryTimeline history={assetHistory} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
