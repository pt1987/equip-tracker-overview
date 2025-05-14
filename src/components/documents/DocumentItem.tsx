
import { useState } from "react";
import { Document } from "./types";
import { Button } from "@/components/ui/button";
import { File, Trash2, DownloadCloud, MoreVertical, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";

interface DocumentItemProps {
  document: Document;
  onDelete: (documentId: string, docName: string) => Promise<void>;
}

export function DocumentItem({ document, onDelete }: DocumentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(document.id, document.name);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getCategoryLabel = (category: Document["category"]): string => {
    switch (category) {
      case "invoice": return "Rechnung";
      case "warranty": return "Garantie";
      case "repair": return "Reparatur";
      case "manual": return "Handbuch";
      case "other": return "Sonstiges";
      default: return "Sonstiges";
    }
  };

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  // Use dropdown menu for mobile view
  if (isMobile) {
    const filename = document.name.length > 18 
      ? document.name.substring(0, 15) + '...' 
      : document.name;
    
    return (
      <>
        <div className="flex items-center justify-between p-2 bg-background rounded-md border border-secondary/30">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1.5 rounded-md">
              <File size={18} className="text-primary" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-xs truncate">{filename}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{formatFileSize(document.size)}</span>
                <span>•</span>
                <span className="text-primary text-xs">
                  {getCategoryLabel(document.category)}
                </span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border z-50">
              <DropdownMenuItem onClick={openPreview}>
                <Eye size={14} className="mr-2" />
                <span>Vorschau</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                <DownloadCloud size={14} className="mr-2" />
                <span>Herunterladen</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-destructive">
                <Trash2 size={14} className="mr-2" />
                <span>Löschen</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DocumentPreviewDialog 
          document={document} 
          isOpen={isPreviewOpen} 
          onClose={closePreview} 
        />
      </>
    );
  }

  // Desktop view
  return (
    <>
      <div className="flex items-center justify-between p-3 bg-background rounded-md border border-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md">
            <File size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{document.name}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatFileSize(document.size)}</span>
              <span>•</span>
              <span className="text-primary">
                {getCategoryLabel(document.category)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={openPreview}
                  className="rounded-full"
                >
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vorschau</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => window.open(document.url, '_blank')}
                  className="rounded-full"
                >
                  <DownloadCloud size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Herunterladen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive/80 rounded-full"
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Löschen</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <DocumentPreviewDialog 
        document={document} 
        isOpen={isPreviewOpen} 
        onClose={closePreview} 
      />
    </>
  );
}
