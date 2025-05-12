
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AssetFormValues } from "../AssetFormSchema";

export default function ReviewDatesSection() {
  const form = useFormContext<AssetFormValues>();
  
  return (
    <>
      <FormField
        control={form.control}
        name="lastReviewDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Letzte Überprüfung</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription>
              Datum der letzten Sicherheitsüberprüfung
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nextReviewDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nächste Überprüfung</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormDescription>
              Fälligkeitsdatum für die nächste Sicherheitsüberprüfung
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  );
}
