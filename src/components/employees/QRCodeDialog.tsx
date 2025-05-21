
import { useState } from "react";
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
}

export default function QRCodeDialog({ currentUrl }: QRCodeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
