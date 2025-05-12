
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LIFECYCLE_STAGES } from "./ComplianceFormTypes";
import type { AssetFormValues } from "../AssetFormSchema";

export default function LifecycleSection() {
  const form = useFormContext<AssetFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="lifecycleStage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Lebenszyklus-Phase</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Phase wählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {LIFECYCLE_STAGES.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Aktuelle Phase im Lebenszyklus dieses Assets
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
