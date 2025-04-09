
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FilePlus, Upload } from "lucide-react";
import { Document } from "./types";
import { DocumentList } from "./DocumentList";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface DocumentUploadProps {
  assetId: string;
  documents: Document[];
  onAddDocument: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
}

export default function DocumentUpload({
  assetId,
  documents,
  onAddDocument,
  onDeleteDocument,
}: DocumentUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load existing documents from storage on component mount
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('asset-documents')
          .list(`${assetId}/`);
        
        if (error) {
          console.error('Error fetching documents:', error);
          return;
        }

        if (!data || data.length === 0) return;
        
        // Process existing files from storage
        for (const file of data) {
          // Skip folder entries
          if (file.id === null) continue;
          
          // Extract category from file path or name
          const nameParts = file.name.split('_');
          const category = nameParts.length > 1 ? 
            (nameParts[0] as Document["category"]) || "other" : 
            "other";
          
          // Get public URL for the file
          const { data: urlData } = supabase
            .storage
            .from('asset-documents')
            .getPublicUrl(`${assetId}/${file.name}`);
            
          const docExists = documents.some(doc => doc.name === file.name);
          if (!docExists) {
            const newDoc: Document = {
              id: file.id,
              name: file.name.replace(`${category}_`, ''),
              type: file.metadata?.mimetype || 'application/octet-stream',
              size: file.metadata?.size || 0,
              url: urlData.publicUrl,
              uploadDate: file.created_at || new Date().toISOString(),
              category: category as Document["category"],
            };
            
            onAddDocument(newDoc);
          }
        }
      } catch (error) {
        console.error('Error processing storage documents:', error);
      }
    };
    
    if (assetId) {
      fetchDocuments();
    }
  }, [assetId]);

  const handleUpload = async (selectedFiles: FileList, documentCategory: Document["category"]) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Kein Dokument ausgewählt",
        description: "Bitte wählen Sie eine Datei zum Hochladen aus.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      for (const file of Array.from(selectedFiles)) {
        // Prepend category to filename to help with organization and filtering
        const fileName = `${documentCategory}_${file.name}`;
        const filePath = `${assetId}/${fileName}`;
        
        // Upload the file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('asset-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL for the file
        const { data: urlData } = supabase
          .storage
          .from('asset-documents')
          .getPublicUrl(filePath);
        
        // Create document object
        const newDocument: Document = {
          id: uploadData.id || Math.random().toString(36).substring(2, 11),
          name: file.name,
          type: file.type,
          size: file.size,
          url: urlData.publicUrl,
          uploadDate: new Date().toISOString(),
          category: documentCategory,
        };
        
        onAddDocument(newDocument);
        
        toast({
          title: "Dokument hochgeladen",
          description: `${file.name} wurde erfolgreich hochgeladen.`,
        });
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Fehler beim Hochladen",
        description: error.message || "Ein Fehler ist aufgetreten beim Hochladen des Dokuments.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsDialogOpen(false);
    }
  };
  
  const handleDeleteDocument = async (documentId: string, docName: string) => {
    try {
      // Find the document to get its category prefix
      const doc = documents.find(d => d.id === documentId);
      if (!doc) return;
      
      // Extract file path including category prefix
      const filePath = `${assetId}/${doc.category}_${doc.name}`;
      
      // Delete file from storage
      const { error } = await supabase
        .storage
        .from('asset-documents')
        .remove([filePath]);
      
      if (error) {
        throw error;
      }
      
      // Remove from local state
      onDeleteDocument(documentId);
      
      toast({
        title: "Dokument gelöscht",
        description: `${docName} wurde erfolgreich gelöscht.`,
      });

      return Promise.resolve();
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast({
        title: "Fehler beim Löschen",
        description: error.message || "Ein Fehler ist aufgetreten beim Löschen des Dokuments.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDialogOpen(true)}
                className="rounded-full"
              >
                <Upload size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Dokument hinzufügen</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <DocumentList 
        documents={documents} 
        onDeleteDocument={handleDeleteDocument} 
      />

      <DocumentUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
}
