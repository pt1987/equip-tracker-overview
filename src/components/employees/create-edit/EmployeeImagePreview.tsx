
import { useState, useEffect } from "react";

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
    <div className="aspect-square bg-muted rounded-full overflow-hidden relative group">
      <img
        src={imagePreview || "/placeholder.svg"}
        alt="Profile"
        className="w-full h-full object-cover object-center"
      />
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
  );
}
