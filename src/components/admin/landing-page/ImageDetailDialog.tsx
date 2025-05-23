
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LandingPageImage } from "@/lib/types";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface ImageDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: LandingPageImage;
  onDelete: () => void;
  onClose: () => void;
}

export function ImageDetailDialog({ 
  open, 
  onOpenChange, 
  image, 
  onDelete,
  onClose
}: ImageDetailDialogProps) {
  const copyImagePath = () => {
    // Copy the image path to the clipboard
    navigator.clipboard.writeText(`/images/${image.image_type}.jpg`);
    
    // Provide visual feedback
    const toast = document.getElementById("copy-success-toast");
    if (toast) {
      toast.classList.remove("opacity-0");
      toast.classList.add("opacity-100");
      setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
      }, 2000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd. MMMM yyyy, HH:mm", { locale: de });
    } catch (e) {
      return "Unbekanntes Datum";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{image.display_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="aspect-[16/9] bg-muted rounded-md overflow-hidden flex items-center justify-center">
            <ImageWithFallback
              src={image.url}
              alt={image.display_name}
              className="max-w-full max-h-full object-contain"
              fallbackClassName="p-8 bg-muted"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Bildtyp</Label>
              <div className="text-sm">{image.image_type}</div>
            </div>

            {image.description && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Beschreibung</Label>
                <div className="text-sm">{image.description}</div>
              </div>
            )}
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Verwendungspfad</Label>
              <div className="text-sm flex items-center">
                <code className="bg-muted px-1 py-0.5 rounded text-xs">/images/{image.image_type}.jpg</code>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 ml-2" 
                  onClick={copyImagePath}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <span 
                  id="copy-success-toast" 
                  className="ml-2 text-xs text-green-500 opacity-0 transition-opacity"
                >
                  Kopiert!
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Hochgeladen am</Label>
              <div className="text-sm">{formatDate(image.created_at)}</div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Dateiname</Label>
              <div className="text-sm">{image.file_name}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Löschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bild löschen</AlertDialogTitle>
                <AlertDialogDescription>
                  Sind Sie sicher, dass Sie dieses Bild löschen möchten? Dies kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Löschen</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
