
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, FileText, FilePlus2 } from "lucide-react";
import PurchaseForm from "./PurchaseForm";

interface PurchaseUploaderProps {
  onSuccess: () => void;
}

export default function PurchaseUploader({ onSuccess }: PurchaseUploaderProps) {
  const [entryMethod, setEntryMethod] = useState<string>("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Simulate upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, we would send the file to a backend service
      // that would extract information from the document
      
      onSuccess();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={entryMethod} onValueChange={setEntryMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Beleg hochladen</TabsTrigger>
          <TabsTrigger value="manual">Manuell erfassen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4 mt-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Beleg hochladen</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Laden Sie einen Beleg hoch (PDF, PNG, JPG). Die Informationen werden automatisch extrahiert.
            </p>
            
            <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="file-upload"
                className="cursor-pointer w-full"
              >
                <div className="bg-primary/10 hover:bg-primary/20 transition-colors rounded-lg p-4 flex items-center gap-2 justify-center">
                  <FileText className="h-5 w-5" />
                  <span>{file ? file.name : "Beleg auswählen"}</span>
                </div>
              </label>
              
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full"
              >
                {isUploading ? "Wird verarbeitet..." : "Beleg hochladen"}
              </Button>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FilePlus2 className="h-4 w-4" />
              Was passiert nach dem Upload?
            </h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li>Die Betrags- und Steuerdaten werden automatisch erkannt</li>
              <li>Datum, Lieferant und Rechnungsnummer werden extrahiert</li>
              <li>Die GoBD-Konformität wird geprüft</li>
              <li>Der Beleg wird revisionssicher gespeichert</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="manual" className="mt-4">
          <div className="bg-muted p-4 mb-6 rounded-md">
            <h4 className="font-medium mb-2">Hinweis zur GoBD-konformen Erfassung</h4>
            <p className="text-sm text-muted-foreground">
              Bitte fügen Sie nach der manuellen Erfassung einen Scan oder ein Foto des Originalbelegs hinzu, 
              um die Nachvollziehbarkeit und die GoBD-Konformität zu gewährleisten.
            </p>
          </div>
          
          <PurchaseForm onSuccess={onSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
