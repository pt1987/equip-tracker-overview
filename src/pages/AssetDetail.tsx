
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageTransition from "@/components/layout/PageTransition";
import { getAssetById, getAssetHistoryByAssetId, deleteAsset } from "@/services/assetService";
import { getEmployeeById } from "@/services/employeeService";
import { Asset, Employee, AssetHistoryEntry } from "@/lib/types";
import { uploadDocument, getDocumentsByAssetId, deleteDocument } from "@/services/documentService";
import AssetDetailView from "@/components/assets/AssetDetailView";
import AssetDetailEdit from "@/components/assets/AssetDetailEdit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  HistoryIcon,
  User,
  FileText,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DocumentUpload, { Document } from "@/components/assets/DocumentUpload";

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const queryClient = useQueryClient();

  // Fetch asset data
  const { 
    data: asset, 
    isLoading: assetLoading, 
    error: assetError 
  } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => id ? getAssetById(id) : Promise.resolve(null),
  });

  // Fetch asset history
  const { 
    data: assetHistory = [], 
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['assetHistory', id],
    queryFn: () => id ? getAssetHistoryByAssetId(id) : Promise.resolve([]),
    enabled: !!id,
  });

  // Fetch employee data if asset is assigned
  const { 
    data: employee, 
    isLoading: employeeLoading 
  } = useQuery({
    queryKey: ['employee', asset?.employeeId],
    queryFn: () => asset?.employeeId ? getEmployeeById(asset.employeeId) : Promise.resolve(null),
    enabled: !!asset?.employeeId,
  });

  // Fetch documents
  const { 
    data: documents = [], 
    isLoading: documentsLoading,
    refetch: refetchDocuments
  } = useQuery({
    queryKey: ['documents', id],
    queryFn: () => id ? getDocumentsByAssetId(id) : Promise.resolve([]),
    enabled: !!id,
  });

  // Delete asset mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      toast({
        title: "Asset deleted",
        description: "The asset has been successfully deleted."
      });
      navigate('/assets');
    },
    onError: (error) => {
      toast({
        title: "Error deleting asset",
        description: `There was an error deleting the asset: ${error}`,
        variant: "destructive"
      });
    }
  });

  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: ({ file, assetId, category }: { file: File, assetId: string, category: Document['category'] }) => 
      uploadDocument(file, assetId, category),
    onSuccess: () => {
      toast({
        title: "Document uploaded",
        description: "The document has been successfully uploaded."
      });
      refetchDocuments();
    },
    onError: (error) => {
      toast({
        title: "Error uploading document",
        description: `There was an error uploading the document: ${error}`,
        variant: "destructive"
      });
    }
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted."
      });
      refetchDocuments();
    },
    onError: (error) => {
      toast({
        title: "Error deleting document",
        description: `There was an error deleting the document: ${error}`,
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

  const handleSave = async (updatedAsset: Asset) => {
    try {
      // Update asset logic happens in the AssetDetailEdit component
      setIsEditing(false);
      
      toast({
        title: "Asset updated",
        description: "The asset has been successfully updated."
      });
      
      // Refetch the asset data to show the updated values
      queryClient.invalidateQueries({ queryKey: ['asset', id] });
    } catch (error) {
      toast({
        title: "Error updating asset",
        description: `There was an error updating the asset: ${error}`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddDocument = (documentOrFile: Document | File) => {
    if (id) {
      if ('size' in documentOrFile && documentOrFile instanceof File) {
        uploadDocumentMutation.mutate({
          file: documentOrFile,
          assetId: id,
          // We get the category from the upload component
          category: 'other' // This gets overridden in the component
        });
      }
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    deleteDocumentMutation.mutate(documentId);
  };

  if (assetLoading) {
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
        <div className="flex-1 md:ml-64 p-8 flex flex-col items-center justify-center">
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
    );
  }

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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2 md:mb-0">{asset.name}</h1>
            <TabsList className="h-9">
              <TabsTrigger value="details" className="flex items-center gap-1.5">
                <Settings size={15} />
                <span>Details</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1.5">
                <FileText size={15} />
                <span>Documents</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1.5">
                <HistoryIcon size={15} />
                <span>History</span>
              </TabsTrigger>
              {asset.employeeId && (
                <TabsTrigger value="employee" className="flex items-center gap-1.5">
                  <User size={15} />
                  <span>Assignment</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="details" className="m-0">
            <div className="glass-card p-6">
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
          </TabsContent>
          
          <TabsContent value="documents" className="m-0">
            <div className="glass-card p-6">
              <DocumentUpload 
                assetId={asset.id}
                documents={documents}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="m-0">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Asset History</h2>
              
              {historyLoading ? (
                <div className="text-center py-6">
                  <div className="animate-pulse-soft">Loading history...</div>
                </div>
              ) : assetHistory.length > 0 ? (
                <div className="space-y-4">
                  {assetHistory.map((entry: AssetHistoryEntry) => (
                    <div 
                      key={entry.id} 
                      className="p-4 rounded-lg border border-border bg-card/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <HistoryIcon size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {entry.action === 'purchase' && 'Purchased'}
                              {entry.action === 'assign' && 'Assigned'}
                              {entry.action === 'status_change' && 'Status Changed'}
                              {entry.action === 'return' && 'Returned'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {entry.notes}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-secondary/20 rounded-lg border border-dashed border-secondary">
                  <HistoryIcon className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No history entries found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="employee" className="m-0">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Employee Assignment</h2>
              
              {employeeLoading ? (
                <div className="text-center py-6">
                  <div className="animate-pulse-soft">Loading employee data...</div>
                </div>
              ) : employee ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <img 
                      src={employee.imageUrl || `https://avatar.vercel.sh/${employee.id}`} 
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://avatar.vercel.sh/${employee.id}`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-sm text-muted-foreground">{employee.position}</p>
                  </div>
                  <div className="ml-auto">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/employee/${employee.id}`)}
                    >
                      View Employee
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    This asset is not assigned to an employee
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
