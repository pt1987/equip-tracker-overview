
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
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <CardTitle className="text-lg font-medium">Dokumente</CardTitle>
        <DocumentUpload 
          assetId={assetId} 
          documents={documents} 
          onAddDocument={onAddDocument} 
          onDeleteDocument={onDeleteDocument} 
        />
      </CardHeader>
      <CardContent>
        {/* DocumentList will be rendered inside DocumentUpload */}
      </CardContent>
    </Card>
  );
}
