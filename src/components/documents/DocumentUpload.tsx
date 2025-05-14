
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Document } from "./types";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import { useDocumentStorage } from "./hooks/useDocumentStorage";
import { useToast } from "@/hooks/use-toast";

interface DocumentMetadata {
  description?: string;
  version?: number;
  tags?: string[];
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
  onDeleteDocument
}: DocumentUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { uploadDocument } = useDocumentStorage({
    assetId,
    documents,
    onAddDocument,
    toast
  });

  const handleUpload = async (
    selectedFiles: FileList,
    documentCategory: Document["category"],
    metadata: DocumentMetadata
  ) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }
    
    setIsUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        const newDocument = await uploadDocument(file, documentCategory, metadata);
        onAddDocument(newDocument);
      }
      
      toast({
        title: "Dokument hochgeladen",
        description: `${selectedFiles.length} Dokument(e) erfolgreich hochgeladen.`
      });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload fehlgeschlagen",
        description: error.message || "Dokument konnte nicht hochgeladen werden."
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
        existingDocuments={documents}
      />
    </div>
  );
}
