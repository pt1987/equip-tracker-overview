
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { formatDate } from "@/lib/utils";
import { ReceiptText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import { usePurchaseDialog } from "@/hooks/purchase/usePurchaseDialog";
// Fix the import paths - they should be from the current directory, not from a nested "dialogs" directory
import PurchaseOverviewTab from "./PurchaseOverviewTab";
import DocumentTab from "./DocumentTab";
import HistoryTab from "./HistoryTab";

interface PurchaseItemDialogProps {
  item: PurchaseItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const PurchaseItemDialog = memo(({ item, open, onOpenChange, onUpdate }: PurchaseItemDialogProps) => {
  const {
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
  } = usePurchaseDialog(item, onUpdate, onOpenChange);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ReceiptText className="h-5 w-5" />
            Beleg: {item.supplier}
          </DialogTitle>
          <DialogDescription>
            Beleg-ID: {item.id} • Erstellt am: {formatDate(item.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="document">Beleg</TabsTrigger>
            <TabsTrigger value="history">Historie</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <PurchaseOverviewTab
              item={item}
              status={status}
              gobdStatus={gobdStatus}
              notes={notes}
              setStatus={setStatus}
              setGobdStatus={setGobdStatus}
              setNotes={setNotes}
            />
          </TabsContent>
          
          <TabsContent value="document">
            <DocumentTab />
          </TabsContent>
          
          <TabsContent value="history">
            <HistoryTab purchaseId={item.id} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Wird gespeichert..." : "Änderungen speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

PurchaseItemDialog.displayName = "PurchaseItemDialog";

export default PurchaseItemDialog;
