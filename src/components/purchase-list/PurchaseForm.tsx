
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PurchaseFormValues, TaxRate, PaymentMethod } from "@/lib/purchase-list-types";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Schema for the purchase form with validation according to German tax requirements
const purchaseFormSchema = z.object({
  documentDate: z.string().min(1, "Belegdatum ist erforderlich"),
  supplier: z.string().min(3, "Lieferantenname muss mindestens 3 Zeichen enthalten"),
  itemDescription: z.string().min(3, "Artikelbeschreibung ist erforderlich"),
  quantity: z.coerce
    .number()
    .min(0.01, "Menge muss größer als 0 sein"),
  unit: z.string().min(1, "Einheit ist erforderlich"),
  netAmount: z.coerce
    .number()
    .min(0, "Nettobetrag kann nicht negativ sein"),
  vatAmount: z.coerce
    .number()
    .min(0, "MwSt-Betrag kann nicht negativ sein"),
  vatRate: z.coerce
    .number()
    .refine(val => [0, 7, 19].includes(val), "Gültiger MwSt-Satz: 0%, 7% oder 19%"),
  accountNumber: z.string().min(1, "Sachkonto ist erforderlich"),
  costCenter: z.string().min(1, "Kostenstelle ist erforderlich"),
  invoiceNumber: z.string().min(1, "Rechnungsnummer ist erforderlich gemäß § 14 UStG"),
  invoiceDate: z.string().min(1, "Rechnungsdatum ist erforderlich"),
  paymentMethod: z.string().min(1, "Zahlungsart ist erforderlich"),
  paymentDate: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

interface PurchaseFormProps {
  initialData?: Partial<PurchaseFormValues>;
  onSuccess: () => void;
  isUpdate?: boolean;
}

export default function PurchaseForm({ initialData, onSuccess, isUpdate = false }: PurchaseFormProps) {
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      documentDate: initialData?.documentDate || new Date().toISOString().split("T")[0],
      supplier: initialData?.supplier || "",
      itemDescription: initialData?.itemDescription || "",
      quantity: initialData?.quantity || 1,
      unit: initialData?.unit || "Stück",
      netAmount: initialData?.netAmount || 0,
      vatAmount: initialData?.vatAmount || 0,
      vatRate: initialData?.vatRate || 19,
      accountNumber: initialData?.accountNumber || "",
      costCenter: initialData?.costCenter || "",
      invoiceNumber: initialData?.invoiceNumber || "",
      invoiceDate: initialData?.invoiceDate || new Date().toISOString().split("T")[0],
      paymentMethod: initialData?.paymentMethod || "bank_transfer",
      paymentDate: initialData?.paymentDate,
      notes: initialData?.notes || "",
    },
  });

  const calculateVat = (netAmount: number, vatRate: number) => {
    return (netAmount * (vatRate / 100));
  };

  const handleNetAmountChange = (value: string) => {
    const netAmount = parseFloat(value) || 0;
    const vatRate = form.getValues("vatRate");
    const vatAmount = calculateVat(netAmount, vatRate);
    form.setValue("vatAmount", parseFloat(vatAmount.toFixed(2)));
  };

  const handleVatRateChange = (value: string) => {
    const netAmount = form.getValues("netAmount");
    const vatRate = parseFloat(value);
    const vatAmount = calculateVat(netAmount, vatRate);
    form.setValue("vatAmount", parseFloat(vatAmount.toFixed(2)));
  };

  const handleSubmit = async (data: PurchaseFormValues) => {
    try {
      // In a real implementation, this would save the data to the database
      console.log("Form data:", data);
      
      // We would validate GoBD compliance here
      
      // We would determine if this requires creating an asset based on the net amount
      const requiresAsset = data.netAmount > 250;
      
      // We would create or update the purchase record
      
      // We would log the action in the history
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Belegdaten */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Belegdaten</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="documentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Belegdatum *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd.MM.yyyy", { locale: de })
                            ) : (
                              <span>Datum wählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                          locale={de}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rechnungsnummer *</FormLabel>
                    <FormControl>
                      <Input placeholder="RE-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Rechnungsdatum *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd.MM.yyyy", { locale: de })
                            ) : (
                              <span>Datum wählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                          locale={de}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieferant *</FormLabel>
                    <FormControl>
                      <Input placeholder="Lieferantenname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="itemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artikel-/Güterbezeichnung *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detaillierte Beschreibung des Artikels oder der Dienstleistung"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Betragsangaben */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Betragsangaben</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menge *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="1.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Einheit *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Einheit wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Stück">Stück</SelectItem>
                        <SelectItem value="Stunde">Stunde</SelectItem>
                        <SelectItem value="Tag">Tag</SelectItem>
                        <SelectItem value="Monat">Monat</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="l">l</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="m²">m²</SelectItem>
                        <SelectItem value="m³">m³</SelectItem>
                        <SelectItem value="Pauschal">Pauschal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="netAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nettobetrag € *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNetAmountChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vatRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MwSt-Satz % *</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleVatRateChange(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="MwSt-Satz wählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="7">7%</SelectItem>
                        <SelectItem value="19">19%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vatAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MwSt € *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Buchhaltungsangaben */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Buchhaltungsangaben</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sachkonto *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sachkonto wählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0001">0001 - Gebäude</SelectItem>
                      <SelectItem value="0410">0410 - Betriebs- und Geschäftsausstattung</SelectItem>
                      <SelectItem value="0650">0650 - Büroeinrichtung</SelectItem>
                      <SelectItem value="0670">0670 - GWG</SelectItem>
                      <SelectItem value="4400">4400 - Bürobedarf</SelectItem>
                      <SelectItem value="4980">4980 - Software-Lizenzen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="costCenter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kostenstelle *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kostenstelle wählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1000">1000 - Allgemeine Verwaltung</SelectItem>
                      <SelectItem value="2000">2000 - IT-Abteilung</SelectItem>
                      <SelectItem value="3000">3000 - Vertrieb</SelectItem>
                      <SelectItem value="4000">4000 - Marketing</SelectItem>
                      <SelectItem value="5000">5000 - Produktion</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zahlungsart *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Zahlungsart wählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Überweisung</SelectItem>
                      <SelectItem value="credit_card">Kreditkarte</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="cash">Barzahlung</SelectItem>
                      <SelectItem value="direct_debit">Lastschrift</SelectItem>
                      <SelectItem value="other">Sonstige</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Zahlungsdatum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "dd.MM.yyyy", { locale: de })
                          ) : (
                            <span>Datum wählen</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        initialFocus
                        locale={de}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notizen</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Zusätzliche Informationen zum Einkauf"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Abbrechen
          </Button>
          <Button type="submit">
            {isUpdate ? "Aktualisieren" : "Einkauf erfassen"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
