
import { Document } from "./types";
import { DocumentPreview } from "./DocumentPreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DownloadCloud, X, Eye } from "lucide-react";

interface DocumentPreviewDialogProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreviewDialog({
  document,
  isOpen,
  onClose
}: DocumentPreviewDialogProps) {
  if (!document) return null;

  const handleDownload = () => {
    window.open(document.url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Eye size={18} className="text-primary" />
            {document.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="my-4 border rounded-md overflow-hidden">
          <DocumentPreview document={document} />
        </div>
        
        <DialogFooter>
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">
              {document.type}
              <span className="mx-1">•</span>
              {(document.size / 1024).toFixed(1)} KB
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                <X size={16} className="mr-2" />
                Schließen
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <DownloadCloud size={16} className="mr-2" />
                Herunterladen
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
