
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
  // Entferne Duplikate basierend auf document ID
  const uniqueDocuments = documents.reduce((acc: Document[], current) => {
    const existingDocIndex = acc.findIndex(doc => doc.id === current.id);
    if (existingDocIndex === -1) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  if (uniqueDocuments.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Keine Dokumente vorhanden
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {uniqueDocuments.map(doc => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onDelete={onDeleteDocument} 
        />
      ))}
    </div>
  );
}
