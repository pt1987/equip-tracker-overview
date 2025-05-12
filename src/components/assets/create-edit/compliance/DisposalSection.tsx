
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AssetFormValues } from "../AssetFormSchema";

export default function DisposalSection() {
  const form = useFormContext<AssetFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="disposalMethod"
      render={({ field }) => (
        <FormItem className="col-span-1 md:col-span-2">
          <FormLabel>Entsorgungsmethode</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="Z.B. Datenlöschung nach BSI-Standard, Hardwarerecycling"
            />
          </FormControl>
          <FormDescription>
            Methode zur sicheren Entsorgung am Ende des Lebenszyklus
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
