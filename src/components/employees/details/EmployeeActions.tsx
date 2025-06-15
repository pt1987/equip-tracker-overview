
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, QrCode, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QRCodeDialog from "../QRCodeDialog";
import { useState } from "react";

interface EmployeeActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function EmployeeActions({ onEdit, onDelete }: EmployeeActionsProps) {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const handleQrCodeClick = () => {
    setQrDialogOpen(true);
  };

  return (
    <>
      {/* Desktop view - show all buttons */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Pencil className="h-4 w-4 text-n26-primary" />
          <span className="sr-only">Bearbeiten</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="h-8 w-8"
          onClick={handleQrCodeClick}
        >
          <QrCode className="h-4 w-4" />
          <span className="sr-only">QR-Code anzeigen</span>
        </Button>
        
        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive border-destructive hover:bg-destructive hover:text-white" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Löschen</span>
        </Button>
      </div>
      
      {/* Mobile view - show dropdown menu with vertical dots */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <EllipsisVertical className="h-4 w-4 text-n26-primary" />
              <span className="sr-only">Mehr</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleQrCodeClick}>
              <QrCode className="mr-2 h-4 w-4" />
              <span>QR-Code anzeigen</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Bearbeiten</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Löschen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* QR Code Dialog */}
      <QRCodeDialog 
        currentUrl={window.location.href} 
        isOpen={qrDialogOpen} 
        onOpenChange={setQrDialogOpen} 
      />
    </>
  );
}
