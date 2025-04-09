
import { useState } from "react";
import { Asset } from "@/lib/types";
import { formatDate, formatCurrency, calculateAgeInMonths } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { QrCode, Pencil, Trash } from "lucide-react";
import StatusBadge from "../StatusBadge";
import QRCode from "@/components/shared/QRCode";

interface AssetHeaderInfoProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

export default function AssetHeaderInfo({ asset, onEdit, onDelete }: AssetHeaderInfoProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getAssetTypeLabel = (type: Asset["type"]) => {
    switch (type) {
      case "laptop": return "Laptop";
      case "smartphone": return "Smartphone";
      case "tablet": return "Tablet";
      case "mouse": return "Mouse";
      case "keyboard": return "Keyboard";
      case "accessory": return "Accessory";
      default: return "Other";
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              {getAssetTypeLabel(asset.type)}
            </Badge>
            <StatusBadge status={asset.status} size="md" />
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <QrCode size={18} className="text-muted-foreground" />
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Asset QR-Code</DialogTitle>
                  <DialogDescription>
                    Scannen Sie diesen Code, um schnell auf die Asset-Details zuzugreifen
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <QRCode value={`${window.location.origin}/asset/${asset.id}`} size={200} title={`${asset.manufacturer} ${asset.model}`} />
                </div>
              </DialogContent>
            </Dialog>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                    <Pencil size={18} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bearbeiten</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash size={18} className="text-muted-foreground hover:text-destructive" />
                </Button>
              </AlertDialogTrigger>
              
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Diese Aktion kann nicht rückgängig gemacht werden. Das Asset und alle zugehörigen Daten werden dauerhaft gelöscht.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteConfirm} 
                    disabled={isDeleting}
                    className={isDeleting ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {isDeleting ? "Löschen..." : "Löschen bestätigen"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <h1 className="text-3xl font-semibold mb-1">{asset.name}</h1>
        <p className="text-muted-foreground mb-6">
          {asset.manufacturer} {asset.model}
        </p>

        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Kaufdatum</p>
            <p className="text-base font-medium">{formatDate(asset.purchaseDate)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Preis</p>
            <p className="text-base font-medium">{formatCurrency(asset.price)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Alter</p>
            <p className="text-base font-medium">{calculateAgeInMonths(asset.purchaseDate)} Monate</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Lieferant</p>
            <p className="text-base font-medium">{asset.vendor || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
