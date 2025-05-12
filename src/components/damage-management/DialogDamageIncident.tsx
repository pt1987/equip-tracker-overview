
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DamageIncidentForm } from "./DamageIncidentForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

interface DialogDamageIncidentProps {
  open: boolean;
  onClose: (success?: boolean) => void;
  incidentId: string | null;
}

export function DialogDamageIncident({ open, onClose, incidentId }: DialogDamageIncidentProps) {
  const isMobile = useIsMobile();
  
  const handleSubmit = (values: any) => {
    console.log("Submitting form with values:", values);
    onClose(true);
  };

  // Für mobile Geräte verwenden wir einen Drawer statt eines Dialogs
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
        <DrawerContent className="px-4 max-h-[90vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>
              {incidentId ? "Schadensfall bearbeiten" : "Neuen Schadensfall melden"}
            </DrawerTitle>
            <DrawerDescription>
              {incidentId 
                ? "Aktualisieren Sie die Informationen zu diesem Schadensfall."
                : "Erstellen Sie einen neuen Schadensfall gemäß ISO 27001 Anforderungen."
              }
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-1 pb-6 overflow-y-auto">
            <DamageIncidentForm incidentId={incidentId} onSubmit={handleSubmit} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Für Desktop-Geräte verwenden wir den normalen Dialog
  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="md:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {incidentId ? "Schadensfall bearbeiten" : "Neuen Schadensfall melden"}
          </DialogTitle>
          <DialogDescription>
            {incidentId 
              ? "Aktualisieren Sie die Informationen zu diesem Schadensfall."
              : "Erstellen Sie einen neuen Schadensfall gemäß ISO 27001 Anforderungen."
            }
          </DialogDescription>
        </DialogHeader>
        <DamageIncidentForm incidentId={incidentId} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
