import { useState, useEffect } from "react";
import { Asset } from "@/lib/types";
import { formatDate, formatCurrency, calculateAgeInMonths } from "@/lib/utils";
import { motion } from "framer-motion";
import { CalendarClock, Euro, Tag, User, Wrench, Pencil, Trash, Cpu, QrCode, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "./StatusBadge";
import { getEmployeeById } from "@/data/employees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
      case "laptop": return "Laptop";
      case "smartphone": return "Smartphone";
      case "tablet": return "Tablet";
      case "mouse": return "Mouse";
      case "keyboard": return "Keyboard";
      case "accessory": return "Accessory";
      default: return "Other";
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

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', asset.id);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Fehler beim Löschen",
          description: error.message,
        });
        return;
      }
      
      onDelete();
      
      toast({
        title: "Asset gelöscht",
        description: `${asset.name} wurde erfolgreich gelöscht.`,
      });
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: err.message || "Ein unbekannter Fehler ist aufgetreten.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 flex-shrink-0 space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <motion.img
              src={getAssetImage()}
              alt={asset.name}
              className="w-full h-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <StatusBadge status={asset.status} size="lg" />
            <div className="text-sm text-muted-foreground">
              ID: <span className="font-mono text-xs">{asset.id.split('-')[0]}...</span>
            </div>
          </div>
          
          <div className="flex gap-2 justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
              className="flex-1"
            >
              <Pencil size={14} className="mr-1.5" />
              Bearbeiten
            </Button>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="flex-1"
                >
                  <Trash size={14} className="mr-1.5" />
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
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Löschen bestätigen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">Allgemein</TabsTrigger>
              <TabsTrigger value="technical">Technische Details</TabsTrigger>
              <TabsTrigger value="assignment">Zuweisung</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="inline-flex items-center px-2 py-1 mb-2 rounded-full bg-secondary text-xs font-medium">
                {getAssetTypeLabel(asset.type)}
              </div>
              <h1 className="text-2xl font-bold mb-2">{asset.name}</h1>
              <p className="text-muted-foreground mb-4">
                {asset.manufacturer} {asset.model}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-blue-100">
                    <CalendarClock size={16} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Kaufdatum</p>
                    <p className="font-medium">{formatDate(asset.purchaseDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-green-100">
                    <Euro size={16} className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Kaufpreis</p>
                    <p className="font-medium">{formatCurrency(asset.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-purple-100">
                    <Tag size={16} className="text-purple-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lieferant</p>
                    <p className="font-medium">{asset.vendor || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-amber-100">
                    <CalendarClock size={16} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Alter</p>
                    <p className="font-medium">{calculateAgeInMonths(asset.purchaseDate)} Monate</p>
                  </div>
                </div>

                {asset.category && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-indigo-100">
                      <FileText size={16} className="text-indigo-700" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Kategorie</p>
                      <p className="font-medium">{asset.category}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Technische Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {asset.serialNumber && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-cyan-100">
                      <Cpu size={16} className="text-cyan-700" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Seriennummer</p>
                      <p className="font-medium font-mono text-sm">{asset.serialNumber}</p>
                    </div>
                  </div>
                )}
                
                {asset.inventoryNumber && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-teal-100">
                      <QrCode size={16} className="text-teal-700" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Inventar-Nr.</p>
                      <p className="font-medium">{asset.inventoryNumber}</p>
                    </div>
                  </div>
                )}
                
                {asset.imei && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-orange-100">
                      <Cpu size={16} className="text-orange-700" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">IMEI</p>
                      <p className="font-medium font-mono text-sm">{asset.imei}</p>
                    </div>
                  </div>
                )}
                
                {asset.hasWarranty !== undefined && (
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-rose-100">
                      <Wrench size={16} className="text-rose-700" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Garantie</p>
                      <p className="font-medium">
                        {asset.hasWarranty ? "Ja" : "Nein"}
                        {asset.additionalWarranty && ", erweitert"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {asset.type === "smartphone" && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-3">Vertragsdaten</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {asset.phoneNumber && (
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Telefonnummer</p>
                          <p className="font-medium">{asset.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                    
                    {asset.provider && (
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Provider</p>
                          <p className="font-medium">{asset.provider}</p>
                        </div>
                      </div>
                    )}
                    
                    {asset.contractName && (
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Vertrag</p>
                          <p className="font-medium">{asset.contractName}</p>
                        </div>
                      </div>
                    )}
                    
                    {asset.contractEndDate && (
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Vertragsende</p>
                          <p className="font-medium">{formatDate(asset.contractEndDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="assignment" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Zugewiesener Mitarbeiter</h2>
              
              {asset.employeeId ? (
                <>
                  {isLoadingEmployee ? (
                    <div className="p-8 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : employeeData ? (
                    <div className="flex items-center gap-4 p-4 rounded-lg border">
                      <Avatar className="h-16 w-16">
                        <AvatarImage 
                          src={employeeData.imageUrl || `https://avatar.vercel.sh/${employeeData.id}`}
                          alt={`${employeeData.firstName} ${employeeData.lastName}`}
                        />
                        <AvatarFallback>
                          {employeeData.firstName?.[0]}{employeeData.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link 
                          to={`/employee/${employeeData.id}`}
                          className="text-lg font-medium hover:underline"
                        >
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
                    <div className="p-4 text-center rounded-lg border bg-muted/50">
                      <p>Mitarbeiterdaten konnten nicht geladen werden.</p>
                      <p className="text-sm text-muted-foreground">ID: {asset.employeeId}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center rounded-lg border bg-muted/50">
                  <User size={32} className="mx-auto text-muted-foreground mb-2 opacity-50" />
                  <p className="text-muted-foreground">
                    Dieses Asset ist keinem Mitarbeiter zugewiesen.
                  </p>
                </div>
              )}
              
              {asset.connectedAssetId && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-3">Verbundenes Asset</h3>
                  <div className="text-sm">
                    <p className="text-muted-foreground">ID: {asset.connectedAssetId}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                      <Link to={`/asset/${asset.connectedAssetId}`}>
                        Verbundenes Asset anzeigen
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
