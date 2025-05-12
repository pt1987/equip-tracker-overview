
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { AssetFormValues } from "../AssetFormSchema";

export default function PersonalDataSection() {
  const form = useFormContext<AssetFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="isPersonalData"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <FormLabel>Personenbezogene Daten</FormLabel>
            <FormDescription>
              Enthält dieses Asset personenbezogene Daten gemäß DSGVO?
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value as boolean}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
