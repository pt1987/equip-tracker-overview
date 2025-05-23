
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";
import { uploadLandingPageImage } from "@/services/landingPageService";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const IMAGE_TYPES = [
  { value: "dashboard", label: "Dashboard" },
  { value: "license", label: "Lizenzen" },
  { value: "booking", label: "Buchung" },
  { value: "licenseDetail", label: "Lizenz-Detail" },
  { value: "other", label: "Andere" }
];

export function ImageUploadDialog({ open, onOpenChange, onSuccess }: ImageUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [imageType, setImageType] = useState("dashboard");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Datei zu groß",
          description: "Die maximale Dateigröße beträgt 5 MB."
        });
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(selectedFile.type)) {
        toast({
          variant: "destructive",
          title: "Ungültiges Dateiformat",
          description: "Bitte wählen Sie ein Bild im Format JPG, PNG, GIF oder WebP."
        });
        return;
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      
      // Use filename as default display name
      if (!displayName) {
        setDisplayName(selectedFile.name.split('.')[0]);
      }
    }
  };

  const resetForm = () => {
    setFile(null);
    setDisplayName("");
    setDescription("");
    setImageType("dashboard");
    setPreviewUrl(null);
    setIsUploading(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte wählen Sie ein Bild aus."
      });
      return;
    }

    if (!displayName) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Bitte geben Sie einen Anzeigenamen ein."
      });
      return;
    }

    setIsUploading(true);
    
    try {
      await uploadLandingPageImage(file, {
        displayName,
        description,
        imageType
      });
      
      toast({
        title: "Erfolg",
        description: "Das Bild wurde erfolgreich hochgeladen."
      });
      
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Hochladen",
        description: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten."
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    
    // Reset the file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bild hochladen</DialogTitle>
          <DialogDescription>
            Laden Sie ein Bild für die Landing Page hoch. Unterstützte Formate sind JPG, PNG, GIF und WebP.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {!previewUrl ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md border-muted p-6 cursor-pointer hover:border-muted-foreground/50 transition-colors"
                 onClick={() => document.getElementById("image-upload")?.click()}>
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Klicken Sie hier um ein Bild auszuwählen oder ziehen Sie es hierher
              </p>
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-[16/9] flex items-center justify-center bg-muted rounded-md overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Vorschau"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="image-type">Bildtyp</Label>
            <Select value={imageType} onValueChange={setImageType}>
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie einen Bildtyp" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-name">Anzeigename*</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Geben Sie einen Namen für das Bild ein"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreiben Sie das Bild (optional)"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird hochgeladen...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Hochladen
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
