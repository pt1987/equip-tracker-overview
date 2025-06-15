
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AssetFormValues } from "../AssetFormFields";

export default function PurchaseInfoSection() {
  const form = useFormContext<AssetFormValues>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="vendor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Verkäufer *</FormLabel>
            <FormControl>
              <Input placeholder="z.B. Amazon" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="purchaseDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kaufdatum *</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} 
                onChange={(e) => field.onChange(new Date(e.target.value))} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preis (€) *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="0.00" 
                value={field.value || ''}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
