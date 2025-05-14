
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseItem } from "@/lib/purchase-list-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import PurchaseForm from "./PurchaseForm";
import PurchaseHistoryList from "./PurchaseHistoryList";
import { Button } from "@/components/ui/button";
import { Check, Download, FileText, History, Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface PurchaseItemDialogProps {
  item: PurchaseItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function PurchaseItemDialog({ 
  item, 
  open, 
  onOpenChange, 
  onUpdate 
}: PurchaseItemDialogProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const handleStatusChange = async (newStatus: "approved" | "rejected") => {
    try {
      // In a real implementation, this would update the item status in the database
      console.log(`Changing status to ${newStatus} for item ${item.id}`);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: newStatus === "approved" ? "Einkauf genehmigt" : "Einkauf abgelehnt",
        description: newStatus === "approved" 
          ? "Der Einkauf wurde erfolgreich genehmigt."
          : "Der Einkauf wurde abgelehnt."
      });
      
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Statusänderung fehlgeschlagen",
        description: "Es ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
      console.error("Status change error:", error);
    }
  };
  
  const downloadDocument = () => {
    // In a real implementation, this would download the document
    toast({
      title: "Download gestartet",
      description: "Der Beleg wird heruntergeladen."
    });
  };

  const gobdIndicator = (status: string) => {
    switch (status) {
      case 'red':
        return (
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-red-500">Nicht konform</span>
          </div>
        );
      case 'yellow':
        return (
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-yellow-600">Prüfen</span>
          </div>
        );
      case 'green':
        return (
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-600">GoBD-konform</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                Einkauf Details {item.invoiceNumber && `- ${item.invoiceNumber}`}
              </DialogTitle>
              <DialogDescription>
                {item.supplier} - {formatDate(item.documentDate)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {gobdIndicator(item.gobdStatus)}
            </div>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Belegdaten</TabsTrigger>
            <TabsTrigger value="document">Dokument</TabsTrigger>
            <TabsTrigger value="history">Änderungsverlauf</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            {isEditing ? (
              <PurchaseForm 
                initialData={{
                  documentDate: item.documentDate,
                  supplier: item.supplier,
                  itemDescription: item.itemDescription,
                  quantity: item.quantity,
                  unit: item.unit,
                  netAmount: item.netAmount,
                  vatAmount: item.vatAmount,
                  vatRate: item.vatRate,
                  accountNumber: item.accountNumber,
                  costCenter: item.costCenter,
                  invoiceNumber: item.invoiceNumber,
                  invoiceDate: item.invoiceDate,
                  paymentMethod: item.paymentMethod,
                  paymentDate: item.paymentDate,
                  notes: item.notes,
                }}
                onSuccess={() => {
                  setIsEditing(false);
                  onUpdate();
                }}
                isUpdate={true}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Belegdatum</h4>
                    <p>{formatDate(item.documentDate)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Lieferant</h4>
                    <p>{item.supplier}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Rechnungsnummer</h4>
                    <p>{item.invoiceNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Rechnungsdatum</h4>
                    <p>{formatDate(item.invoiceDate)}</p>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Artikel-/Güterbezeichnung</h4>
                    <p>{item.itemDescription}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Menge</h4>
                    <p>{item.quantity} {item.unit}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Nettobetrag</h4>
                    <p>{formatCurrency(item.netAmount)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">MwSt</h4>
                    <p>{formatCurrency(item.vatAmount)} ({item.vatRate}%)</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Bruttobetrag</h4>
                    <p>{formatCurrency(item.netAmount + item.vatAmount)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Sachkonto</h4>
                    <p>{item.accountNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Kostenstelle</h4>
                    <p>{item.costCenter}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Zahlungsart</h4>
                    <p>
                      {item.paymentMethod === "bank_transfer" && "Überweisung"}
                      {item.paymentMethod === "credit_card" && "Kreditkarte"}
                      {item.paymentMethod === "paypal" && "PayPal"}
                      {item.paymentMethod === "cash" && "Barzahlung"}
                      {item.paymentMethod === "direct_debit" && "Lastschrift"}
                      {item.paymentMethod === "other" && "Sonstige"}
                    </p>
                  </div>
                  {item.paymentDate && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Zahlungsdatum</h4>
                      <p>{formatDate(item.paymentDate)}</p>
                    </div>
                  )}
                  {item.assetId && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Asset-ID</h4>
                      <p>
                        <a 
                          href={`/asset/${item.assetId}`} 
                          className="text-primary hover:underline"
                        >
                          {item.assetId}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
                
                {item.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Notizen</h4>
                    <p className="whitespace-pre-line">{item.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Bearbeiten
                  </Button>
                  
                  <div className="flex gap-2">
                    {item.status === "pending" && (
                      <>
                        <Button 
                          variant="destructive"
                          onClick={() => handleStatusChange("rejected")}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Ablehnen
                        </Button>
                        <Button 
                          variant="default"
                          onClick={() => handleStatusChange("approved")}
                          className="gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Genehmigen
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="document">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Beleg ansehen</h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                Der Beleg ist als PDF hinterlegt und kann heruntergeladen oder direkt angezeigt werden.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={downloadDocument} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={() => window.open("/path/to/document.pdf", "_blank")}>
                  Anzeigen
                </Button>
              </div>
            </div>
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Dokumentinformationen</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Dateiname:</span>
                </div>
                <div>rechnung-12345.pdf</div>
                
                <div>
                  <span className="text-muted-foreground">Dateigröße:</span>
                </div>
                <div>1.2 MB</div>
                
                <div>
                  <span className="text-muted-foreground">Hochgeladen am:</span>
                </div>
                <div>{formatDate(item.createdAt)}</div>
                
                <div>
                  <span className="text-muted-foreground">Hochgeladen von:</span>
                </div>
                <div>Max Mustermann</div>
                
                <div>
                  <span className="text-muted-foreground">OCR-Status:</span>
                </div>
                <div>Erfolgreich verarbeitet</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Änderungshistorie</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Gemäß GoBD wird jede Änderung am Beleg protokolliert und ist hier einsehbar.
              </p>
              <Separator />
              <PurchaseHistoryList purchaseId={item.id} />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
