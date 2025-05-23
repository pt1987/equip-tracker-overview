
import { LandingPageImage } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ImageGalleryProps {
  images: LandingPageImage[];
  onImageClick: (image: LandingPageImage) => void;
}

export function ImageGallery({ images, onImageClick }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="text-center p-12 border rounded-md bg-muted/10">
        <p className="text-muted-foreground mb-4">Keine Bilder gefunden.</p>
        <p className="text-sm text-muted-foreground">
          Klicken Sie auf "Bild hochladen", um Bilder für die Landing Page hinzuzufügen.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <Card 
          key={image.id} 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onImageClick(image)}
        >
          <div className="aspect-[16/9] bg-muted flex items-center justify-center overflow-hidden">
            <ImageWithFallback
              src={image.url}
              alt={image.display_name}
              className="w-full h-full object-cover"
              fallbackClassName="p-8 bg-muted"
            />
          </div>
          <CardContent className="p-3">
            <div className="truncate font-medium">{image.display_name}</div>
            <div className="text-xs text-muted-foreground mt-1">{image.image_type}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
