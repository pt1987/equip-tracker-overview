import { supabase } from "@/integrations/supabase/client";
import { Document } from "../types";

interface UseDocumentStorageProps {
  assetId: string;
  documents: Document[];
  onAddDocument: (document: Document) => void;
  toast: any;
}

export function useDocumentStorage({
  assetId,
  documents,
  onAddDocument,
}: UseDocumentStorageProps) {
  const fetchDocuments = async () => {
    try {
      const {
        data,
        error
      } = await supabase.storage.from('asset-documents').list(`${assetId}/`);
      
      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }
      
      if (!data || data.length === 0) return;
      
      for (const file of data) {
        if (file.id === null) continue;
        
        const nameParts = file.name.split('_');
        const category = nameParts.length > 1 ? nameParts[0] as Document["category"] || "other" : "other";
        
        const {
          data: urlData
        } = supabase.storage.from('asset-documents').getPublicUrl(`${assetId}/${file.name}`);
        
        const docExists = documents.some(doc => doc.name === file.name);
        
        if (!docExists) {
          const newDoc: Document = {
            id: file.id,
            name: file.name.replace(`${category}_`, ''),
            type: file.metadata?.mimetype || 'application/octet-stream',
            size: file.metadata?.size || 0,
            url: urlData.publicUrl,
            uploadDate: file.created_at || new Date().toISOString(),
            category: category as Document["category"]
          };
          
          onAddDocument(newDoc);
        }
      }
    } catch (error) {
      console.error('Error processing storage documents:', error);
    }
  };

  const uploadDocument = async (file: File, documentCategory: Document["category"]): Promise<Document> => {
    const fileName = `${documentCategory}_${file.name}`;
    const filePath = `${assetId}/${fileName}`;
    
    const {
      data: uploadData,
      error: uploadError
    } = await supabase.storage.from('asset-documents').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
    
    if (uploadError) {
      throw uploadError;
    }
    
    const {
      data: urlData
    } = supabase.storage.from('asset-documents').getPublicUrl(filePath);
    
    return {
      id: uploadData.id || Math.random().toString(36).substring(2, 11),
      name: file.name,
      type: file.type,
      size: file.size,
      url: urlData.publicUrl,
      uploadDate: new Date().toISOString(),
      category: documentCategory
    };
  };

  const deleteDocument = async (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      throw new Error("Document not found");
    }
    
    const filePath = `${assetId}/${document.category}_${document.name}`;
    
    const {
      error
    } = await supabase.storage.from('asset-documents').remove([filePath]);
    
    if (error) {
      throw error;
    }
  };

  return {
    fetchDocuments,
    uploadDocument,
    deleteDocument
  };
}
