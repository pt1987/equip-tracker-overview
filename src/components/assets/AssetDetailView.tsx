
import { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { formatDate, formatCurrency, calculateAgeInMonths } from "@/lib/utils";
import { motion } from "framer-motion";
import { CalendarClock, Euro, Tag, User, Wrench, Pencil, Trash, Cpu, QrCode, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "./StatusBadge";
import { getEmployeeById } from "@/data/employees";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from "@/components/shared/QRCode";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AssetDetailViewProps {
  asset: Asset;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AssetDetailView({
  asset,
  onEdit,
  onDelete
}: AssetDetailViewProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<any | null>(null);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployee = async () => {
      if (asset.employeeId) {
        setIsLoadingEmployee(true);
        try {
          const employee = await getEmployeeById(asset.employeeId);
          setEmployeeData(employee);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoadingEmployee(false);
        }
      }
    };
    fetchEmployee();
  }, [asset.employeeId]);

  const getAssetTypeLabel = (type: Asset["type"]) => {
    switch (type) {
      case "laptop":
        return "Laptop";
      case "smartphone":
        return "Smartphone";
      case "tablet":
        return "Tablet";
      case "mouse":
        return "Mouse";
      case "keyboard":
        return "Keyboard";
      case "accessory":
        return "Accessory";
      default:
        return "Other";
    }
  };

  const getAssetImage = () => {
    if (!asset.imageUrl || asset.imageUrl.trim() === '') {
      return `/placeholder.svg`;
    }
    try {
      new URL(asset.imageUrl);
      return asset.imageUrl;
    } catch (e) {
      return `/placeholder.svg`;
    }
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero section with image and key info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Asset image - left column */}
        <div className="relative flex items-center justify-center">
          <motion.img 
            src={getAssetImage()} 
            alt={asset.name} 
            className="max-h-[360px] w-auto object-contain" 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onError={e => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>

        {/* Asset header info - right column */}
        <div className="space-y-6">
          <div className="relative">
            {/* Action buttons aligned with badges */}
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <QrCode size={18} className="text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>QR-Code anzeigen</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash size={18} className="text-muted-foreground hover:text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Löschen</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                      <AlertDialogAction onClick={handleDeleteConfirm}>
                        Löschen bestätigen
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

            {/* Key information indicators in a grid */}
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
      </div>

      {/* Technical details section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-medium">Technische Details</h2>
          <Separator className="flex-grow" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {asset.serialNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Seriennummer</p>
              <p className="font-medium tracking-wide">{asset.serialNumber}</p>
            </div>
          )}
          
          {asset.inventoryNumber && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Inventar-Nr.</p>
              <p className="font-medium">{asset.inventoryNumber}</p>
            </div>
          )}
          
          {asset.imei && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IMEI</p>
              <p className="font-medium">{asset.imei}</p>
            </div>
          )}
          
          {asset.hasWarranty !== undefined && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Garantie</p>
              <p className="font-medium">
                {asset.hasWarranty ? "Ja" : "Nein"}
                {asset.additionalWarranty && ", erweitert"}
              </p>
            </div>
          )}
        </div>
        
        {asset.type === "smartphone" && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Vertragsdaten</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {asset.phoneNumber && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefonnummer</p>
                  <p className="font-medium">{asset.phoneNumber}</p>
                </div>
              )}
              
              {asset.provider && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="font-medium">{asset.provider}</p>
                </div>
              )}
              
              {asset.contractName && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vertrag</p>
                  <p className="font-medium">{asset.contractName}</p>
                </div>
              )}
              
              {asset.contractEndDate && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vertragsende</p>
                  <p className="font-medium">{formatDate(asset.contractEndDate)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Employee section */}
      <div className="flex items-center">
        {asset.employeeId ? (
          <>
            {isLoadingEmployee ? (
              <div className="flex justify-center py-4 w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : employeeData ? (
              <div className="flex items-center gap-5">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={employeeData.imageUrl || `https://avatar.vercel.sh/${employeeData.id}`} alt={`${employeeData.firstName} ${employeeData.lastName}`} />
                  <AvatarFallback>
                    {employeeData.firstName?.[0]}{employeeData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/employee/${employeeData.id}`} className="text-lg font-medium hover:underline">
                    {employeeData.firstName} {employeeData.lastName}
                  </Link>
                  <p className="text-sm text-muted-foreground">{employeeData.position}</p>
                  <p className="text-sm text-muted-foreground">{employeeData.cluster}</p>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <Link to={`/employee/${employeeData.id}`}>
                      Details anzeigen
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p>Mitarbeiterdaten konnten nicht geladen werden.</p>
                <p className="text-sm text-muted-foreground">ID: {asset.employeeId}</p>
              </div>
            )}
          </>
        ) : (
          <div className="py-2 flex items-center gap-3">
            <User size={20} className="text-muted-foreground opacity-70" />
            <p className="text-muted-foreground">
              Dieses Asset ist keinem Mitarbeiter zugewiesen.
            </p>
          </div>
        )}
        
        {asset.connectedAssetId && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Verbundenes Asset</h3>
            <div className="text-sm">
              <p className="text-muted-foreground">ID: {asset.connectedAssetId}</p>
              <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                <Link to={`/asset/${asset.connectedAssetId}`}>
                  Verbundenes Asset anzeigen
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
