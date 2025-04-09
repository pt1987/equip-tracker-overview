
import { useState, useEffect, useRef } from "react";
import { Document } from "@/components/documents/types";
import { useDocumentStorage } from "@/components/documents/hooks/useDocumentStorage";

export function useAssetDocuments(assetId: string, toast: any) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const documentsLoadedRef = useRef(false);
  const initialRenderRef = useRef(true);
  const hasShownInitialToastsRef = useRef(false);

  function addDocument(document: Document) {
    // Prüfe, ob das Dokument bereits existiert, um Duplikate zu vermeiden
    setDocuments(prevDocuments => {
      const documentExists = prevDocuments.some(doc => doc.id === document.id);
      if (documentExists) return prevDocuments;
      return [...prevDocuments, document];
    });
    
    // Only show toast notifications after initial render and not during the initial data loading
    if (!initialRenderRef.current && hasShownInitialToastsRef.current) {
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
      
      // Set a timeout to mark initial render as complete
      setTimeout(() => {
        initialRenderRef.current = false;
        // After 500ms, we consider all initial documents loaded
        // From now on, we can show toast notifications for new documents
        setTimeout(() => {
          hasShownInitialToastsRef.current = true;
        }, 100);
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
