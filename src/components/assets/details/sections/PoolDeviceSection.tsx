
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { AssetFormValues } from "../AssetFormFields";

export default function PoolDeviceSection() {
  const form = useFormContext<AssetFormValues>();

  return (
    <FormField
      control={form.control}
      name="isPoolDevice"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Pool-Gerät</FormLabel>
            <p className="text-sm text-muted-foreground">
              Dieses Gerät kann von verschiedenen Mitarbeitern temporär gebucht werden
            </p>
          </div>
        </FormItem>
      )}
    />
  );
}
