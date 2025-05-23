
import { useState, useCallback } from "react";
import { LandingPageImage } from "@/lib/types";
import { 
  getLandingPageImages, 
  deleteLandingPageImage 
} from "@/services/landingPageService";

export function useLandingPageImages() {
  const [images, setImages] = useState<LandingPageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedImages = await getLandingPageImages();
      setImages(fetchedImages);
    } catch (err) {
      console.error("Error fetching landing page images:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch images");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteImage = async (image: LandingPageImage): Promise<boolean> => {
    try {
      await deleteLandingPageImage(image);
      setImages(images.filter(img => img.id !== image.id));
      return true;
    } catch (err) {
      console.error("Error deleting image:", err);
      setError(err instanceof Error ? err.message : "Failed to delete image");
      return false;
    }
  };

  return {
    images,
    isLoading,
    error,
    fetchImages,
    deleteImage
  };
}
