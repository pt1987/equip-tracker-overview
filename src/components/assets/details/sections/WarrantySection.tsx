
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AssetFormValues } from "../AssetFormFields";

export default function WarrantySection() {
  const form = useFormContext<AssetFormValues>();
  const hasWarranty = form.watch("hasWarranty");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Garantie-Informationen</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hasWarranty"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Garantie vorhanden</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {hasWarranty && (
          <>
            <FormField
              control={form.control}
              name="additionalWarranty"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Zusätzliche Garantie</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warrantyExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garantie gültig bis</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''} 
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warrantyInfo"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Garantie-Informationen</FormLabel>
                  <FormControl>
                    <Input placeholder="Garantie-Details" {...field} />
                  </FormControl>
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
