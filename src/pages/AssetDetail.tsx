
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import { getAssetById, updateAsset, getAssetHistoryByAssetId } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ChevronLeft, User } from "lucide-react";
import { Asset } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload, { Document } from "@/components/assets/DocumentUpload";
import AssetHistoryTimeline from "@/components/assets/AssetHistoryTimeline";
import { supabase } from "@/integrations/supabase/client";
import { getEmployeeById } from "@/data/employees";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function AssetDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();
  const [employeeData, setEmployeeData] = useState<any | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  // Asset data fetching
  const {
    data: asset,
    isLoading: isAssetLoading,
    error: assetError
  } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAssetById(id),
    enabled: !!id
  });

  // Asset history fetching
  const {
    data: assetHistory = [],
    isLoading: isHistoryLoading
  } = useQuery({
    queryKey: ["assetHistory", id],
    queryFn: () => getAssetHistoryByAssetId(id),
    enabled: !!id
  });

  // Fetch employee data when asset.employeeId changes
  useEffect(() => {
    const fetchEmployee = async () => {
      if (asset?.employeeId) {
        setIsLoadingEmployee(true);
        try {
          const employee = await getEmployeeById(asset.employeeId);
          setEmployeeData(employee);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoadingEmployee(false);
        }
      }
    };
    
    if (asset?.employeeId) {
      fetchEmployee();
    }
  }, [asset?.employeeId]);

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
                {/* Employee Section */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Zugewiesener Mitarbeiter</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {asset.employeeId ? (
                      <>
                        {isLoadingEmployee ? (
                          <div className="flex justify-center py-4 w-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : employeeData ? (
                          <div className="flex items-center gap-5">
                            <Avatar className="h-14 w-14">
                              <AvatarImage src={employeeData.imageUrl || `https://avatar.vercel.sh/${employeeData.id}`} alt={`${employeeData.firstName} ${employeeData.lastName}`} />
                              <AvatarFallback>
                                {employeeData.firstName?.[0]}{employeeData.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link to={`/employee/${employeeData.id}`} className="text-lg font-medium hover:underline">
                                {employeeData.firstName} {employeeData.lastName}
                              </Link>
                              <p className="text-sm text-muted-foreground">{employeeData.position}</p>
                              <p className="text-sm text-muted-foreground">{employeeData.cluster}</p>
                              <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                                <Link to={`/employee/${employeeData.id}`}>
                                  Details anzeigen
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4">
                            <p>Mitarbeiterdaten konnten nicht geladen werden.</p>
                            <p className="text-sm text-muted-foreground">ID: {asset.employeeId}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-2 flex items-center gap-3">
                        <User size={20} className="text-muted-foreground opacity-70" />
                        <p className="text-muted-foreground">
                          Dieses Asset ist keinem Mitarbeiter zugewiesen.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Document Section */}
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Dokumente</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <DocumentUpload 
                      assetId={asset.id} 
                      documents={documents} 
                      onAddDocument={handleAddDocument} 
                      onDeleteDocument={handleDeleteDocument} 
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Asset History Section */}
              <Card className="shadow-sm mt-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Asset Historie</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {!isHistoryLoading ? (
                    <AssetHistoryTimeline history={assetHistory} />
                  ) : (
                    <div className="space-y-2 py-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
