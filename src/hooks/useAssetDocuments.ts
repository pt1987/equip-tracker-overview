import { useState, useEffect, useRef } from "react";
import { Document } from "@/components/documents/types";
import { useDocumentStorage } from "@/components/documents/hooks/useDocumentStorage";

export function useAssetDocuments(assetId: string, toast: any) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const documentsLoadedRef = useRef(false);
  const initialRenderRef = useRef(true);

  function addDocument(document: Document) {
    setDocuments(prevDocuments => [...prevDocuments, document]);
    
    if (!initialRenderRef.current) {
      toast({
        title: "Dokument hinzugefügt",
        description: `${document.name} wurde erfolgreich hinzugefügt.`
      });
    }
  }
  
  const { fetchDocuments, uploadDocument, deleteDocument: deleteStorageDocument } = useDocumentStorage({
    assetId,
    documents,
    onAddDocument: addDocument,
    toast
  });

  useEffect(() => {
    if (assetId && !documentsLoadedRef.current) {
      fetchDocuments();
      documentsLoadedRef.current = true;
      setTimeout(() => {
        initialRenderRef.current = false;
      }, 500);
    }
  }, [assetId, fetchDocuments]);

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteStorageDocument(documentId);
      
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Dokument gelöscht",
        description: "Das Dokument wurde erfolgreich gelöscht."
      });
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: error.message || "Ein Fehler ist aufgetreten beim Löschen des Dokuments."
      });
    }
  };

  return {
    documents,
    addDocument,
    deleteDocument: handleDeleteDocument,
    uploadDocument
  };
}
