
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { Asset, AssetHistoryEntry } from "@/lib/types";
import QRCode from "@/components/shared/QRCode";
import { motion } from "framer-motion";
import { formatCurrency, formatDate, calculateAgeInMonths } from "@/lib/utils";
import { ChevronLeft, CalendarClock, Euro, Tag, User, History, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import DocumentUpload, { Document } from "@/components/assets/DocumentUpload";
import { getAssetById, getAssetHistoryByAssetId, updateAsset, deleteAsset } from "@/services/assetService";
import { getEmployeeById } from "@/services/employeeService";
import { getDocumentsByAssetId, uploadDocument, deleteDocument } from "@/services/documentService";

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch asset data
  const {
    data: asset,
    isLoading: assetLoading,
    error: assetError
  } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => id ? getAssetById(id) : null,
    enabled: !!id
  });
  
  // Fetch employee data if asset is assigned
  const {
    data: employee,
    isLoading: employeeLoading
  } = useQuery({
    queryKey: ['employee', asset?.employeeId],
    queryFn: () => asset?.employeeId ? getEmployeeById(asset.employeeId) : null,
    enabled: !!asset?.employeeId
  });
  
  // Fetch asset history
  const {
    data: history = [],
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['assetHistory', id],
    queryFn: () => id ? getAssetHistoryByAssetId(id) : [],
    enabled: !!id
  });
  
  // Fetch documents
  const {
    data: documents = [],
    isLoading: documentsLoading
  } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => id ? getDocumentsByAssetId(id) : [],
    enabled: !!id
  });
  
  // Mutation for updating an asset
  const updateAssetMutation = useMutation({
    mutationFn: (data: Partial<Asset>) => {
      if (!id) throw new Error("Asset ID is required");
      return updateAsset(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['asset', id]
      });
      setIsEditing(false);
      toast({
        title: "Asset aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert."
      });
    },
    onError: (error) => {
      console.error("Error updating asset:", error);
      toast({
        title: "Fehler",
        description: "Das Asset konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for deleting an asset
  const deleteAssetMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Asset ID is required");
      return deleteAsset(id);
    },
    onSuccess: () => {
      toast({
        title: "Asset gelöscht",
        description: "Das Asset wurde erfolgreich gelöscht."
      });
      navigate("/assets");
    },
    onError: (error) => {
      console.error("Error deleting asset:", error);
      toast({
        title: "Fehler",
        description: "Das Asset konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for uploading a document
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, category }: { file: File, category: Document['category'] }) => {
      if (!id) throw new Error("Asset ID is required");
      return uploadDocument(file, id, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', id]
      });
      toast({
        title: "Dokument hochgeladen",
        description: "Das Dokument wurde erfolgreich hochgeladen."
      });
    },
    onError: (error) => {
      console.error("Error uploading document:", error);
      toast({
        title: "Fehler",
        description: "Das Dokument konnte nicht hochgeladen werden.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation for deleting a document
  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['documents', id]
      });
      toast({
        title: "Dokument gelöscht",
        description: "Das Dokument wurde erfolgreich gelöscht"
      });
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      toast({
        title: "Fehler",
        description: "Das Dokument konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  });
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = (data: Partial<Asset>) => {
    updateAssetMutation.mutate(data);
  };
  
  const handleDelete = () => {
    deleteAssetMutation.mutate();
  };

  const handleAddDocument = (document: Document) => {
    if (document instanceof File) {
      // This is a new file upload from the DocumentUpload component
      uploadDocumentMutation.mutate({
        file: document as unknown as File,
        category: 'other' // Default category
      });
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    deleteDocumentMutation.mutate(documentId);
  };
  
  const isLoading = assetLoading || employeeLoading || historyLoading || documentsLoading;
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 md:ml-64 p-8 flex items-center justify-center">
          <div className="animate-pulse-soft">Loading asset details...</div>
        </div>
      </div>
    );
  }
  
  if (assetError || !asset) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 md:ml-32 p-3 md:p-4 xl:p-6 space-y-6 max-w-full">
          <div className="glass-card p-12 text-center">
            <h2 className="text-xl font-medium mb-4">Asset not found</h2>
            <p className="text-muted-foreground mb-6">
              The asset you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/assets"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Back to assets
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const renderAdditionalFields = () => {
    if (isEditing) return null;
    
    switch (asset.type) {
      case "laptop":
        return (
          <>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-medium">{asset.serialNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventory Number</p>
              <p className="font-medium">{asset.inventoryNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Additional Warranty</p>
              <p className="font-medium">{asset.additionalWarranty ? "Yes" : "No"}</p>
            </div>
          </>
        );
      case "smartphone":
        return (
          <>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serial Number</p>
              <p className="font-medium">{asset.serialNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventory Number</p>
              <p className="font-medium">{asset.inventoryNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IMEI</p>
              <p className="font-medium">{asset.imei || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{asset.phoneNumber || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="font-medium">{asset.provider || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract</p>
              <p className="font-medium">{asset.contractName || "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract End Date</p>
              <p className="font-medium">
                {asset.contractEndDate ? formatDate(asset.contractEndDate) : "—"}
              </p>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventory Number</p>
              <p className="font-medium">{asset.inventoryNumber || "—"}</p>
            </div>
          </>
        );
    }
  };

  return (
    <PageTransition>
      <div className="p-3 md:p-4 xl:p-6 space-y-6 max-w-full pb-24 mt-12 md:mt-0">
        <div className="mb-6">
          <Link 
            to="/assets"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Back to assets</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6 mb-6">
              {isEditing ? (
                <AssetDetailEdit
                  asset={asset}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <AssetDetailView
                  asset={asset}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
            
            {!isEditing && (
              <>
                <div className="glass-card p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {renderAdditionalFields()}
                  </div>
                </div>
                
                <div className="glass-card p-6 mb-6">
                  <DocumentUpload
                    assetId={asset.id}
                    documents={documents}
                    onAddDocument={handleAddDocument}
                    onDeleteDocument={handleDeleteDocument}
                  />
                </div>
              </>
            )}
            
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <History size={18} />
                <h2 className="text-lg font-semibold">History</h2>
              </div>
              
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <motion.div 
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          {entry.action === "purchase" && <Euro size={16} />}
                          {entry.action === "assign" && <User size={16} />}
                          {entry.action === "status_change" && <Tag size={16} />}
                          {entry.action === "return" && <ArrowRight size={16} />}
                        </div>
                        {index < history.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2"></div>
                        )}
                      </div>
                      
                      <div className="pb-6">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {entry.action === "purchase" && "Purchased"}
                            {entry.action === "assign" && "Assigned"}
                            {entry.action === "status_change" && "Status changed"}
                            {entry.action === "return" && "Returned"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{entry.notes}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No history available for this asset.
                </p>
              )}
            </div>
          </div>
          
          <div>
            <div className="glass-card p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Asset QR Code</h2>
              <div className="flex justify-center">
                <QRCode 
                  value={window.location.href}
                  size={180}
                  title="Scan to view asset details"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Scan this QR code to access asset details quickly
              </p>
            </div>
            
            {employee && (
              <div className="glass-card p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Zugewiesen an</h3>
                <Link 
                  to={`/employee/${employee.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <img 
                      src={employee.imageUrl} 
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://avatar.vercel.sh/' + employee.id;
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {employee.position} • {employee.cluster}
                    </p>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AssetDetail;
