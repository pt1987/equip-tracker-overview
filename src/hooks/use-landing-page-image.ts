
import { useState, useEffect } from 'react';
import { LandingPageImage } from '@/lib/types';
import { getLandingPageImageByType, getLandingPageImagesByType } from '@/services/landingPageService';

export function useLandingPageImage(imageType: string) {
  const [image, setImage] = useState<LandingPageImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedImage = await getLandingPageImageByType(imageType);
        setImage(fetchedImage);
      } catch (err) {
        console.error(`Error fetching ${imageType} image:`, err);
        setError(err instanceof Error ? err.message : "Failed to fetch image");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImage();
  }, [imageType]);

  return {
    image,
    isLoading,
    error
  };
}

export function useLandingPageImages(imageType: string) {
  const [images, setImages] = useState<LandingPageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedImages = await getLandingPageImagesByType(imageType);
        setImages(fetchedImages);
      } catch (err) {
        console.error(`Error fetching ${imageType} images:`, err);
        setError(err instanceof Error ? err.message : "Failed to fetch images");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [imageType]);

  return {
    images,
    isLoading,
    error
  };
}
