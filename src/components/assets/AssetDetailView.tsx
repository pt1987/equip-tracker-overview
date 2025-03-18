
import { useState } from "react";
import { Asset } from "@/lib/types";
import { formatDate, formatCurrency, calculateAgeInMonths } from "@/lib/utils";
import { motion } from "framer-motion";
import { CalendarClock, Euro, Tag, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AssetDetailViewProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AssetDetailView({
  asset,
  onEdit,
  onDelete,
}: AssetDetailViewProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {asset.imageUrl ? (
            <motion.img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <StatusBadge status={asset.status} size="lg" />
        </div>
        <div className="mt-4 flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
          >
            <Pencil size={16} className="mr-2" />
            Bearbeiten
          </Button>
          
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash size={16} className="mr-2" />
                Löschen
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
                <AlertDialogAction onClick={onDelete}>
                  Löschen bestätigen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex-1">
        <div className="inline-flex items-center px-2 py-1 mb-2 rounded-full bg-secondary text-xs font-medium">
          {getAssetTypeLabel(asset.type)}
        </div>
        <h1 className="text-2xl font-bold mb-2">{asset.name}</h1>
        <p className="text-muted-foreground mb-4">
          {asset.manufacturer} {asset.model}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-blue-100">
              <CalendarClock size={16} className="text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Purchase Date</p>
              <p className="font-medium">{formatDate(asset.purchaseDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-green-100">
              <Euro size={16} className="text-green-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Purchase Price</p>
              <p className="font-medium">{formatCurrency(asset.price)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-purple-100">
              <Tag size={16} className="text-purple-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vendor</p>
              <p className="font-medium">{asset.vendor}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-amber-100">
              <CalendarClock size={16} className="text-amber-700" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-medium">{calculateAgeInMonths(asset.purchaseDate)} months</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
