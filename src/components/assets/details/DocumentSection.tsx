
import { Document } from "@/components/documents/types";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Dokumente</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <DocumentUpload 
          assetId={assetId} 
          documents={documents} 
          onAddDocument={onAddDocument} 
          onDeleteDocument={onDeleteDocument} 
        />
      </CardContent>
    </Card>
  );
}
