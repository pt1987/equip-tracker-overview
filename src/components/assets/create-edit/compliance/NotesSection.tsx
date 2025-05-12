
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { AssetFormValues } from "../AssetFormSchema";

export default function NotesSection() {
  const form = useFormContext<AssetFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem className="col-span-1 md:col-span-2">
          <FormLabel>Compliance-Notizen</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder="Weitere Hinweise zur Compliance und Sicherheitsvorkehrungen"
              rows={3}
            />
          </FormControl>
          <FormDescription>
            Zusätzliche compliance-relevante Informationen
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
