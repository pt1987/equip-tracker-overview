
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { DamageIncidentForm } from "./DamageIncidentForm";

interface DialogDamageIncidentProps {
  open: boolean;
  onClose: (success?: boolean) => void;
  incidentId: string | null;
}

export function DialogDamageIncident({ open, onClose, incidentId }: DialogDamageIncidentProps) {
  const handleSubmit = (values: any) => {
    console.log("Submitting form with values:", values);
    onClose(true);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="md:max-w-3xl">
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
