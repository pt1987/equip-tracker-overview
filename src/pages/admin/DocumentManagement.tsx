
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

interface AdminDocument {
  id: string;
  storage_path: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  category: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<AdminDocument | null>(null);
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
      const { data, error } = await supabase
        .from('admin_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        // If table doesn't exist, create empty array
        setDocuments([]);
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
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
      const filePath = `admin/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('admin-documents')
        .upload(filePath, uploadFile);

      if (uploadError) {
        throw uploadError;
      }

      // Insert metadata (only if table exists)
      try {
        await supabase
          .from('admin_documents')
          .insert({
            storage_path: filePath,
            original_name: uploadFile.name,
            file_size: uploadFile.size,
            mime_type: uploadFile.type,
            category: uploadCategory,
            description: uploadDescription || null,
            tags: uploadTags ? uploadTags.split(',').map(tag => tag.trim()) : null
          });
      } catch (dbError) {
        console.warn('Could not insert metadata (table may not exist):', dbError);
      }

      toast({
        title: "Erfolg",
        description: "Dokument wurde erfolgreich hochgeladen."
      });

      setUploadDialogOpen(false);
      resetUploadForm();
      fetchDocuments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload fehlgeschlagen",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (document: AdminDocument) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('admin-documents')
        .remove([document.storage_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete metadata
      try {
        await supabase
          .from('admin_documents')
          .delete()
          .eq('id', document.id);
      } catch (dbError) {
        console.warn('Could not delete metadata:', dbError);
      }

      toast({
        title: "Erfolg",
        description: "Dokument wurde gelöscht."
      });

      fetchDocuments();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Löschen fehlgeschlagen",
        description: error.message
      });
    }
  };

  const handleDownload = async (document: AdminDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('admin-documents')
        .download(document.storage_path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.original_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
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
    const matchesSearch = doc.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
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
                        <div className="font-medium">{doc.original_name}</div>
                        {doc.description && (
                          <div className="text-sm text-muted-foreground">{doc.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryLabel(doc.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(doc.file_size)}</TableCell>
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
                    Keine Dokumente gefunden
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
            <DialogTitle>{previewDocument?.original_name}</DialogTitle>
          </DialogHeader>
          {previewDocument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Kategorie:</strong> {getCategoryLabel(previewDocument.category)}
                </div>
                <div>
                  <strong>Größe:</strong> {formatFileSize(previewDocument.file_size)}
                </div>
                <div>
                  <strong>MIME-Type:</strong> {previewDocument.mime_type}
                </div>
                <div>
                  <strong>Hochgeladen:</strong> {new Date(previewDocument.created_at).toLocaleString('de-DE')}
                </div>
              </div>
              {previewDocument.description && (
                <div>
                  <strong>Beschreibung:</strong>
                  <p className="mt-1">{previewDocument.description}</p>
                </div>
              )}
              {previewDocument.tags && previewDocument.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong>
                  <div className="flex gap-1 mt-1">
                    {previewDocument.tags.map((tag, index) => (
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
