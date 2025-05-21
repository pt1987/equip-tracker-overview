
import { useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "@/components/shared/QRCode";

interface QRCodeDialogProps {
  currentUrl: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function QRCodeDialog({ 
  currentUrl, 
  isOpen: externalIsOpen, 
  onOpenChange: externalOnOpenChange 
}: QRCodeDialogProps) {
  // Interner State wird nur verwendet, wenn keine externen Props übergeben werden
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Verwende externe Props oder interne State-Werte
  const isControlled = externalIsOpen !== undefined && externalOnOpenChange !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  const onOpenChange = isControlled 
    ? externalOnOpenChange 
    : setInternalIsOpen;
    
  // Synchronisiere den internen State, wenn sich der externe ändert
  useEffect(() => {
    if (isControlled && externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
    }
  }, [isControlled, externalIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
          >
            <QrCode className="h-4 w-4" />
            <span className="sr-only">QR-Code anzeigen</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md max-w-[90vw] w-full">
        <DialogHeader>
          <DialogTitle>Mitarbeiter QR-Code</DialogTitle>
          <DialogDescription>
            Scannen Sie diesen Code, um schnell auf die Mitarbeiterdetails zuzugreifen
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4 sm:p-6">
          <QRCode 
            value={currentUrl}
            size={Math.min(200, window.innerWidth - 100)}
            title="Mitarbeiter QR-Code"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
