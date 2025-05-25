
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

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("general");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTags, setUploadTags] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents from admin-documents bucket...');
      
      // First check if bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      
      if (bucketsError) {
        console.error('Error fetching buckets:', bucketsError);
        toast({
          variant: "destructive",
          title: "Fehler",
          description: "Konnte Storage-Buckets nicht laden."
        });
        setDocuments([]);
        setLoading(false);
        return;
      }

      const adminBucket = buckets?.find(bucket => bucket.id === 'admin-documents');
      if (!adminBucket) {
        console.warn('admin-documents bucket does not exist');
        // Create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket('admin-documents', {
          public: false,
          allowedMimeTypes: [
            'application/pdf',
            'image/jpeg',
            'image/png', 
            'image/gif',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ],
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          toast({
            variant: "destructive", 
            title: "Fehler",
            description: "Konnte Storage-Bucket nicht erstellen."
          });
        } else {
          console.log('Created admin-documents bucket');
        }
        setDocuments([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.storage
        .from('admin-documents')
        .list('', {
          limit: 100,
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
        const formattedDocs: DocumentFile[] = (data || [])
          .filter(file => file.name && !file.name.endsWith('/')) // Filter out folders
          .map(file => ({
            id: file.id || file.name,
            name: file.name,
            created_at: file.created_at || new Date().toISOString(),
            updated_at: file.updated_at || new Date().toISOString(),
            metadata: {
              size: file.metadata?.size || 0,
              mimetype: file.metadata?.mimetype || 'application/octet-stream',
              category: file.metadata?.category || 'general',
              description: file.metadata?.description,
              tags: file.metadata?.tags || [],
              original_name: file.metadata?.original_name || file.name
            }
          }));
        
        console.log('Formatted documents:', formattedDocs);
        setDocuments(formattedDocs);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
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
    if (!uploadFile) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte wählen Sie eine Datei aus."
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${uploadFile.name}`;
      
      // Create metadata
      const metadata = {
        category: uploadCategory,
        description: uploadDescription || undefined,
        tags: uploadTags ? uploadTags.split(',').map(tag => tag.trim()) : [],
        original_name: uploadFile.name
      };

      console.log('Uploading file with metadata:', { fileName, metadata });

      // Upload to storage with metadata
      const { error: uploadError } = await supabase.storage
        .from('admin-documents')
        .upload(fileName, uploadFile, {
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
      console.log('Deleting document:', document.name);
      const { error } = await supabase.storage
        .from('admin-documents')
        .remove([document.name]);

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
      console.log('Downloading document:', document.name);
      const { data, error } = await supabase.storage
        .from('admin-documents')
        .download(document.name);

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
    setUploadCategory("general");
    setUploadDescription("");
    setUploadTags("");
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.metadata.description && doc.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()));
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
      general: "Allgemein",
      contract: "Verträge",
      invoice: "Rechnungen",
      manual: "Handbücher",
      compliance: "Compliance",
      hr: "Personal"
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dokument-Management</h1>
          <p className="text-muted-foreground">Verwalten Sie alle hochgeladenen Dokumente zentral</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Dokument hochladen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter & Suche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Suche</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nach Dokumentname oder Beschreibung suchen..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Kategorie</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  <SelectItem value="general">Allgemein</SelectItem>
                  <SelectItem value="contract">Verträge</SelectItem>
                  <SelectItem value="invoice">Rechnungen</SelectItem>
                  <SelectItem value="manual">Handbücher</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="hr">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dokumente ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
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
                    <Badge variant="outline">
                      {getCategoryLabel(doc.metadata.category || 'general')}
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
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {documents.length === 0 ? "Keine Dokumente vorhanden" : "Keine Dokumente gefunden"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
                  <SelectItem value="general">Allgemein</SelectItem>
                  <SelectItem value="contract">Verträge</SelectItem>
                  <SelectItem value="invoice">Rechnungen</SelectItem>
                  <SelectItem value="manual">Handbücher</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="hr">Personal</SelectItem>
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
              <Button onClick={handleUpload} disabled={!uploadFile || uploading}>
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
                  <strong>Kategorie:</strong> {getCategoryLabel(previewDocument.metadata.category || 'general')}
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
