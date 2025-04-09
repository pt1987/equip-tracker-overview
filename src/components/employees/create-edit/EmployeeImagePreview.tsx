
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EmployeeImagePreviewProps {
  initialImage: string | null;
  onImageChange: (file: File) => void;
}

export function EmployeeImagePreview({ initialImage, onImageChange }: EmployeeImagePreviewProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);

  // Update preview when initialImage changes
  useEffect(() => {
    setImagePreview(initialImage);
  }, [initialImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative aspect-square w-full max-w-[200px] rounded-full overflow-hidden bg-muted group">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Profile"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <Avatar className="w-full h-full">
            <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Profile" />
            <AvatarFallback>MA</AvatarFallback>
          </Avatar>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer px-3 py-2 bg-background rounded-md text-sm font-medium">
            Bild auswählen
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Klicken Sie auf das Bild, um es zu ändern
      </p>
    </div>
  );
}
