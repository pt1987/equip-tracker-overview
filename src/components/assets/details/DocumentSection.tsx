
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
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <CardTitle className="text-xl">Dokumente</CardTitle>
        <DocumentUpload 
          assetId={assetId} 
          documents={documents} 
          onAddDocument={onAddDocument} 
          onDeleteDocument={onDeleteDocument} 
        />
      </CardHeader>
      <CardContent className="pt-0">
      </CardContent>
    </Card>
  );
}
