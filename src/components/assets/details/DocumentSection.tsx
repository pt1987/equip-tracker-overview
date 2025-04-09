
import { Document } from "@/components/documents/types";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { DocumentList } from "@/components/documents/DocumentList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

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
  return <Card className="shadow-sm">
      <div className="border-b">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <CardTitle className="text-lg">Dokumente</CardTitle>
          </div>
          <DocumentUpload 
            assetId={assetId} 
            documents={documents} 
            onAddDocument={onAddDocument} 
            onDeleteDocument={onDeleteDocument} 
          />
        </CardHeader>
      </div>
      <CardContent className="p-6">
        <DocumentList documents={documents} onDeleteDocument={onDeleteDocument} />
      </CardContent>
    </Card>;
}
