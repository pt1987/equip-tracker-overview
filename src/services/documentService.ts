
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/components/assets/DocumentUpload";
import { v4 as uuidv4 } from "uuid";

// Function to upload a document to Supabase storage
export const uploadDocument = async (file: File, assetId: string, category: Document['category']): Promise<Document> => {
  // Create a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${assetId}/${fileName}`;
  
  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('asset_documents')
    .upload(filePath, file);
  
  if (uploadError) {
    console.error('Error uploading document:', uploadError);
    throw uploadError;
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('asset_documents')
    .getPublicUrl(filePath);
  
  const url = urlData.publicUrl;
  
  // Add record to documents table
  const { data: documentData, error: documentError } = await supabase
    .from('documents')
    .insert({
      asset_id: assetId,
      name: file.name,
      file_path: filePath,
      file_type: file.type,
      upload_date: new Date().toISOString()
    })
    .select()
    .single();
  
  if (documentError) {
    console.error('Error saving document metadata:', documentError);
    throw documentError;
  }
  
  return {
    id: documentData?.id || '',
    name: file.name,
    type: file.type,
    size: file.size,
    url: url,
    uploadDate: documentData?.upload_date || new Date().toISOString(),
    category: category
  };
};

// Function to get documents for an asset
export const getDocumentsByAssetId = async (assetId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('asset_id', assetId)
    .order('upload_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
  
  if (!data) return [];
  
  return Promise.all(data.map(async (doc) => {
    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from('asset_documents')
      .getPublicUrl(doc.file_path);
    
    // Determine category based on file type or name (this is a simplification)
    let category: Document['category'] = 'other';
    if (doc.file_type && doc.file_type.includes('pdf')) {
      if (doc.name.toLowerCase().includes('invoice')) category = 'invoice';
      else if (doc.name.toLowerCase().includes('warranty')) category = 'warranty';
      else if (doc.name.toLowerCase().includes('repair')) category = 'repair';
      else if (doc.name.toLowerCase().includes('manual')) category = 'manual';
    }
    
    return {
      id: doc.id,
      name: doc.name,
      type: doc.file_type,
      size: 0, // We don't have this info stored, would require a storage API call
      url: urlData.publicUrl,
      uploadDate: doc.upload_date,
      category: category
    };
  }));
};

// Function to delete a document
export const deleteDocument = async (documentId: string): Promise<void> => {
  // First get the document to find its file path
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', documentId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching document:', fetchError);
    throw fetchError;
  }
  
  if (!document) {
    throw new Error('Document not found');
  }
  
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('asset_documents')
    .remove([document.file_path]);
  
  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    throw storageError;
  }
  
  // Delete from documents table
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);
  
  if (dbError) {
    console.error('Error deleting document record:', dbError);
    throw dbError;
  }
};
