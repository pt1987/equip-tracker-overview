
import { Document } from "./types";
import { DocumentItem } from "./DocumentItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface DocumentListProps {
  documents: Document[];
  onDeleteDocument: (documentId: string, docName: string) => Promise<void>;
  onPreviewDocument?: (document: Document) => void;
}

export function DocumentList({
  documents,
  onDeleteDocument,
  onPreviewDocument
}: DocumentListProps) {
  const isMobile = useIsMobile();
  
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
    <div className={`space-y-${isMobile ? '1.5' : '2'} max-h-[350px] overflow-y-auto pr-1`}>
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
