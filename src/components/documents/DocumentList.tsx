
import { Document } from "./types";
import { DocumentItem } from "./DocumentItem";
import { FileUp } from "lucide-react";

interface DocumentListProps {
  documents: Document[];
  onDeleteDocument: (documentId: string, docName: string) => Promise<void>;
}

export function DocumentList({ documents, onDeleteDocument }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-6 rounded-lg border border-dashed border-secondary/50">
        <FileUp className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">
          Keine Dokumente vorhanden
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Klicken Sie auf "Dokument hinzufügen", um ein Dokument hochzuladen
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onDelete={onDeleteDocument} 
        />
      ))}
    </div>
  );
}
