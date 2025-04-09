
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const { uploadDocument } = useDocumentStorage({
    assetId,
    documents,
    onAddDocument,
    toast: () => {} // Wir benutzen den Toast aus dem übergeordneten Hook
  });

  const handleUpload = async (selectedFiles: FileList, documentCategory: Document["category"]) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }
    
    setIsUploading(true);
    try {
      for (const file of Array.from(selectedFiles)) {
        const newDocument = await uploadDocument(file, documentCategory);
        onAddDocument(newDocument);
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
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
