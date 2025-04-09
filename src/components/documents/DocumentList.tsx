
import { Document } from "./types";
import { DocumentItem } from "./DocumentItem";

interface DocumentListProps {
  documents: Document[];
  onDeleteDocument: (documentId: string, docName: string) => Promise<void>;
}

export function DocumentList({
  documents,
  onDeleteDocument
}: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Keine Dokumente vorhanden
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map(doc => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onDelete={onDeleteDocument} 
        />
      ))}
    </div>
  );
}
