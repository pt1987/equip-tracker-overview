
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an employee profile image to Supabase storage
 * @param file Image file to upload
 * @param employeeId Employee ID to associate with the image
 * @returns URL of the uploaded image
 */
export const uploadEmployeeImage = async (file: File, employeeId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${employeeId}/${Date.now()}.${fileExt}`;
    
    console.log(`Uploading employee image to bucket 'employee-images', path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from('employee-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error("Error uploading employee image:", error);
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('employee-images')
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadEmployeeImage:", error);
    throw error;
  }
};

/**
 * Deletes an employee profile image from Supabase storage
 * @param imageUrl URL of the image to delete
 * @returns Boolean indicating success
 */
export const deleteEmployeeImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split('employee-images/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid image URL format');
    }
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from('employee-images')
      .remove([filePath]);
    
    if (error) {
      console.error("Error deleting employee image:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteEmployeeImage:", error);
    return false;
  }
};
