
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, FileText, Upload, Scan, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PurchaseForm from "./PurchaseForm";

interface PurchaseUploaderProps {
  onSuccess: () => void;
}

export default function PurchaseUploader({ onSuccess }: PurchaseUploaderProps) {
  const [uploadMethod, setUploadMethod] = useState<string>("drag");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      // In a real implementation, this would process the files with OCR and extract data
      console.log("Processing files:", Array.from(files).map(f => f.name));
      
      // Simulating upload and OCR processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Beleg erkannt",
        description: "Die Daten wurden aus dem Beleg extrahiert. Bitte überprüfen und vervollständigen Sie die Informationen.",
      });
      
      // Switch to the form tab after upload to let the user complete/verify the data
      setUploadMethod("manual");
    } catch (error) {
      toast({
        title: "Upload fehlgeschlagen",
        description: "Beim Hochladen des Belegs ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
      console.error("File upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={uploadMethod} onValueChange={setUploadMethod}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="drag">Hochladen</TabsTrigger>
          <TabsTrigger value="email">E-Mail</TabsTrigger>
          <TabsTrigger value="manual">Manuell erfassen</TabsTrigger>
        </TabsList>

        <TabsContent value="drag">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/20"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileUp 
                      className={`h-10 w-10 ${
                        dragActive ? "text-primary" : "text-muted-foreground/60"
                      }`} 
                    />
                    <h3 className="text-lg font-medium mt-2">
                      Beleg hierhin ziehen
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      oder klicken Sie zum Auswählen
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById("file-upload")?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Wird verarbeitet..." : "Datei auswählen"}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Unterstützte Formate: PDF, JPG, PNG (max. 10 MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Card className="flex-1">
                <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                  <Scan className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <h3 className="text-base font-medium">Mobil scannen</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Nutzen Sie die mobile App zum Scannen von Belegen
                  </p>
                  <Button variant="ghost" size="sm" className="mt-auto">
                    App öffnen
                  </Button>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="pt-6 flex flex-col items-center text-center p-6">
                  <FileText className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <h3 className="text-base font-medium">Aus Dokumenten</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Vorhandene Dokumente aus dem System verwenden
                  </p>
                  <Button variant="ghost" size="sm" className="mt-auto">
                    Dokumente anzeigen
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-6">
                <Mail className="h-10 w-10 text-muted-foreground/60 mb-4" />
                <h3 className="text-lg font-medium">Per E-Mail weiterleiten</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-6">
                  Leiten Sie Rechnungen oder Belege an die folgende E-Mail-Adresse weiter
                </p>
                
                <div className="bg-muted p-4 rounded-md w-full max-w-md mb-6">
                  <code className="text-md font-mono">belege@ihrefirma.de</code>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Die Belege werden automatisch erfasst und im System hinterlegt. Sie erhalten eine Benachrichtigung, sobald die Daten extrahiert wurden.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardContent className="pt-6">
              <PurchaseForm onSuccess={onSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
