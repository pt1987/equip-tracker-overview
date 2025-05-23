
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, Image as ImageIcon, RefreshCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLandingPageImages } from "@/hooks/use-landing-page-images";
import { ImageUploadDialog } from "@/components/admin/landing-page/ImageUploadDialog";
import { ImageGallery } from "@/components/admin/landing-page/ImageGallery";
import { ImageDetailDialog } from "@/components/admin/landing-page/ImageDetailDialog";
import { LandingPageImage } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function LandingPageImages() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<LandingPageImage | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { images, isLoading, error, fetchImages, deleteImage } = useLandingPageImages();

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleRefresh = () => {
    fetchImages();
    toast({
      title: "Aktualisiert",
      description: "Bildergalerie wurde aktualisiert",
    });
  };

  const handleImageClick = (image: LandingPageImage) => {
    setSelectedImage(image);
    setIsDetailDialogOpen(true);
  };

  const handleImageDelete = async (image: LandingPageImage) => {
    if (await deleteImage(image)) {
      setIsDetailDialogOpen(false);
      setSelectedImage(null);
      toast({
        title: "Bild gelöscht",
        description: `${image.display_name} wurde erfolgreich gelöscht`,
      });
    }
  };

  const handleDialogClose = () => {
    setIsDetailDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Landing Page Bilder</h1>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aktualisieren</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bild hochladen
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bilderverwaltung</CardTitle>
          <CardDescription>
            Hier können Sie Bilder für die Landing Page hochladen und verwalten.
            Diese Bilder können dann auf der Landing Page verwendet werden.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gallery" className="space-y-4">
            <TabsList>
              <TabsTrigger value="gallery">
                <ImageIcon className="h-4 w-4 mr-2" />
                Galerie
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Bilder werden geladen...</span>
                </div>
              ) : error ? (
                <div className="rounded-md bg-destructive/10 p-4 text-destructive flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  <p>Fehler beim Laden der Bilder: {error}</p>
                </div>
              ) : (
                <ImageGallery 
                  images={images} 
                  onImageClick={handleImageClick} 
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <p>Unterstützte Dateiformate: JPG, PNG, GIF, WebP (max. 5 MB)</p>
          </div>
        </CardFooter>
      </Card>

      <ImageUploadDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
        onSuccess={fetchImages}
      />

      {selectedImage && (
        <ImageDetailDialog
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
          image={selectedImage}
          onDelete={() => handleImageDelete(selectedImage)}
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
}
