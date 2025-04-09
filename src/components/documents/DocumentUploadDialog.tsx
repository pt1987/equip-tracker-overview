
import { useState } from "react";
import { Document } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  onUpload: (files: FileList, category: Document["category"]) => Promise<void>;
  isUploading: boolean;
}

export function DocumentUploadDialog({
  isOpen,
  onClose,
  onUpload,
  isUploading
}: DocumentUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [documentCategory, setDocumentCategory] = useState<Document["category"]>("other");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentCategory(e.target.value as Document["category"]);
  };

  const handleUploadClick = async () => {
    if (selectedFiles && selectedFiles.length > 0) {
      await onUpload(selectedFiles, documentCategory);
      setSelectedFiles(null);
      setDocumentCategory("other");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dokument hochladen</DialogTitle>
          <DialogDescription>
            Laden Sie Dokumente wie Rechnungen, Garantiescheine oder Reparaturbelege für dieses Asset hoch.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="document_category">Dokumenttyp</Label>
            <select
              id="document_category"
              value={documentCategory}
              onChange={handleCategoryChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="invoice">Rechnung</option>
              <option value="warranty">Garantie</option>
              <option value="repair">Reparatur</option>
              <option value="manual">Handbuch</option>
              <option value="other">Sonstiges</option>
            </select>
          </div>
          
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleUploadClick} 
            disabled={!selectedFiles || selectedFiles.length === 0 || isUploading}
          >
            {isUploading ? "Wird hochgeladen..." : "Hochladen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
