
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { AssetFormValues } from "./AssetFormSchema";

export default function AssetFormWarranty() {
  const form = useFormContext<AssetFormValues>();
  const hasWarranty = form.watch("hasWarranty");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <FormItem>
                <FormLabel>Garantieablaufdatum</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
      
      {!hasWarranty && (
        <div className="col-span-1 md:col-span-2 flex items-center justify-center h-40">
          <p className="text-muted-foreground">
            Aktivieren Sie die Garantie, um weitere Garantieinformationen einzugeben.
          </p>
        </div>
      )}
    </div>
  );
}
