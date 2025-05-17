
import { useState } from "react";
import { PurchaseItem, PurchaseStatus, GoBDStatus } from "@/lib/purchase-list-types";
import { useToast } from "@/hooks/use-toast";

export function usePurchaseDialog(item: PurchaseItem, onUpdate: () => void, onOpenChange: (open: boolean) => void) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [status, setStatus] = useState<PurchaseStatus>(item.status);
  const [gobdStatus, setGobdStatus] = useState<GoBDStatus>(item.gobdStatus);
  const [notes, setNotes] = useState<string>(item.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, this would save the updated item to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Änderungen gespeichert",
        description: "Die Änderungen wurden erfolgreich gespeichert."
      });
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Fehler beim Speichern",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    status,
    setStatus,
    gobdStatus,
    setGobdStatus,
    notes,
    setNotes,
    isSaving,
    handleSave
  };
}
