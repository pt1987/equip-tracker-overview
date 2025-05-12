
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLASSIFICATION_LEVELS } from "./ComplianceFormTypes";
import type { AssetFormValues } from "../AssetFormSchema";

export default function ClassificationSection() {
  const form = useFormContext<AssetFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="classification"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Informationsklassifizierung</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Klassifizierung wählen" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {CLASSIFICATION_LEVELS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Klassifizieren Sie die Informationen auf diesem Asset entsprechend ihrer Schutzbedürftigkeit
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
