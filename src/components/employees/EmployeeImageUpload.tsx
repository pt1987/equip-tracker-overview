
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SaveIcon, X, Upload } from "lucide-react";
import { uploadEmployeeImage } from "@/data/employees/storage";
import { useToast } from "@/hooks/use-toast";

interface EmployeeImageUploadProps {
  initialImageUrl: string | undefined;
  employeeId?: string;
  onImageChange: (imageUrl: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EmployeeImageUpload({
  initialImageUrl,
  employeeId,
  onImageChange,
  onSave,
  onCancel
}: EmployeeImageUploadProps) {
  const [imagePreview, setImagePreview] = useState(initialImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);

      // If we have an employee ID, upload to storage
      if (employeeId) {
        setIsUploading(true);
        try {
          const imageUrl = await uploadEmployeeImage(file, employeeId);
          onImageChange(imageUrl);
          
          toast({
            title: "Bild hochgeladen",
            description: "Das Profilbild wurde erfolgreich hochgeladen.",
          });
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            variant: "destructive",
            title: "Fehler beim Hochladen",
            description: "Das Bild konnte nicht hochgeladen werden.",
          });
        } finally {
          setIsUploading(false);
        }
      } else {
        // If no employee ID yet (create form), just use the data URL
        onImageChange(reader.result as string);
      }
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
          <label className="cursor-pointer px-3 py-2 bg-background rounded-md text-sm font-medium flex items-center gap-2">
            {isUploading ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                Hochladen...
              </>
            ) : (
              <>
                <Upload size={14} />
                Bild ändern
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        <Button 
          type="submit" 
          size="sm"
          onClick={onSave}
          disabled={isUploading}
        >
          <SaveIcon size={16} className="mr-2" />
          Speichern
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={onCancel}
          disabled={isUploading}
        >
          <X size={16} className="mr-2" />
          Abbrechen
        </Button>
      </div>
    </div>
  );
}
