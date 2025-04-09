import { Document } from "./types";
import { DocumentItem } from "./DocumentItem";
import { FileUp } from "lucide-react";
interface DocumentListProps {
  documents: Document[];
  onDeleteDocument: (documentId: string, docName: string) => Promise<void>;
}
export function DocumentList({
  documents,
  onDeleteDocument
}: DocumentListProps) {
  if (documents.length === 0) {
    return;
  }
  return <div className="space-y-2">
      {documents.map(doc => <DocumentItem key={doc.id} document={doc} onDelete={onDeleteDocument} />)}
    </div>;
}