
import { useState } from "react";
import { Document } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList, category: Document["category"], metadata: DocumentMetadata) => Promise<void>;
  isUploading: boolean;
  existingDocuments?: Document[];
}

interface DocumentMetadata {
  description?: string;
  version?: number;
  tags?: string[];
}

export function DocumentUploadDialog({
  isOpen,
  onClose,
  onUpload,
  isUploading,
  existingDocuments = []
}: DocumentUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [documentCategory, setDocumentCategory] = useState<Document["category"]>("other");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isNewVersion, setIsNewVersion] = useState(false);
  const [existingDocumentName, setExistingDocumentName] = useState("");

  // Calculate next version number based on existing documents
  const getNextVersionNumber = (): number => {
    if (!existingDocumentName) return 1;
    
    const relatedDocs = existingDocuments.filter(
      doc => doc.name.toLowerCase() === existingDocumentName.toLowerCase()
    );
    
    if (relatedDocs.length === 0) return 1;
    
    const highestVersion = Math.max(...relatedDocs.map(doc => doc.version || 0));
    return highestVersion + 1;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      
      // Auto-select existing document if filename matches
      if (e.target.files[0]) {
        const newFileName = e.target.files[0].name;
        const existingDoc = existingDocuments.find(doc => 
          doc.name.toLowerCase() === newFileName.toLowerCase()
        );
        
        if (existingDoc) {
          setIsNewVersion(true);
          setExistingDocumentName(existingDoc.name);
          setDocumentCategory(existingDoc.category);
        }
      }
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentCategory(e.target.value as Document["category"]);
  };

  const handleUploadClick = async () => {
    if (selectedFiles && selectedFiles.length > 0) {
      const metadata: DocumentMetadata = {
        description: description.trim() || undefined,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || undefined
      };
      
      // Add version number if it's a new version of an existing document
      if (isNewVersion) {
        metadata.version = getNextVersionNumber();
      }
      
      await onUpload(selectedFiles, documentCategory, metadata);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedFiles(null);
    setDocumentCategory("other");
    setDescription("");
    setTags("");
    setIsNewVersion(false);
    setExistingDocumentName("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dokument hochladen</DialogTitle>
          <DialogDescription>
            Laden Sie Dokumente wie Rechnungen, Garantiescheine oder Reparaturbelege für dieses Asset hoch.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="document">Datei</Label>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                id="document"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unterstützte Dateitypen: PDF, Word, Excel, Bilder (JPG, PNG)
            </p>
          </div>
          
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="is_new_version">Versionierung</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_new_version"
                  checked={isNewVersion}
                  onChange={(e) => setIsNewVersion(e.target.checked)}
                  className="rounded border-input"
                />
                <Label htmlFor="is_new_version" className="text-sm font-normal">
                  Dies ist eine neue Version eines existierenden Dokuments
                </Label>
              </div>
              
              {isNewVersion && (
                <div className="pl-6 pt-2">
                  <Label htmlFor="existing_document" className="mb-1 block">Bestehendes Dokument</Label>
                  <select
                    id="existing_document"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={existingDocumentName}
                    onChange={(e) => setExistingDocumentName(e.target.value)}
                  >
                    <option value="">Bitte auswählen</option>
                    {[...new Set(existingDocuments.map(doc => doc.name))].map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  
                  {existingDocumentName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Neue Version: v{getNextVersionNumber()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="document_category">Dokumenttyp</Label>
            <select
              id="document_category"
              value={documentCategory}
              onChange={handleCategoryChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="invoice">Rechnung</option>
              <option value="warranty">Garantie</option>
              <option value="repair">Reparatur</option>
              <option value="manual">Handbuch</option>
              <option value="other">Sonstiges</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="document_description">Beschreibung (optional)</Label>
            <Textarea
              id="document_description"
              placeholder="Beschreibung des Dokuments"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Label htmlFor="document_tags">Tags (optional, durch Komma getrennt)</Label>
            <Input
              id="document_tags"
              placeholder="z.B. wichtig, wartung, vertrag"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleUploadClick} 
            disabled={!selectedFiles || selectedFiles.length === 0 || isUploading || (isNewVersion && !existingDocumentName)}
          >
            {isUploading ? "Wird hochgeladen..." : "Hochladen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
