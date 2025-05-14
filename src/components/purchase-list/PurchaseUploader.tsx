
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, FileText, Calendar } from "lucide-react";
import { PurchaseFormValues, PaymentMethod, TaxRate } from "@/lib/purchase-list-types";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface PurchaseUploaderProps {
  onSuccess: () => void;
}

export default function PurchaseUploader({ onSuccess }: PurchaseUploaderProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formValues, setFormValues] = useState<PurchaseFormValues>({
    documentDate: formatDate(new Date().toISOString()),
    supplier: "",
    itemDescription: "",
    quantity: 1,
    unit: "Stück",
    netAmount: 0,
    vatAmount: 0,
    vatRate: 19,
    accountNumber: "",
    costCenter: "",
    invoiceNumber: "",
    invoiceDate: formatDate(new Date().toISOString()),
    paymentMethod: "bank_transfer"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // In a real implementation, this would upload the file to a server
      // and process it to extract invoice data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Beleg erfolgreich hochgeladen",
        description: "Die Daten wurden extrahiert und können nun bearbeitet werden."
      });
      
      // Simulate extracted data
      setFormValues({
        ...formValues,
        supplier: file?.name.includes("büro") ? "Büro Schmidt GmbH" : "Auto-erkannter Lieferant",
        itemDescription: "Automatisch erkannter Artikel",
        netAmount: 100,
        vatAmount: 19,
        invoiceNumber: `RE-${Math.floor(Math.random() * 10000)}`
      });
      
      setActiveTab("manual");
    } catch (error) {
      toast({
        title: "Fehler beim Hochladen",
        description: "Der Beleg konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // In a real implementation, this would submit the form data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
    } catch (error) {
      toast({
        title: "Fehler beim Speichern",
        description: "Die Daten konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "number" ? parseFloat(value) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: name === "vatRate" ? parseInt(value) : value
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Beleg hochladen</TabsTrigger>
        <TabsTrigger value="manual">Manuelle Erfassung</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upload" className="mt-4">
        <Card className="p-6 border-dashed border-2">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              <FileUp className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Beleg hochladen</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mt-1 mb-4">
                Laden Sie einen Beleg hoch (PDF, JPG, PNG). Die Daten werden automatisch extrahiert und können anschließend bearbeitet werden.
              </p>
              
              <div className="flex flex-col items-center w-full max-w-sm">
                <Label 
                  htmlFor="file-upload" 
                  className="w-full cursor-pointer bg-muted hover:bg-muted/80 transition-colors py-12 px-4 rounded-lg border border-dashed flex flex-col items-center justify-center"
                >
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">Datei auswählen oder hierher ziehen</span>
                  <span className="text-xs text-muted-foreground mt-1">PDF, JPG oder PNG, max. 10 MB</span>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </Label>
                
                {file && (
                  <div className="mt-4 p-2 bg-muted rounded flex items-center gap-2 w-full">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!file || isUploading} 
                className="gap-2"
              >
                <FileUp className="h-4 w-4" />
                {isUploading ? "Wird hochgeladen..." : "Beleg hochladen"}
              </Button>
            </div>
          </form>
        </Card>
      </TabsContent>
      
      <TabsContent value="manual" className="mt-4">
        <Card className="p-6">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="documentDate">Belegdatum</Label>
                <div className="relative">
                  <Input
                    id="documentDate"
                    name="documentDate"
                    type="date"
                    value={formValues.documentDate}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Rechnungsdatum</Label>
                <div className="relative">
                  <Input
                    id="invoiceDate"
                    name="invoiceDate"
                    type="date"
                    value={formValues.invoiceDate}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Lieferant</Label>
                <Input
                  id="supplier"
                  name="supplier"
                  value={formValues.supplier}
                  onChange={handleInputChange}
                  placeholder="z.B. Büro Schmidt GmbH"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Rechnungsnummer</Label>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formValues.invoiceNumber}
                  onChange={handleInputChange}
                  placeholder="z.B. RE-12345"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemDescription">Artikelbeschreibung</Label>
                <Input
                  id="itemDescription"
                  name="itemDescription"
                  value={formValues.itemDescription}
                  onChange={handleInputChange}
                  placeholder="z.B. ThinkPad X1 Carbon"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Menge</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={formValues.quantity}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="unit">Einheit</Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={formValues.unit}
                    onChange={handleInputChange}
                    placeholder="z.B. Stück"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netAmount">Nettobetrag (€)</Label>
                <Input
                  id="netAmount"
                  name="netAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formValues.netAmount}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="vatAmount">MwSt-Betrag (€)</Label>
                  <Input
                    id="vatAmount"
                    name="vatAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formValues.vatAmount}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vatRate">MwSt-Satz</Label>
                  <Select 
                    value={formValues.vatRate.toString()} 
                    onValueChange={(value) => handleSelectChange("vatRate", value)}
                  >
                    <SelectTrigger id="vatRate">
                      <SelectValue placeholder="MwSt auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="19">19%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Sachkonto</Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  value={formValues.accountNumber}
                  onChange={handleInputChange}
                  placeholder="z.B. 4400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="costCenter">Kostenstelle</Label>
                <Input
                  id="costCenter"
                  name="costCenter"
                  value={formValues.costCenter}
                  onChange={handleInputChange}
                  placeholder="z.B. 1000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Zahlungsart</Label>
                <Select 
                  value={formValues.paymentMethod} 
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Zahlungsart wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Überweisung</SelectItem>
                    <SelectItem value="credit_card">Kreditkarte</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Barzahlung</SelectItem>
                    <SelectItem value="direct_debit">Lastschrift</SelectItem>
                    <SelectItem value="other">Andere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isUploading || !formValues.supplier || !formValues.itemDescription} 
                className="gap-2"
              >
                {isUploading ? "Wird gespeichert..." : "Beleg speichern"}
              </Button>
            </div>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
