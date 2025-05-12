
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset } from "@/lib/types";
import type { AssetFormValues } from "./AssetFormSchema";

interface AssetFormRelationProps {
  assets: Asset[];
}

export default function AssetFormRelation({ assets }: AssetFormRelationProps) {
  const form = useFormContext<AssetFormValues>();
  const watchCategory = form.watch("category");

  if (watchCategory !== "accessory") {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">
          Die Zuordnung ist nur für Zubehör verfügbar. Bitte wählen Sie "Zubehör" als Kategorie.
        </p>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="relatedAssetId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Zugehöriges Gerät</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value || "none"} value={field.value || "none"}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Gerät auswählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Kein zugehöriges Gerät</SelectItem>
              {assets
                .filter(a => ["notebook", "smartphone", "tablet"].includes(a.category))
                .map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.manufacturer} {asset.model}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Wenn dieses Zubehör zu einem anderen Gerät gehört, wählen Sie es hier aus.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
