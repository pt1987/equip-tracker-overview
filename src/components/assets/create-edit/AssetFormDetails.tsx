
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { AssetFormValues } from "./AssetFormSchema";

export default function AssetFormDetails() {
  const form = useFormContext<AssetFormValues>();
  const watchCategory = form.watch("category");

  if (!["notebook", "smartphone", "tablet"].includes(watchCategory)) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">
          Bitte wählen Sie zuerst eine Kategorie (Notebook, Smartphone oder Tablet),
          um erweiterte Details einzugeben.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {watchCategory === "smartphone" && (
        <>
          <FormField
            control={form.control}
            name="imei"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IMEI</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefonnummer</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="provider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provider</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. Telekom, Vodafone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contractDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vertragslaufzeit</FormLabel>
                <FormControl>
                  <Input placeholder="z.B. 24 Monate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contractName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vertragsbezeichnung</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
