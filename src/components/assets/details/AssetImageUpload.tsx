
import { useState } from "react";
import { uploadAssetImage } from "@/data/assets";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SaveIcon, X } from "lucide-react";

interface AssetImageUploadProps {
  assetId: string;
  initialImageUrl: string | undefined;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  onImageChange: (url: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AssetImageUpload({
  assetId,
  initialImageUrl,
  isUploading,
  setIsUploading,
  onImageChange,
  onSave,
  onCancel
}: AssetImageUploadProps) {
  const [imagePreview, setImagePreview] = useState(initialImageUrl || "");
  const { toast } = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        
        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
        };
        reader.readAsDataURL(file);
        
        // Upload to Supabase
        const imageUrl = await uploadAssetImage(file, assetId);
        onImageChange(imageUrl);
        
        toast({
          title: "Bild hochgeladen",
          description: "Das Bild wurde erfolgreich hochgeladen.",
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
    }
  };

  return (
    <div className="w-full md:w-1/3 flex-shrink-0">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
        <img
          src={imagePreview || "/placeholder.svg"}
          alt="Asset"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer px-3 py-2 bg-background rounded-md text-sm font-medium">
            {isUploading ? "Wird hochgeladen..." : "Bild ändern"}
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
        <Button type="submit" size="sm" disabled={isUploading} onClick={onSave}>
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
