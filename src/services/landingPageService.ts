
import { supabase } from "@/integrations/supabase/client";
import { LandingPageImage } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// Interface for upload metadata
interface ImageUploadMetadata {
  displayName: string;
  description?: string;
  imageType: string;
}

// Gets all landing page images with URLs
export async function getLandingPageImages(): Promise<LandingPageImage[]> {
  const { data, error } = await supabase
    .from("landing_page_images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching landing page images: ${error.message}`);
  }

  // Generate URL for each image
  const imagesWithUrls = await Promise.all(data.map(async (image) => {
    const { data: publicUrl } = supabase
      .storage
      .from("landing_page_images")
      .getPublicUrl(image.storage_path);

    return {
      ...image,
      url: publicUrl.publicUrl
    };
  }));

  return imagesWithUrls;
}

// Uploads an image
export async function uploadLandingPageImage(file: File, metadata: ImageUploadMetadata): Promise<LandingPageImage> {
  const { displayName, description, imageType } = metadata;
  
  // Generate unique file path
  const fileExt = file.name.split('.').pop();
  const filePath = `${imageType}/${uuidv4()}.${fileExt}`;
  
  // Upload image to storage
  const { error: uploadError } = await supabase
    .storage
    .from("landing_page_images")
    .upload(filePath, file);
    
  if (uploadError) {
    throw new Error(`Error uploading image: ${uploadError.message}`);
  }
  
  // Generate URL for the image
  const { data: publicUrlData } = supabase
    .storage
    .from("landing_page_images")
    .getPublicUrl(filePath);
    
  // Store metadata in database
  const { data: user } = await supabase.auth.getUser();
  
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  
  const { data: imageData, error: insertError } = await supabase
    .from("landing_page_images")
    .insert({
      file_name: file.name,
      storage_path: filePath,
      display_name: displayName,
      description: description || null,
      image_type: imageType,
      created_by: user.user.id
    })
    .select()
    .single();
    
  if (insertError) {
    // Delete the uploaded image if metadata insertion fails
    await supabase.storage.from("landing_page_images").remove([filePath]);
    throw new Error(`Error inserting image metadata: ${insertError.message}`);
  }
  
  return {
    ...imageData,
    url: publicUrlData.publicUrl
  };
}

// Deletes an image and its metadata
export async function deleteLandingPageImage(image: LandingPageImage): Promise<void> {
  // Delete metadata from database
  const { error: deleteMetadataError } = await supabase
    .from("landing_page_images")
    .delete()
    .eq("id", image.id);
    
  if (deleteMetadataError) {
    throw new Error(`Error deleting image metadata: ${deleteMetadataError.message}`);
  }
  
  // Delete image from storage
  const { error: deleteFileError } = await supabase
    .storage
    .from("landing_page_images")
    .remove([image.storage_path]);
    
  if (deleteFileError) {
    console.error(`Warning: Could not delete image file: ${deleteFileError.message}`);
    // We don't throw an error here since metadata was already deleted
  }
}

// Updates landing page images in LandingPage.tsx
export async function updateLandingPageImage(imageType: string): Promise<void> {
  // Get all images of this type
  const { data, error } = await supabase
    .from("landing_page_images")
    .select("*")
    .eq("image_type", imageType)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Error fetching images for type ${imageType}: ${error.message}`);
  }

  if (data && data.length > 0) {
    const latestImage = data[0];
    
    // Generate URL for the image
    const { data: publicUrlData } = supabase
      .storage
      .from("landing_page_images")
      .getPublicUrl(latestImage.storage_path);

    // Code here could update the image in LandingPage.tsx
    // If working with a constant in LandingPage.tsx
    console.log(`Image URL for ${imageType}: ${publicUrlData.publicUrl}`);

    return;
  }
  
  throw new Error(`No image found for type ${imageType}`);
}
