
import { FC, memo } from "react";
import { PurchaseItem, PurchaseStatus, GoBDStatus } from "@/lib/purchase-list-types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatCurrency } from "@/lib/utils";

interface PurchaseOverviewTabProps {
  item: PurchaseItem;
  status: PurchaseStatus;
  setStatus: (status: PurchaseStatus) => void;
  gobdStatus: GoBDStatus;
  setGobdStatus: (status: GoBDStatus) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const PurchaseOverviewTab: FC<PurchaseOverviewTabProps> = memo(({
  item,
  status,
  setStatus,
  gobdStatus,
  setGobdStatus,
  notes,
  setNotes
}) => {
  return (
    <div className="py-4 space-y-6">
      {/* Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Rechnungsnummer</h3>
          <p className="font-medium">{item.invoiceNumber}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Nettobetrag</h3>
          <p className="font-medium">{formatCurrency(item.netAmount)}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">MwSt. ({item.vatRate}%)</h3>
          <p className="font-medium">{formatCurrency(item.vatAmount)}</p>
        </div>
      </div>

      {/* Booking Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Sachkonto</h3>
          <p className="font-medium">{item.accountNumber}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Kostenstelle</h3>
          <p className="font-medium">{item.costCenter}</p>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Zahlungsart</h3>
          <p className="font-medium">{item.paymentMethod}</p>
        </div>
      </div>

      {/* Status Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Beleg-Status</h3>
        <RadioGroup 
          value={status} 
          onValueChange={(value) => setStatus(value as PurchaseStatus)}
          className="grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="draft" id="draft" />
            <Label htmlFor="draft">Entwurf</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" />
            <Label htmlFor="pending">Prüfung ausstehend</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="approved" id="approved" />
            <Label htmlFor="approved">Genehmigt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rejected" id="rejected" />
            <Label htmlFor="rejected">Abgelehnt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="exported" id="exported" />
            <Label htmlFor="exported">Exportiert</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="archived" id="archived" />
            <Label htmlFor="archived">Archiviert</Label>
          </div>
        </RadioGroup>
      </div>

      {/* GoBD Status Section */}
      <div className="space-y-4">
        <h3 className="font-medium">GoBD-Status</h3>
        <RadioGroup 
          value={gobdStatus} 
          onValueChange={(value) => setGobdStatus(value as GoBDStatus)}
          className="grid grid-cols-3 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="red" id="red" />
            <Label htmlFor="red">Nicht konform</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yellow" id="yellow" />
            <Label htmlFor="yellow">Prüfen</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="green" id="green" />
            <Label htmlFor="green">GoBD-konform</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notizen</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notizen zum Beleg hinzufügen..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
});

PurchaseOverviewTab.displayName = "PurchaseOverviewTab";

export default PurchaseOverviewTab;
