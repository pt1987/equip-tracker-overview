import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// Schema for the form - moving here to keep it with the form fields
export const assetFormSchema = z.object({
  name: z.string().min(1, "Name wird benötigt"),
  manufacturer: z.string().min(1, "Hersteller wird benötigt"),
  model: z.string().min(1, "Modell wird benötigt"),
  type: z.string().min(1, "Typ wird benötigt"),
  vendor: z.string().min(1, "Lieferant wird benötigt"),
  status: z.string().min(1, "Status wird benötigt"),
  purchaseDate: z.date(),
  price: z.coerce.number().min(0, "Preis kann nicht negativ sein"),
  serialNumber: z.string().optional(),
  inventoryNumber: z.string().optional(),
  additionalWarranty: z.boolean().optional(),
  hasWarranty: z.boolean().optional(),
  warrantyExpiryDate: z.date().optional().nullable(),
  warrantyInfo: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

export default function AssetFormFields() {
  const form = useFormContext<AssetFormValues>();
  const hasWarranty = form.watch("hasWarranty");

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typ</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Typ auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="smartphone">Smartphone</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="mouse">Maus</SelectItem>
                  <SelectItem value="keyboard">Tastatur</SelectItem>
                  <SelectItem value="accessory">Zubehör</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hersteller</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modell</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Kaufdatum</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className="w-full pl-3 text-left font-normal flex justify-between"
                    >
                      {field.value ? (
                        format(field.value, "dd.MM.yyyy")
                      ) : (
                        <span>Datum wählen</span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preis (€)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="vendor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieferant</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status auswählen" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ordered">Bestellt</SelectItem>
                  <SelectItem value="delivered">Geliefert</SelectItem>
                  <SelectItem value="in_use">In Gebrauch</SelectItem>
                  <SelectItem value="defective">Defekt</SelectItem>
                  <SelectItem value="repair">In Reparatur</SelectItem>
                  <SelectItem value="pool">Pool</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seriennummer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="inventoryNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventarnummer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="col-span-1 md:col-span-2 pt-2 border-t mt-4">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5" />
            Garantieinformationen
          </h3>
        </div>
        
        <FormField
          control={form.control}
          name="hasWarranty"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Garantie</FormLabel>
                <FormDescription>
                  Hat dieses Gerät eine Garantie?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {hasWarranty && (
          <>
            <FormField
              control={form.control}
              name="additionalWarranty"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Zusatzgarantie</FormLabel>
                    <FormDescription>
                      Hat dieses Gerät eine erweiterte Garantie?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="warrantyExpiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Garantieablaufdatum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full pl-3 text-left font-normal flex justify-between"
                        >
                          {field.value ? (
                            format(field.value, "dd.MM.yyyy")
                          ) : (
                            <span>Datum wählen</span>
                          )}
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="warrantyInfo"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Garantiedetails</FormLabel>
                  <FormControl>
                    <Input placeholder="Zusätzliche Informationen zur Garantie" {...field} />
                  </FormControl>
                  <FormDescription>
                    Hier können Sie weitere Informationen zur Garantie eingeben (z.B. Garantienummer, Kontaktdaten)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}
