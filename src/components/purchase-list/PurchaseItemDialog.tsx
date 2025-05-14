
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PurchaseItem, PurchaseStatus, GoBDStatus } from "@/lib/purchase-list-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { AlertCircle, FileText, Check, X, ReceiptText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import PurchaseHistoryList from "./PurchaseHistoryList";

interface PurchaseItemDialogProps {
  item: PurchaseItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function PurchaseItemDialog({ item, open, onOpenChange, onUpdate }: PurchaseItemDialogProps) {
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

  const getGoBDStatusBadge = (status: string) => {
    switch (status) {
      case 'red':
        return <Badge variant="destructive" className="bg-red-500">Nicht konform</Badge>;
      case 'yellow':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Prüfen</Badge>;
      case 'green':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">GoBD-konform</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100">Entwurf</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Prüfung ausstehend</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Genehmigt</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Abgelehnt</Badge>;
      case 'exported':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Exportiert</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-300 text-gray-800">Archiviert</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };
  
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
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
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
                      {getStatusBadge(status)}
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
                      {getGoBDStatusBadge(gobdStatus)}
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
                
                {/* Compliance checklist */}
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="document">
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="bg-muted p-6 rounded-md text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-2 text-lg font-medium">Beleg anzeigen</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Originaler Beleg im {item.documentType.split('/')[1]?.toUpperCase() || 'PDF'}-Format
                </p>
                <Button variant="outline">Dokument herunterladen</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="py-4">
              <PurchaseHistoryList itemId={item.id} />
            </div>
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
}
