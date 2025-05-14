
import { supabase } from "@/integrations/supabase/client";
import { Document } from "../types";

interface UseDocumentStorageProps {
  assetId: string;
  documents: Document[];
  onAddDocument: (document: Document) => void;
  toast: any;
}

interface DocumentMetadata {
  description?: string;
  version?: number;
  tags?: string[];
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
        
        // Parse metadata from filename
        // Format: category_[v{version}_][{metadata}]_filename
        const fileNameParts = file.name.split('_');
        let category: Document["category"] = "other";
        let version: number | undefined = undefined;
        let actualFileName = file.name;
        let metadata: Record<string, any> = {};
        
        // First part is always the category
        if (fileNameParts.length > 1) {
          category = fileNameParts[0] as Document["category"];
          
          // Check if second part is a version number
          if (fileNameParts.length > 2 && fileNameParts[1].startsWith('v')) {
            version = parseInt(fileNameParts[1].substring(1), 10);
            // The actual filename starts from part 2
            actualFileName = fileNameParts.slice(2).join('_');
            
            // Extract metadata if available
            try {
              const metadataString = file.metadata?.metadata || "{}";
              metadata = JSON.parse(metadataString);
            } catch (err) {
              console.error('Error parsing document metadata:', err);
            }
          } else {
            // No version info, actual filename starts from part 1
            actualFileName = fileNameParts.slice(1).join('_');
          }
        }
        
        const {
          data: urlData
        } = supabase.storage.from('asset-documents').getPublicUrl(`${assetId}/${file.name}`);
        
        const docExists = documents.some(doc => doc.name === actualFileName && doc.id === file.id);
        
        if (!docExists) {
          const fileType = file.metadata?.mimetype || 'application/octet-stream';
          
          const newDoc: Document = {
            id: file.id,
            name: actualFileName,
            type: fileType,
            size: file.metadata?.size || 0,
            url: urlData.publicUrl,
            uploadDate: file.created_at || new Date().toISOString(),
            category: category,
            version: version,
            description: metadata.description,
            tags: metadata.tags,
            previewAvailable: fileType.startsWith('image/') || 
                            fileType === 'application/pdf' ||
                            fileType.startsWith('video/') ||
                            fileType.startsWith('audio/')
          };
          
          onAddDocument(newDoc);
        }
      }
    } catch (error) {
      console.error('Error processing storage documents:', error);
    }
  };

  const uploadDocument = async (
    file: File, 
    documentCategory: Document["category"], 
    metadata: DocumentMetadata = {}
  ): Promise<Document> => {
    // Prepare filename with metadata
    let fileName = file.name;
    
    // If it's a new version, format the filename to include version
    let fileNameWithInfo = `${documentCategory}_`;
    if (metadata.version) {
      fileNameWithInfo += `v${metadata.version}_`;
    }
    fileNameWithInfo += fileName;
    
    const filePath = `${assetId}/${fileNameWithInfo}`;
    
    // Prepare metadata to store - FIX: Change from string to object
    const fileMetadata = {
      metadata: {
        description: metadata.description || "",
        tags: metadata.tags || []
      }
    };
    
    const {
      data: uploadData,
      error: uploadError
    } = await supabase.storage.from('asset-documents').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
      ...fileMetadata
    });
    
    if (uploadError) {
      throw uploadError;
    }
    
    const {
      data: urlData
    } = supabase.storage.from('asset-documents').getPublicUrl(filePath);
    
    return {
      id: uploadData.id || Math.random().toString(36).substring(2, 11),
      name: fileName,
      type: file.type,
      size: file.size,
      url: urlData.publicUrl,
      uploadDate: new Date().toISOString(),
      category: documentCategory,
      version: metadata.version,
      description: metadata.description,
      tags: metadata.tags,
      previewAvailable: file.type.startsWith('image/') || 
                        file.type === 'application/pdf' ||
                        file.type.startsWith('video/') ||
                        file.type.startsWith('audio/')
    };
  };

  const deleteDocument = async (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document) {
      throw new Error("Document not found");
    }
    
    // Format the full filename as stored in Supabase
    let fullFileName = `${document.category}_`;
    if (document.version) {
      fullFileName += `v${document.version}_`;
    }
    fullFileName += document.name;
    
    const filePath = `${assetId}/${fullFileName}`;
    
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
