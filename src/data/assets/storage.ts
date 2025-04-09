
import { supabase } from "@/integrations/supabase/client";

// Function to upload an image to Supabase storage
export const uploadAssetImage = async (file: File, assetId: string): Promise<string> => {
  console.log(`Uploading image for asset ${assetId}...`);
  
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${assetId}/${Date.now()}.${fileExt}`;
    
    console.log(`Uploading to bucket 'assets', path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from upload');
    }
    
    console.log("File uploaded successfully:", data);
    
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);
    
    console.log("Public URL:", publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadAssetImage:", error);
    throw error;
  }
};
