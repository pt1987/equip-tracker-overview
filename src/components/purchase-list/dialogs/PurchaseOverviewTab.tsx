
import { formatCurrency, formatDate } from "@/lib/utils";
import { PurchaseItem, PurchaseStatus, GoBDStatus } from "@/lib/purchase-list-types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, GoBDStatusBadge } from "./StatusBadges";
import { AlertCircle, Check, X, Clock } from "lucide-react";
import { memo } from "react";

interface PurchaseOverviewTabProps {
  item: PurchaseItem;
  status: PurchaseStatus;
  gobdStatus: GoBDStatus;
  notes: string;
  setStatus: (status: PurchaseStatus) => void;
  setGobdStatus: (status: GoBDStatus) => void;
  setNotes: (notes: string) => void;
}

const PurchaseOverviewTab = memo(({ 
  item, 
  status, 
  gobdStatus, 
  notes, 
  setStatus, 
  setGobdStatus, 
  setNotes 
}: PurchaseOverviewTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <GeneralInformation item={item} />
          <FinancialInformation item={item} />
          <AccountingInformation item={item} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md space-y-4">
            <div>
              <Label htmlFor="status" className="mb-1 block">Status</Label>
              <div className="flex items-center gap-2">
                <Select value={status} onValueChange={(value) => setStatus(value as PurchaseStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Entwurf</SelectItem>
                    <SelectItem value="pending">Prüfung ausstehend</SelectItem>
                    <SelectItem value="approved">Genehmigt</SelectItem>
                    <SelectItem value="rejected">Abgelehnt</SelectItem>
                    <SelectItem value="exported">Exportiert</SelectItem>
                    <SelectItem value="archived">Archiviert</SelectItem>
                  </SelectContent>
                </Select>
                <StatusBadge status={status} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="gobd-status" className="mb-1 block">GoBD-Konformität</Label>
              <div className="flex items-center gap-2">
                <Select value={gobdStatus} onValueChange={(value) => setGobdStatus(value as GoBDStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="GoBD-Status auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="red">Nicht konform</SelectItem>
                    <SelectItem value="yellow">Prüfen</SelectItem>
                    <SelectItem value="green">GoBD-konform</SelectItem>
                  </SelectContent>
                </Select>
                <GoBDStatusBadge status={gobdStatus} />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes" className="mb-1 block">Notizen</Label>
              <Textarea 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notizen zum Beleg hinzufügen..."
                className="resize-none"
                rows={5}
              />
            </div>
          </div>
          
          <ComplianceChecklist item={item} />
        </div>
      </div>
    </div>
  );
});

PurchaseOverviewTab.displayName = "PurchaseOverviewTab";

// Unterkomponenten
const GeneralInformation = memo(({ item }: { item: PurchaseItem }) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">Allgemeine Informationen</h3>
    <div className="bg-muted p-4 rounded-md space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Lieferant</span>
        <span className="text-sm">{item.supplier}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Belegdatum</span>
        <span className="text-sm">{formatDate(item.documentDate)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Rechnungsnummer</span>
        <span className="text-sm">{item.invoiceNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Rechnungsdatum</span>
        <span className="text-sm">{formatDate(item.invoiceDate)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Zahlungsart</span>
        <span className="text-sm">
          {item.paymentMethod === 'bank_transfer' && 'Überweisung'}
          {item.paymentMethod === 'credit_card' && 'Kreditkarte'}
          {item.paymentMethod === 'paypal' && 'PayPal'}
          {item.paymentMethod === 'cash' && 'Barzahlung'}
          {item.paymentMethod === 'direct_debit' && 'Lastschrift'}
          {item.paymentMethod === 'other' && 'Andere'}
        </span>
      </div>
      {item.paymentDate && (
        <div className="flex justify-between">
          <span className="text-sm font-medium">Zahlungsdatum</span>
          <span className="text-sm">{formatDate(item.paymentDate)}</span>
        </div>
      )}
    </div>
  </div>
));

GeneralInformation.displayName = "GeneralInformation";

const FinancialInformation = memo(({ item }: { item: PurchaseItem }) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">Finanzinformationen</h3>
    <div className="bg-muted p-4 rounded-md space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Artikel</span>
        <span className="text-sm">{item.itemDescription}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Menge</span>
        <span className="text-sm">{item.quantity} {item.unit}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Nettobetrag</span>
        <span className="text-sm font-medium">{formatCurrency(item.netAmount)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">MwSt ({item.vatRate}%)</span>
        <span className="text-sm">{formatCurrency(item.vatAmount)}</span>
      </div>
      <div className="flex justify-between border-t pt-1 mt-1">
        <span className="text-sm font-medium">Bruttobetrag</span>
        <span className="text-sm font-bold">{formatCurrency(item.netAmount + item.vatAmount)}</span>
      </div>
    </div>
  </div>
));

FinancialInformation.displayName = "FinancialInformation";

const AccountingInformation = memo(({ item }: { item: PurchaseItem }) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">Buchhaltungsinformationen</h3>
    <div className="bg-muted p-4 rounded-md space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Sachkonto</span>
        <span className="text-sm">{item.accountNumber}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm font-medium">Kostenstelle</span>
        <span className="text-sm">{item.costCenter}</span>
      </div>
      {item.assetId && (
        <div className="flex justify-between">
          <span className="text-sm font-medium">Asset-ID</span>
          <a 
            href={`/asset/${item.assetId}`} 
            className="text-sm text-primary hover:underline"
          >
            {item.assetId}
          </a>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-sm font-medium">Integrationsdaten-ID</span>
        <span className="text-sm">{item.integrationId}</span>
      </div>
    </div>
  </div>
));

AccountingInformation.displayName = "AccountingInformation";

const ComplianceChecklist = memo(({ item }: { item: PurchaseItem }) => (
  <div>
    <h3 className="text-sm font-medium text-muted-foreground mb-1">GoBD-Konformität</h3>
    <div className="bg-muted p-4 rounded-md space-y-2">
      <div className="flex items-start gap-2">
        {item.gobdStatus === 'green' ? (
          <Check className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
        )}
        <div>
          <span className="text-sm font-medium block">Vollständigkeit der Pflichtfelder</span>
          <span className="text-xs text-muted-foreground">Alle nach GoBD erforderlichen Felder müssen ausgefüllt sein</span>
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        {item.supplier && item.invoiceNumber ? (
          <Check className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <X className="h-5 w-5 text-red-500 mt-0.5" />
        )}
        <div>
          <span className="text-sm font-medium block">Eindeutige Identifizierung</span>
          <span className="text-xs text-muted-foreground">Lieferant und Rechnungsnummer müssen vorhanden sein</span>
        </div>
      </div>
      
      <div className="flex items-start gap-2">
        {item.documentPath ? (
          <Check className="h-5 w-5 text-green-500 mt-0.5" />
        ) : (
          <X className="h-5 w-5 text-red-500 mt-0.5" />
        )}
        <div>
          <span className="text-sm font-medium block">Beleg angehängt</span>
          <span className="text-xs text-muted-foreground">Original oder qualifizierte Kopie muss vorhanden sein</span>
        </div>
      </div>
      
      {/* Show compliance warning if needed */}
      {item.gobdStatus === 'red' && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-md mt-3 flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div className="text-sm text-red-800">
            <span className="font-medium">Nicht GoBD-konform</span>
            <p className="text-xs mt-0.5">Dieser Beleg erfüllt nicht alle GoBD-Anforderungen. Bitte vervollständigen Sie die fehlenden Informationen.</p>
          </div>
        </div>
      )}
    </div>
  </div>
));

ComplianceChecklist.displayName = "ComplianceChecklist";

export default PurchaseOverviewTab;
