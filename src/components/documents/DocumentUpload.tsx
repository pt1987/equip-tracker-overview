
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { Document } from "./types";
import { DocumentList } from "./DocumentList";
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
  const { fetchDocuments, uploadDocument, deleteDocument } = useDocumentStorage({
    assetId,
    documents,
    onAddDocument,
    toast
  });

  useEffect(() => {
    if (assetId) {
      fetchDocuments();
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

  const handleDeleteDocument = async (documentId: string, docName: string) => {
    try {
      const doc = documents.find(d => d.id === documentId);
      if (!doc) return Promise.reject(new Error("Document not found"));
      
      await deleteDocument(doc);
      onDeleteDocument(documentId);
      
      toast({
        title: "Dokument gelöscht",
        description: `${docName} wurde erfolgreich gelöscht.`
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: "Fehler beim Löschen",
        description: error.message || "Ein Fehler ist aufgetreten beim Löschen des Dokuments.",
        variant: "destructive"
      });
      return Promise.reject(error);
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

      <DocumentList documents={documents} onDeleteDocument={handleDeleteDocument} />

      <DocumentUploadDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onUpload={handleUpload} 
        isUploading={isUploading} 
      />
    </div>
  );
}
