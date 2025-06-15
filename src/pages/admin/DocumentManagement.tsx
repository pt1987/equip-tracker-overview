
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download, Upload, Search, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentFile {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  assetId: string;
  fullPath: string;
  metadata: {
    size: number;
    mimetype: string;
    category?: string;
    description?: string;
    tags?: string[];
    original_name?: string;
  };
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<DocumentFile | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("other");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [selectedAssetId, setSelectedAssetId] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents from asset-documents bucket...');
      
      const { data, error } = await supabase.storage
        .from('asset-documents')
        .list('', {
          limit: 1000,
          offset: 0,
        });

      console.log('Storage list result:', { data, error });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          variant: "destructive",
          title: "Fehler", 
          description: `Konnte Dokumente nicht laden: ${error.message}`
        });
        setDocuments([]);
      } else {
        console.log('Raw storage files:', data);
        
        // Process all files and organize by asset
        const allDocuments: DocumentFile[] = [];
        
        for (const folder of data || []) {
          if (folder.name && !folder.name.includes('.')) {
            // This is likely a folder (asset ID)
            const assetId = folder.name;
            
            // Get files in this asset folder
            const { data: assetFiles, error: assetError } = await supabase.storage
              .from('asset-documents')
              .list(assetId);
            
            if (!assetError && assetFiles) {
              for (const file of assetFiles) {
                if (file.name && file.id) {
                  // Parse filename for category and metadata
                  const fileNameParts = file.name.split('_');
                  let category = "other";
                  let originalName = file.name;
                  
                  if (fileNameParts.length > 1) {
                    category = fileNameParts[0];
                    originalName = fileNameParts.slice(1).join('_');
                    
                    // Remove version info if present
                    if (fileNameParts.length > 2 && fileNameParts[1].startsWith('v')) {
                      originalName = fileNameParts.slice(2).join('_');
                    }
                  }

                  const doc: DocumentFile = {
                    id: file.id,
                    name: originalName,
                    created_at: file.created_at || new Date().toISOString(),
                    updated_at: file.updated_at || new Date().toISOString(),
                    assetId: assetId,
                    fullPath: `${assetId}/${file.name}`,
                    metadata: {
                      size: file.metadata?.size || 0,
                      mimetype: file.metadata?.mimetype || 'application/octet-stream',
                      category: category,
                      description: file.metadata?.description,
                      tags: file.metadata?.tags || [],
                      original_name: originalName
                    }
                  };
                  
                  allDocuments.push(doc);
                }
              }
            }
          }
        }
        
        console.log('Processed documents:', allDocuments);
        setDocuments(allDocuments);
      }
    } catch (error) {
      console.error('Unexpected error fetching documents:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten."
      });
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedAssetId) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte wählen Sie eine Datei und ein Asset aus."
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${uploadCategory}_${Date.now()}_${uploadFile.name}`;
      const filePath = `${selectedAssetId}/${fileName}`;
      
      // Create metadata
      const metadata = {
        description: uploadDescription || undefined,
        tags: uploadTags ? uploadTags.split(',').map(tag => tag.trim()) : [],
        original_name: uploadFile.name
      };

      console.log('Uploading file with metadata:', { filePath, metadata });

      // Upload to storage with metadata
      const { error: uploadError } = await supabase.storage
        .from('asset-documents')
        .upload(filePath, uploadFile, {
          metadata
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully');
      toast({
        title: "Erfolg",
        description: "Dokument wurde erfolgreich hochgeladen."
      });

      setUploadDialogOpen(false);
      resetUploadForm();
      fetchDocuments();
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload fehlgeschlagen",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document: DocumentFile) => {
    try {
      console.log('Deleting document:', document.fullPath);
      const { error } = await supabase.storage
        .from('asset-documents')
        .remove([document.fullPath]);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      toast({
        title: "Erfolg",
        description: "Dokument wurde gelöscht."
      });

      fetchDocuments();
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast({
        variant: "destructive",
        title: "Löschen fehlgeschlagen",
        description: error.message
      });
    }
  };

  const handleDownload = async (document: DocumentFile) => {
    try {
      console.log('Downloading document:', document.fullPath);
      const { data, error } = await supabase.storage
        .from('asset-documents')
        .download(document.fullPath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.metadata.original_name || document.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download failed:', error);
      toast({
        variant: "destructive",
        title: "Download fehlgeschlagen",
        description: error.message
      });
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadCategory("other");
    setUploadDescription("");
    setUploadTags("");
    setSelectedAssetId("");
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.metadata.description && doc.metadata.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         doc.assetId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || doc.metadata.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      invoice: "Rechnung",
      warranty: "Garantie", 
      repair: "Reparatur",
      manual: "Handbuch",
      other: "Sonstiges"
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-start'}`}>
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Dokument-Management</h1>
          <p className="text-muted-foreground mt-1">Verwalten Sie alle Asset-Dokumente zentral</p>
        </div>
        <Button 
          onClick={() => setUploadDialogOpen(true)}
          className={isMobile ? 'w-full' : ''}
        >
          <Upload className="h-4 w-4 mr-2" />
          Dokument hochladen
        </Button>
      </div>

      <Card>
        <CardHeader className={isMobile ? 'pb-3' : ''}>
          <CardTitle className={isMobile ? 'text-lg' : ''}>Filter & Suche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
            <div className="flex-1">
              <Label htmlFor="search">Suche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nach Dokumentname, Asset-ID oder Beschreibung suchen..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className={isMobile ? 'w-full' : 'w-48'}>
              <Label htmlFor="category">Kategorie</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  <SelectItem value="invoice">Rechnung</SelectItem>
                  <SelectItem value="warranty">Garantie</SelectItem>
                  <SelectItem value="repair">Reparatur</SelectItem>
                  <SelectItem value="manual">Handbuch</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={isMobile ? 'text-lg' : ''}>
            Dokumente ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? 'p-0' : ''}>
          {isMobile ? (
            // Mobile view - Card layout
            <div className="space-y-3 px-4 pb-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <FileText className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm mb-1 truncate">
                          {doc.metadata.original_name || doc.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          Asset: {doc.assetId}
                        </p>
                        {doc.metadata.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {doc.metadata.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(doc.metadata.category || 'other')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(doc.metadata.size)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewDocument(doc)}
                            className="flex-1 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Anzeigen
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                            className="flex-1 text-xs"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc)}
                      className="text-destructive hover:text-destructive/80 flex-shrink-0 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredDocuments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {documents.length === 0 ? "Keine Dokumente vorhanden" : "Keine Dokumente gefunden"}
                </div>
              )}
            </div>
          ) : (
            // Desktop view - Table layout
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Kategorie</TableHead>
                    <TableHead>Größe</TableHead>
                    <TableHead>Hochgeladen am</TableHead>
                    <TableHead>Aktionen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{doc.metadata.original_name || doc.name}</div>
                            {doc.metadata.description && (
                              <div className="text-sm text-muted-foreground">{doc.metadata.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.assetId}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(doc.metadata.category || 'other')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.metadata.size)}</TableCell>
                      <TableCell>
                        {new Date(doc.created_at).toLocaleDateString('de-DE')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewDocument(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredDocuments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {documents.length === 0 ? "Keine Dokumente vorhanden" : "Keine Dokumente gefunden"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokument hochladen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset-id">Asset ID</Label>
              <Input
                id="asset-id"
                placeholder="Asset ID eingeben"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="file">Datei</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
              />
            </div>
            <div>
              <Label htmlFor="upload-category">Kategorie</Label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Rechnung</SelectItem>
                  <SelectItem value="warranty">Garantie</SelectItem>
                  <SelectItem value="repair">Reparatur</SelectItem>
                  <SelectItem value="manual">Handbuch</SelectItem>
                  <SelectItem value="other">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="upload-description">Beschreibung (optional)</Label>
              <Textarea
                id="upload-description"
                placeholder="Beschreibung des Dokuments"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="upload-tags">Tags (optional, durch Komma getrennt)</Label>
              <Input
                id="upload-tags"
                placeholder="z.B. wichtig, vertrag, 2024"
                value={uploadTags}
                onChange={(e) => setUploadTags(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleUpload} disabled={!uploadFile || !selectedAssetId || uploading}>
                {uploading ? "Wird hochgeladen..." : "Hochladen"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{previewDocument?.metadata.original_name || previewDocument?.name}</DialogTitle>
          </DialogHeader>
          {previewDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Asset:</strong> {previewDocument.assetId}
                </div>
                <div>
                  <strong>Kategorie:</strong> {getCategoryLabel(previewDocument.metadata.category || 'other')}
                </div>
                <div>
                  <strong>Größe:</strong> {formatFileSize(previewDocument.metadata.size)}
                </div>
                <div>
                  <strong>MIME-Type:</strong> {previewDocument.metadata.mimetype}
                </div>
                <div>
                  <strong>Hochgeladen:</strong> {new Date(previewDocument.created_at).toLocaleString('de-DE')}
                </div>
              </div>
              {previewDocument.metadata.description && (
                <div>
                  <strong>Beschreibung:</strong>
                  <p className="mt-1">{previewDocument.metadata.description}</p>
                </div>
              )}
              {previewDocument.metadata.tags && previewDocument.metadata.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong>
                  <div className="flex gap-1 mt-1">
                    {previewDocument.metadata.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={() => handleDownload(previewDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  Herunterladen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
