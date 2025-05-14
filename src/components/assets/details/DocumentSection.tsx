
import { Document } from "@/components/documents/types";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { DocumentList } from "@/components/documents/DocumentList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { DocumentPreviewDialog } from "@/components/documents/DocumentPreviewDialog";

interface DocumentSectionProps {
  assetId: string;
  documents: Document[];
  onAddDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
}

export default function DocumentSection({
  assetId,
  documents,
  onAddDocument,
  onDeleteDocument
}: DocumentSectionProps) {
  const isMobile = useIsMobile();
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  
  // Create a wrapper function that adapts the onDeleteDocument to match the expected signature
  const handleDeleteDocument = async (documentId: string, docName: string): Promise<void> => {
    onDeleteDocument(documentId);
    return Promise.resolve();
  };

  // Handle document preview
  const handlePreviewDocument = (document: Document) => {
    setPreviewDocument(document);
  };

  const handleClosePreview = () => {
    setPreviewDocument(null);
  };

  // Ensure we have unique documents by ID
  const uniqueDocuments = documents.reduce((acc: Document[], current) => {
    const existingDocIndex = acc.findIndex(doc => doc.id === current.id);
    if (existingDocIndex === -1) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  // Sort documents by uploadDate (newest first)
  const sortedDocuments = [...uniqueDocuments].sort((a, b) => 
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );
  
  return (
    <Card className="shadow-sm">
      <div className="border-b">
        <CardHeader className={`flex flex-row items-center justify-between ${isMobile ? 'py-3 px-3' : 'py-4 px-6'}`}>
          <div className="flex items-center gap-2">
            <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>Dokumente</CardTitle>
          </div>
          <DocumentUpload assetId={assetId} documents={sortedDocuments} onAddDocument={onAddDocument} onDeleteDocument={onDeleteDocument} />
        </CardHeader>
      </div>
      <CardContent className={isMobile ? 'p-3' : 'p-6'}>
        <DocumentList 
          documents={sortedDocuments} 
          onDeleteDocument={handleDeleteDocument}
          onPreviewDocument={handlePreviewDocument}
        />
      </CardContent>
      
      <DocumentPreviewDialog
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={handleClosePreview}
      />
    </Card>
  );
}
