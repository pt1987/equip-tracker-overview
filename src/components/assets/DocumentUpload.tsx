
import { useState } from "react";
import { FileUp, File, Trash2, FilePlus, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadDate: string;
  category: "invoice" | "warranty" | "repair" | "manual" | "other";
}

interface DocumentUploadProps {
  assetId: string;
  documents: Document[];
  onAddDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
}

export default function DocumentUpload({
  assetId,
  documents,
  onAddDocument,
  onDeleteDocument,
}: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [documentCategory, setDocumentCategory] = useState<Document["category"]>("other");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentCategory(e.target.value as Document["category"]);
  };

  const handleUpload = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Kein Dokument ausgewählt",
        description: "Bitte wählen Sie eine Datei zum Hochladen aus.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would upload the file to a server or storage service
    Array.from(selectedFiles).forEach(file => {
      const newDocument: Document = {
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // This is temporary and would be a server URL in a real app
        uploadDate: new Date().toISOString(),
        category: documentCategory,
      };

      onAddDocument(newDocument);
    });

    setSelectedFiles(null);
    setDocumentCategory("other");
    setIsDialogOpen(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getCategoryLabel = (category: Document["category"]): string => {
    switch (category) {
      case "invoice": return "Rechnung";
      case "warranty": return "Garantie";
      case "repair": return "Reparatur";
      case "manual": return "Handbuch";
      case "other": return "Sonstiges";
      default: return "Sonstiges";
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex justify-end mb-4">
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <FilePlus size={16} />
              Dokument hinzufügen
            </Button>
          </DialogTrigger>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-3 bg-background rounded-md border border-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md">
                    <File size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{doc.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span className="text-primary">
                        {getCategoryLabel(doc.category)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => window.open(doc.url, '_blank')}
                          className="rounded-full"
                        >
                          <DownloadCloud size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Herunterladen</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onDeleteDocument(doc.id)}
                          className="text-destructive hover:text-destructive/80 rounded-full"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Löschen</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 rounded-lg border border-dashed border-secondary/50">
            <FileUp className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Keine Dokumente vorhanden
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Klicken Sie auf "Dokument hinzufügen", um ein Dokument hochzuladen
            </p>
          </div>
        )}

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dokument hochladen</DialogTitle>
            <DialogDescription>
              Laden Sie Dokumente wie Rechnungen, Garantiescheine oder Reparaturbelege für dieses Asset hoch.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="document_category">Dokumenttyp</Label>
              <select
                id="document_category"
                value={documentCategory}
                onChange={handleCategoryChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="invoice">Rechnung</option>
                <option value="warranty">Garantie</option>
                <option value="repair">Reparatur</option>
                <option value="manual">Handbuch</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="document">Datei</Label>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input
                  id="document"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unterstützte Dateitypen: PDF, Word, Excel, Bilder (JPG, PNG)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleUpload} disabled={!selectedFiles || selectedFiles.length === 0}>
              Hochladen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
