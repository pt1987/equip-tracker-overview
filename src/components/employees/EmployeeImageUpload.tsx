
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveIcon, X } from "lucide-react";

interface EmployeeImageUploadProps {
  initialImageUrl: string | undefined;
  onImageChange: (imageUrl: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EmployeeImageUpload({
  initialImageUrl,
  onImageChange,
  onSave,
  onCancel
}: EmployeeImageUploadProps) {
  const [imagePreview, setImagePreview] = useState(initialImageUrl || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-1/4 flex-shrink-0">
      <div className="aspect-square bg-muted rounded-full overflow-hidden relative group">
        <img
          src={imagePreview || "/placeholder.svg"}
          alt="Profile"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer px-3 py-2 bg-background rounded-md text-sm font-medium">
            Bild ändern
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        <Button 
          type="submit" 
          size="sm"
          onClick={onSave}
        >
          <SaveIcon size={16} className="mr-2" />
          Speichern
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onCancel}
        >
          <X size={16} className="mr-2" />
          Abbrechen
        </Button>
      </div>
    </div>
  );
}
