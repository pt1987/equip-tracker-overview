
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { Document } from "./types";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import { useDocumentStorage } from "./hooks/useDocumentStorage";

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
  onDeleteDocument
}: DocumentUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const documentsLoadedRef = useRef(false);
  const { fetchDocuments, uploadDocument, deleteDocument } = useDocumentStorage({
    assetId,
    documents,
    onAddDocument,
    toast
  });

  useEffect(() => {
    // Only fetch documents once when the component mounts
    if (assetId && !documentsLoadedRef.current) {
      fetchDocuments();
      documentsLoadedRef.current = true;
    }
  }, [assetId]);

  const handleUpload = async (selectedFiles: FileList, documentCategory: Document["category"]) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Kein Dokument ausgewählt",
        description: "Bitte wählen Sie eine Datei zum Hochladen aus.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        const newDocument = await uploadDocument(file, documentCategory);
        onAddDocument(newDocument);
        
        toast({
          title: "Dokument hochgeladen",
          description: `${file.name} wurde erfolgreich hochgeladen.`
        });
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Fehler beim Hochladen",
        description: error.message || "Ein Fehler ist aufgetreten beim Hochladen des Dokuments.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsDialogOpen(true)}
        className="rounded-full"
      >
        <Upload size={18} className="text-primary" />
      </Button>

      <DocumentUploadDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onUpload={handleUpload} 
        isUploading={isUploading} 
      />
    </div>
  );
}
