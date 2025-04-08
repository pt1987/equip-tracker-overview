
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  Download,
  Share,
  FileText,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function AssetDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  // Fetch asset details
  const {
    data: asset,
    isLoading: isAssetLoading,
    error: assetError,
  } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAssetById(id),
    enabled: !!id,
  });

  // Fetch asset history
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
    // After successful deletion, navigate back
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
      
      // Update in database
      await updateAsset(updatedAsset);
      
      // Update cache and UI
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
            <CardHeader className="pb-0">
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>Grundlegende und technische Details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
            <CardHeader>
              <CardTitle>Asset Historie</CardTitle>
              <CardDescription>Chronologische Aufzeichnung aller Änderungen und Ereignisse</CardDescription>
            </CardHeader>
            <CardContent>
              {isHistoryLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : assetHistory.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Keine Historieneinträge vorhanden.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Aktion</TableHead>
                        <TableHead>Mitarbeiter</TableHead>
                        <TableHead>Notiz</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assetHistory.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{formatDate(entry.date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="capitalize">
                                {entry.action === "purchase" && "Kauf"}
                                {entry.action === "assign" && "Zugewiesen"}
                                {entry.action === "status_change" && "Status geändert"}
                                {entry.action === "return" && "Zurückgegeben"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {entry.employeeId ? entry.employeeId : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {entry.notes || "-"}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
